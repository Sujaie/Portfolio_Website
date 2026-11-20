import { spawn } from 'child_process';

async function testTransform() {
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

    const result = await send('Runtime.evaluate', {
      expression: `(async () => {
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
        
        const beforeTransform = contentMirror ? contentMirror.style.transform : 'none';

        // Dispatch a real mouse move
        window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500, clientY: 400, bubbles: true }));

        // Wait 100ms
        await new Promise(r => setTimeout(r, 100));

        const afterTransform = contentMirror ? contentMirror.style.transform : 'none';
        const clipPath = clipLayer ? clipLayer.style.clipPath : 'none';
        const lens = document.querySelector('[class*="z-[9999]"]');
        const lensTransform = lens ? lens.style.transform : 'none';

        return {
          beforeTransform,
          afterTransform,
          clipPath,
          lensTransform
        };
      })()`,
      awaitPromise: true,
      returnByValue: true
    });

    console.log('Transform test:', JSON.stringify(result.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testTransform();
