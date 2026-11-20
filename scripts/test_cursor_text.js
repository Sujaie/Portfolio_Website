import { spawn } from 'child_process';
import fs from 'fs';

async function testCursorOverText() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9458',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_mag4',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9458/json');
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

    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('about').scrollIntoView();
      `
    });

    await new Promise((r) => setTimeout(r, 600));

    // Get the exact center of "Crafting systems"
    const targetPos = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const heading = document.querySelector('#about h2');
          const italic = heading ? heading.querySelector('span') : null;
          if (italic) {
            const rect = italic.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return { x: 250, y: 350 };
        })()
      `,
      returnByValue: true
    });

    const pos = targetPos.result.value;
    console.log('Targeting position:', pos);

    // Dispatch mouse move
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.x,
      y: pos.y
    });

    await new Promise((r) => setTimeout(r, 800));

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('baselines/magnifier_text_test.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to baselines/magnifier_text_test.png');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testCursorOverText();
