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
  { width: 2560, height: 1440, label: '2560px (4K / Cinema)' },
];

const SECTIONS = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

async function validateLayout() {
  const baseDir = path.resolve('baselines', 'layout-standardized');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9448',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_layout_val',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9448/json');
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

    console.log('=== MULTI-VIEWPORT SECTION LAYOUT & RHYTHM AUDIT ===');
    const report = [];

    for (const vp of VIEWPORTS) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768,
      });
      await new Promise((r) => setTimeout(r, 250));

      const layoutEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasOverflow = docWidth > winWidth;

          // Check alignment of content containers across sections
          const alignments = {};
          ['home', 'about', 'work', 'skills', 'experience', 'contact'].forEach((secId) => {
            const sec = document.getElementById(secId);
            if (sec) {
              const container = sec.querySelector('.max-w-\\\\[var\\\\(--content-max-width\\\\)\\\\]') || sec.querySelector('[class*="max-w-"]');
              if (container) {
                const rect = container.getBoundingClientRect();
                alignments[secId] = {
                  left: Math.round(rect.left),
                  width: Math.round(rect.width),
                  height: Math.round(sec.offsetHeight)
                };
              }
            }
          });

          return {
            docWidth,
            winWidth,
            hasOverflow,
            alignments
          };
        })()`,
        returnByValue: true
      });

      const res = layoutEval.result.value;
      const leftValues = Object.values(res.alignments).map((a) => a.left);
      const isAligned = leftValues.every((val) => Math.abs(val - leftValues[0]) <= 2);

      report.push({
        viewport: vp.label,
        scrollWidth: res.docWidth,
        innerWidth: res.winWidth,
        overflow: res.hasOverflow,
        containersAligned: isAligned,
        containerLeft: leftValues[0] + 'px',
        containerWidth: Object.values(res.alignments)[0]?.width + 'px',
      });

      const vpDir = path.join(baseDir, `${vp.width}px`);
      fs.mkdirSync(vpDir, { recursive: true });

      // Capture desktop and about screenshots
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(vpDir, 'overview.png'), Buffer.from(shot.data, 'base64'));
    }

    console.table(report);

    const hasAnyOverflow = report.some((r) => r.overflow);
    const hasMisalignment = report.some((r) => !r.containersAligned);

    if (hasAnyOverflow || hasMisalignment) {
      console.error('FAIL: Layout validation detected issues!');
      process.exit(1);
    } else {
      console.log('SUCCESS: All 7 viewports verified with perfect alignment and zero overflow!');
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Validation error:', err);
    chrome.kill();
    process.exit(1);
  }
}

validateLayout();
