import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { width: 360, height: 740, label: '360px (Small Mobile)' },
  { width: 390, height: 844, label: '390px (Standard Mobile)' },
  { width: 768, height: 1024, label: '768px (Tablet)' },
  { width: 1024, height: 768, label: '1024px (Small Desktop)' },
  { width: 1440, height: 900, label: '1440px (Desktop)' },
  { width: 1920, height: 1080, label: '1920px (Ultrawide Desktop)' },
];

async function validateTypography() {
  const baseDir = path.resolve('baselines', 'typography');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9446',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_typo_val',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9446/json');
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes('localhost:5173'));
    if (!tab || !tab.webSocketDebuggerUrl) {
      throw new Error('Could not find Chrome tab');
    }

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    const send = (method, params = {}) => {
      const msgId = id++;
      return new Promise((resolve, reject) => {
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    await send('Runtime.evaluate', {
      expression: 'document.fonts.ready',
      awaitPromise: true,
    });
    await new Promise((r) => setTimeout(r, 500));

    console.log('=== MULTI-VIEWPORT RESPONSIVE TYPOGRAPHY AUDIT ===');
    const results = [];

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768,
      });
      await new Promise((r) => setTimeout(r, 300));

      const evalMetrics = await send('Runtime.evaluate', {
        expression: `(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasHorizontalScroll = docWidth > winWidth;

          // Hero headline elements
          const heroRow1 = document.querySelector('#home h1');
          const heroAccent = document.querySelector('#home span.font-serif');
          const sectionH2 = document.querySelector('#work h2');
          const bodyText = document.querySelector('#about p');
          const navBrand = document.querySelector('#main-navbar a');

          return {
            docWidth,
            winWidth,
            hasHorizontalScroll,
            heroRow1Size: heroRow1 ? getComputedStyle(heroRow1).fontSize : null,
            heroAccentSize: heroAccent ? getComputedStyle(heroAccent).fontSize : null,
            sectionH2Size: sectionH2 ? getComputedStyle(sectionH2).fontSize : null,
            bodyTextSize: bodyText ? getComputedStyle(bodyText).fontSize : null,
            navBrandSize: navBrand ? getComputedStyle(navBrand).fontSize : null,
          };
        })()`,
        returnByValue: true
      });

      const metrics = evalMetrics.result.value;
      results.push({ viewport: vp.label, ...metrics });

      // Save screenshot
      const vpDir = path.join(baseDir, `${vp.width}px`);
      fs.mkdirSync(vpDir, { recursive: true });

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(vpDir, 'home.png'), Buffer.from(shot.data, 'base64'));
    }

    console.table(results);

    const hasAnyOverflow = results.some((r) => r.hasHorizontalScroll);
    if (hasAnyOverflow) {
      console.error('FAIL: Detected horizontal scroll overflow on some viewports!');
      process.exit(1);
    } else {
      console.log('SUCCESS: All 6 viewports validated with zero horizontal overflow!');
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Validation error:', err);
    chrome.kill();
    process.exit(1);
  }
}

validateTypography();
