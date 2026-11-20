import { spawn } from 'child_process';
import fs from 'fs';

async function testExactTelem() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9466',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_telem',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9466/json');
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

    // Get exact center of "ENGINE STATE OPTIMIZED"
    const center = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const telem = document.querySelectorAll('#about .showcase-active-content .p-3')[0];
          const rect = telem.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          };
        })()
      `,
      returnByValue: true
    });

    const c = center.result.value;
    console.log('Telem center on screen:', c);

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: c.x,
      y: c.y
    });

    await new Promise((r) => setTimeout(r, 800));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const rJson = (r) => r ? ({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right }) : null;

          const telemReal = document.querySelectorAll('#about .showcase-active-content .p-3')[0];
          const telemMirror = document.querySelectorAll('#about-mirror .showcase-active-content .p-3')[0];
          const clipLayer = document.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
          const contentMirror = document.querySelector('.cursor-mirror-element');

          return {
            scrollY: window.scrollY,
            telemReal: rJson(telemReal.getBoundingClientRect()),
            telemMirror: rJson(telemMirror.getBoundingClientRect()),
            clipLayerStyle: clipLayer ? clipLayer.getAttribute('style') : null,
            contentMirrorTransform: contentMirror ? contentMirror.parentElement.style.transform : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Result at mouse position:', JSON.stringify(check.result.value, null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('baselines/exact_telem_test.png', Buffer.from(shot.data, 'base64'));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testExactTelem();
