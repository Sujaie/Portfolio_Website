import { spawn } from 'child_process';

async function testMirror() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9457',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_mag3',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9457/json');
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

    // Dispatch mouse move
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 500,
      y: 400
    });

    await new Promise((r) => setTimeout(r, 600));

    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const rJson = (r) => r ? ({ top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom, right: r.right }) : null;
          
          const realAbout = document.getElementById('about');
          const realHeading = realAbout.querySelector('h2');

          const mirrorAbout = document.getElementById('about-mirror');
          const mirrorHeading = mirrorAbout ? mirrorAbout.querySelector('h2') : null;

          const clipLayer = document.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
          const contentMirror = document.querySelector('.cursor-mirror-element');
          const contentMirrorContainer = contentMirror ? contentMirror.parentElement : null;

          return {
            windowScrollY: window.scrollY,
            realAbout: rJson(realAbout.getBoundingClientRect()),
            realHeading: rJson(realHeading.getBoundingClientRect()),
            mirrorAbout: rJson(mirrorAbout ? mirrorAbout.getBoundingClientRect() : null),
            mirrorHeading: rJson(mirrorHeading ? mirrorHeading.getBoundingClientRect() : null),
            clipLayer: rJson(clipLayer ? clipLayer.getBoundingClientRect() : null),
            clipLayerStyle: clipLayer ? clipLayer.getAttribute('style') : null,
            contentMirrorContainerStyle: contentMirrorContainer ? contentMirrorContainer.getAttribute('style') : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Result:', JSON.stringify(check.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testMirror();
