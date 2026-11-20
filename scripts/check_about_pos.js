import { spawn } from 'child_process';

async function checkAboutPositions() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9465',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_about_pos',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9465/json');
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

    await send('Runtime.evaluate', {
      expression: `
        document.getElementById('about').scrollIntoView();
      `
    });

    await new Promise((r) => setTimeout(r, 600));

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const rJson = (r) => r ? ({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right }) : null;

          const telemReal = document.querySelectorAll('#about .showcase-active-content .p-3')[0];
          const telemMirror = document.querySelectorAll('#about-mirror .showcase-active-content .p-3')[0];

          return {
            scrollY: window.scrollY,
            telemReal: rJson(telemReal ? telemReal.getBoundingClientRect() : null),
            telemRealText: telemReal ? telemReal.innerText : null,
            telemMirror: rJson(telemMirror ? telemMirror.getBoundingClientRect() : null),
            telemMirrorText: telemMirror ? telemMirror.innerText : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('About Positions:', JSON.stringify(res.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

checkAboutPositions();
