import { spawn } from 'child_process';

async function inspectMirrorAt3400() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9498',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_3400',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9498/json');
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

    const res = await send('Runtime.evaluate', {
      expression: `(async () => {
        window.scrollTo({ top: 3400, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 300));

        // Dispatch mouse move event
        const evt = new MouseEvent('mousemove', { clientX: 300, clientY: 500, bubbles: true });
        window.dispatchEvent(evt);

        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

        const realEl = document.elementFromPoint(300, 500);
        
        // Temporarily remove clipPath so we can inspect element from point in mirror
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const oldClip = clipLayer.style.clipPath;
        clipLayer.style.clipPath = 'none';
        
        const mirrorEl = document.elementFromPoint(300, 500);
        clipLayer.style.clipPath = oldClip;

        return {
          realElement: realEl ? {
            tag: realEl.tagName,
            id: realEl.id,
            className: realEl.className,
            text: realEl.innerText ? realEl.innerText.substring(0, 50) : ''
          } : null,
          mirrorElement: mirrorEl ? {
            tag: mirrorEl.tagName,
            id: mirrorEl.id,
            className: mirrorEl.className,
            text: mirrorEl.innerText ? mirrorEl.innerText.substring(0, 50) : ''
          } : null,
          realBounding: realEl ? realEl.getBoundingClientRect() : null,
          mirrorBounding: mirrorEl ? mirrorEl.getBoundingClientRect() : null
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Inspection Result:', JSON.stringify(res.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

inspectMirrorAt3400();
