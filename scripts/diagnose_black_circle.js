import { spawn } from 'child_process';

async function checkBlackCircle() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9497',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_cursor_black',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9497/json');
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

    // Scroll to 3400 and move mouse over (300, 500)
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 3400);` });
    await new Promise(r => setTimeout(r, 100));

    // Dispatch real mouse move with animation loop wait
    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300, clientY: 500, bubbles: true }));
        return new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              const lens = document.querySelector('[class*="z-[9999]"]');
              const clipLayer = document.querySelector('[class*="z-[9990]"]');
              const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
              const mirrorRoot = contentMirror ? contentMirror.firstElementChild : null;
              
              resolve({
                scrollY: window.scrollY,
                contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
                mirrorComputedBg: mirrorRoot ? window.getComputedStyle(mirrorRoot).backgroundColor : 'none',
                mirrorRect: mirrorRoot ? mirrorRoot.getBoundingClientRect() : null,
                mirrorHeight: mirrorRoot ? mirrorRoot.offsetHeight : 0,
                pageHeight: document.body.offsetHeight,
                clipLayerClipPath: clipLayer ? clipLayer.style.clipPath : 'none',
                // What element in the mirror is under (300, 500)?
                // Note: transX = (1 - 1.38)*300 - 1.38*0 = -114px
                // transY = (1 - 1.38)*500 - 1.38*3400 = -190 - 4692 = -4882px
              });
            });
          });
        });
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Black Circle Diagnosis:', JSON.stringify(result.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

checkBlackCircle();
