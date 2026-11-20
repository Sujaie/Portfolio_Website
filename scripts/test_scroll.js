import { spawn } from 'child_process';

async function testScroll() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9471',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_scroll',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9471/json');
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

    const res1 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('about');
          el.scrollIntoView({ behavior: 'smooth' });
          return { scrollYBefore: window.scrollY };
        })()
      `,
      returnByValue: true
    });
    console.log('ScrollIntoView called:', res1.result.value);

    await new Promise((r) => setTimeout(r, 1000));

    const res2 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            scrollYAfter1s: window.scrollY,
            htmlScrollTop: document.documentElement.scrollTop,
            bodyScrollTop: document.body.scrollTop,
          };
        })()
      `,
      returnByValue: true
    });
    console.log('After 1s:', res2.result.value);

    // Now try window.scrollTo
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo(0, 1000);
      `
    });

    await new Promise((r) => setTimeout(r, 500));

    const res3 = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const nav = document.getElementById('main-navbar');
          return {
            scrollYAfterWindowScroll: window.scrollY,
            activeAttr: nav ? nav.getAttribute('data-active-section') : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('After window.scrollTo(0, 1000):', res3.result.value);

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testScroll();
