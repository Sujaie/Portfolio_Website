import { spawn } from 'child_process';

async function testAlignment() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9499',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_align_test',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9499/json');
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

    // Get position of "CREATIVE" heading (first h1)
    const getPos = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('h1');
        const rect = el.getBoundingClientRect();
        return {
          x: Math.round(rect.left + rect.width / 2),
          y: Math.round(rect.top + rect.height / 2),
          rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
        };
      })()`,
      returnByValue: true
    });
    const target = getPos.result.value;

    // Dispatch native mouse movement to center of target
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: target.x,
      y: target.y
    });

    await new Promise(r => setTimeout(r, 400));

    // Measure real vs mirror coordinates
    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const realEl = document.querySelector('h1');
        const realRect = realEl.getBoundingClientRect();
        const realCenterX = realRect.left + realRect.width / 2;
        const realCenterY = realRect.top + realRect.height / 2;

        const mirrorEl = document.querySelector('.cursor-mirror-element h1');
        const mirrorRect = mirrorEl.getBoundingClientRect();
        const mirrorCenterX = mirrorRect.left + mirrorRect.width / 2;
        const mirrorCenterY = mirrorRect.top + mirrorRect.height / 2;

        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const contentMirror = clipLayer ? clipLayer.firstElementChild : null;

        return {
          target: { x: ${target.x}, y: ${target.y} },
          contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
          realCenter: { x: realCenterX, y: realCenterY },
          mirrorCenter: { x: mirrorCenterX, y: mirrorCenterY },
          deltaX: (mirrorCenterX - realCenterX).toFixed(2),
          deltaY: (mirrorCenterY - realCenterY).toFixed(2),
          ratioWidth: (mirrorRect.width / realRect.width).toFixed(3),
          ratioHeight: (mirrorRect.height / realRect.height).toFixed(3),
          realRect: { left: realRect.left, top: realRect.top, width: realRect.width, height: realRect.height },
          mirrorRect: { left: mirrorRect.left, top: mirrorRect.top, width: mirrorRect.width, height: mirrorRect.height }
        };
      })()`,
      returnByValue: true
    });

    console.log('Real vs Mirror Alignment:', JSON.stringify(result.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testAlignment();
