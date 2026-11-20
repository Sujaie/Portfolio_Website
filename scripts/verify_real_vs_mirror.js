import { spawn } from 'child_process';

async function verify() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9488',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_verify_test',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9488/json');
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

    // Test mouse at (500, 400)
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 500,
      y: 400
    });

    await new Promise(r => setTimeout(r, 400));

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
        
        // Hide clipLayer to inspect real element
        clipLayer.style.display = 'none';
        const realEl = document.elementFromPoint(500, 400);
        clipLayer.style.display = 'block';

        // What is at (500, 400) inside contentMirror?
        // Let's find element inside mirror
        return {
          cursor: { x: 500, y: 400 },
          contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
          realElement: realEl ? {
            tag: realEl.tagName,
            className: realEl.className,
            text: realEl.innerText ? realEl.innerText.slice(0, 40) : ''
          } : null
        };
      })()`,
      returnByValue: true
    });

    await send('Page.enable');
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('fs');
    fs.writeFileSync('baselines/cursor/software_magnified.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved baselines/cursor/software_magnified.png');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

verify();
