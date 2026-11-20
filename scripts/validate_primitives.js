import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function validatePrimitives() {
  const baseDir = path.resolve('baselines', 'primitives');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9447',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_prim_val',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9447/json');
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

    console.log('--- TEST 1: COMPUTED PRIMITIVES & TOKENS ---');
    const primRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = getComputedStyle(document.documentElement);
        const card = document.querySelector('#work [class*="rounded-"]');
        const cardRadius = card ? getComputedStyle(card).borderRadius : null;
        const nav = document.querySelector('#main-navbar');
        const navPaddingLeft = nav ? getComputedStyle(nav).paddingLeft : null;

        return {
          tokens: {
            pageGutter: root.getPropertyValue('--page-gutter').trim(),
            sectionPy: root.getPropertyValue('--section-py').trim(),
            contentMaxWidth: root.getPropertyValue('--content-max-width').trim(),
            radiusXl: root.getPropertyValue('--radius-xl').trim(),
            durBase: root.getPropertyValue('--dur-base').trim(),
            durFast: root.getPropertyValue('--dur-fast').trim(),
          },
          computed: {
            cardRadius,
            navPaddingLeft,
          }
        };
      })()`,
      returnByValue: true
    });
    console.log(JSON.stringify(primRes.result.value, null, 2));

    console.log('--- TEST 2: REDUCED MOTION VALIDATION ---');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
    });
    await new Promise((r) => setTimeout(r, 300));

    const reducedRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const root = getComputedStyle(document.documentElement);
        const pulseEl = document.querySelector('#home [class*="animate-pulse"]');
        const pulseAnimDuration = pulseEl ? getComputedStyle(pulseEl).animationDuration : null;
        const durFast = root.getPropertyValue('--dur-fast').trim();
        const durBase = root.getPropertyValue('--dur-base').trim();

        return {
          durFast,
          durBase,
          pulseAnimDuration
        };
      })()`,
      returnByValue: true
    });
    console.log('Reduced motion audit results:', JSON.stringify(reducedRes.result.value, null, 2));

    console.log('--- TEST 3: RESPONSIVE HORIZONTAL OVERFLOW CHECK ---');
    const viewports = [360, 390, 768, 1024, 1440, 1920];
    const overflowChecks = [];
    for (const width of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height: 900,
        deviceScaleFactor: 1,
        mobile: width <= 768,
      });
      await new Promise((r) => setTimeout(r, 200));

      const check = await send('Runtime.evaluate', {
        expression: `({
          width: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth
        })`,
        returnByValue: true
      });
      overflowChecks.push(check.result.value);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(baseDir, `${width}px-home.png`), Buffer.from(shot.data, 'base64'));
    }
    console.table(overflowChecks);

    ws.close();
    chrome.kill();
    console.log('Task 4 visual primitives validation complete!');
  } catch (err) {
    console.error('Validation error:', err);
    chrome.kill();
    process.exit(1);
  }
}

validatePrimitives();
