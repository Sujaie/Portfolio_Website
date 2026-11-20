import { spawn } from 'child_process';
import fs from 'fs';

async function testExactUserPosition() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9460',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_user_pos2',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9460/json');
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

    // Scroll about into view
    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('about').scrollIntoView();
      `
    });

    await new Promise((r) => setTimeout(r, 600));

    // Get position between "intention & intelligence" and the showcase card
    const target = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const card = document.querySelector('.showcase-active-content');
          const cardRect = card ? card.getBoundingClientRect() : null;
          if (cardRect) {
            return {
              x: cardRect.left - 30,
              y: cardRect.top + 50
            };
          }
          return { x: 500, y: 400 };
        })()
      `,
      returnByValue: true
    });

    const pos = target.result.value;
    console.log('Targeting user position:', pos);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: pos.x,
      y: pos.y
    });

    await new Promise((r) => setTimeout(r, 800));

    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('baselines/user_position_test.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to baselines/user_position_test.png');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testExactUserPosition();
