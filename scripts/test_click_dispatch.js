import { spawn } from 'child_process';

async function testClickDispatch() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9474',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_click',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9474/json');
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

    const clickInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('header a')).map(a => ({
            text: a.innerText,
            href: a.getAttribute('href'),
            visible: a.offsetWidth > 0 && a.offsetHeight > 0,
            rect: a.getBoundingClientRect()
          }));
          return links;
        })()
      `,
      returnByValue: true
    });

    console.log('Header links found:', JSON.stringify(clickInfo.result.value, null, 2));

    // Now test clicking with Input.dispatchMouseEvent
    const aboutLinkRect = clickInfo.result.value.find(l => l.href === '#about')?.rect;
    console.log('About link rect:', aboutLinkRect);

    if (aboutLinkRect) {
      const x = aboutLinkRect.left + aboutLinkRect.width / 2;
      const y = aboutLinkRect.top + aboutLinkRect.height / 2;

      await send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x,
        y,
        button: 'left',
        clickCount: 1
      });
      await send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x,
        y,
        button: 'left',
        clickCount: 1
      });

      console.log('Dispatched mouse click on ABOUT link at', x, y);

      await new Promise(r => setTimeout(r, 1200));

      const after = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const nav = document.getElementById('main-navbar');
            return {
              scrollY: window.scrollY,
              activeAttr: nav ? nav.getAttribute('data-active-section') : null
            };
          })()
        `,
        returnByValue: true
      });

      console.log('After clicking ABOUT:', after.result.value);
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testClickDispatch();
