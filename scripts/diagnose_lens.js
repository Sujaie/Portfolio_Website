import { spawn } from 'child_process';

async function diagnose() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9496',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_cursor_diag',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9496/json');
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

    // Check at scroll 0
    let res = await send('Runtime.evaluate', {
      expression: `(() => {
        const evt = new MouseEvent('mousemove', { clientX: 400, clientY: 350, bubbles: true });
        window.dispatchEvent(evt);
        const lens = document.querySelector('[class*="z-[9999]"]');
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
        return {
          lensVisible: lens ? window.getComputedStyle(lens).opacity : 'no-lens',
          lensTransform: lens ? lens.style.transform : 'none',
          clipPath: clipLayer ? clipLayer.style.clipPath : 'none',
          clipLayerOpacity: clipLayer ? window.getComputedStyle(clipLayer).opacity : 'none',
          contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
          contentMirrorRect: contentMirror ? contentMirror.getBoundingClientRect() : null,
          contentSourceRect: document.querySelector('[data-magnifier-source]').getBoundingClientRect()
        };
      })()`,
      returnByValue: true
    });
    console.log('Scroll 0 Diagnosis:', JSON.stringify(res.result.value, null, 2));

    // Check at scroll 3400
    res = await send('Runtime.evaluate', {
      expression: `(() => {
        window.scrollTo({ top: 3400, behavior: 'instant' });
        const evt = new MouseEvent('mousemove', { clientX: 300, clientY: 500, bubbles: true });
        window.dispatchEvent(evt);
        const lens = document.querySelector('[class*="z-[9999]"]');
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
        return {
          scrollX: window.scrollX,
          scrollY: window.scrollY,
          lensVisible: lens ? window.getComputedStyle(lens).opacity : 'no-lens',
          lensTransform: lens ? lens.style.transform : 'none',
          clipPath: clipLayer ? clipLayer.style.clipPath : 'none',
          contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
          contentMirrorRect: contentMirror ? contentMirror.getBoundingClientRect() : null,
          contentSourceRect: document.querySelector('[data-magnifier-source]').getBoundingClientRect()
        };
      })()`,
      returnByValue: true
    });
    console.log('Scroll 3400 Diagnosis:', JSON.stringify(res.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

diagnose();
