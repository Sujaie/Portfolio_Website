import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function testMagnifierVisuals() {
  const baseDir = path.resolve('baselines', 'magnifier_fixes');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9462',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_mag_vis',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9462/json');
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes('localhost:5173'));
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
    await send('Runtime.enable');
    await send('Page.enable');

    // 1. Test Hero Section
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 350,
      y: 350
    });
    await new Promise((r) => setTimeout(r, 600));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '01_hero_magnifier.png'), Buffer.from(shot.data, 'base64'));

    // 2. Scroll to About Section
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('about').scrollIntoView();
      `
    });
    await new Promise((r) => setTimeout(r, 600));

    // 3. Test About Section text ("Crafting systems")
    const textTarget = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heading = document.querySelector('#about h2 span');
          const rect = heading.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `,
      returnByValue: true
    });
    const textPos = textTarget.result.value;
    console.log('Text pos:', textPos);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: textPos.x,
      y: textPos.y
    });
    await new Promise((r) => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '02_about_text_magnifier.png'), Buffer.from(shot.data, 'base64'));

    // 4. Test About Section card border (user's exact problem spot)
    const cardTarget = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('#about .showcase-active-content');
          const rect = card.getBoundingClientRect();
          return { x: rect.left - 40, y: rect.top + 60 };
        })()
      `,
      returnByValue: true
    });
    const cardPos = cardTarget.result.value;
    console.log('Card pos:', cardPos);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: cardPos.x,
      y: cardPos.y
    });
    await new Promise((r) => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '03_about_card_spot_magnifier.png'), Buffer.from(shot.data, 'base64'));

    // 5. Test About Section inside the showcase card (telemetry grid)
    const telemetryTarget = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const telem = document.querySelector('#about [class*="OPTIMIZED"]');
          const rect = telem ? telem.getBoundingClientRect() : { left: 700, top: 350, width: 50, height: 20 };
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `,
      returnByValue: true
    });
    const telemPos = telemetryTarget.result.value;
    console.log('Telemetry pos:', telemPos);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: telemPos.x,
      y: telemPos.y
    });
    await new Promise((r) => setTimeout(r, 600));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '04_about_telemetry_magnifier.png'), Buffer.from(shot.data, 'base64'));

    console.log('All screenshots captured in baselines/magnifier_fixes/');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testMagnifierVisuals();
