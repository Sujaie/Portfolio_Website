import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 3, isMobile: true },
];

const SECTIONS = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

async function run() {
  const baseDir = path.resolve('baselines');
  for (const vp of VIEWPORTS) {
    fs.mkdirSync(path.join(baseDir, vp.name), { recursive: true });
  }
  fs.mkdirSync(path.join(baseDir, 'reduced-motion'), { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9444',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_baseline_prof',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9444/json');
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

    // Wait for fonts
    await send('Runtime.evaluate', {
      expression: 'document.fonts.ready',
      awaitPromise: true,
    });
    await new Promise((r) => setTimeout(r, 500));

    // Capture each viewport & section
    for (const vp of VIEWPORTS) {
      console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.isMobile,
      });
      await new Promise((r) => setTimeout(r, 300));

      for (const section of SECTIONS) {
        // Scroll into view
        await send('Runtime.evaluate', {
          expression: `
            const el = document.getElementById("${section}");
            if (el) el.scrollIntoView();
          `,
        });
        await new Promise((r) => setTimeout(r, 600));

        const shot = await send('Page.captureScreenshot', {
          format: 'png',
        });

        const filePath = path.join(baseDir, vp.name, `${section}.png`);
        fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
        console.log(`Saved baseline: ${filePath}`);
      }
    }

    // Test reduced motion
    console.log('Testing reduced motion...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await new Promise((r) => setTimeout(r, 400));

    for (const section of SECTIONS) {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById("${section}");
          if (el) el.scrollIntoView();
        `,
      });
      await new Promise((r) => setTimeout(r, 500));
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(baseDir, 'reduced-motion', `${section}.png`);
      fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved reduced motion baseline: ${filePath}`);
    }

    console.log('All visual baselines successfully captured!');
    chrome.kill();
    process.exit(0);
  } catch (err) {
    console.error('Capture error:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
