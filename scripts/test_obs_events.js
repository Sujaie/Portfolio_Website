import { spawn } from 'child_process';

async function testObserverEvents() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9472',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_obs',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9472/json');
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

    // Instrument window to record observer entries
    await send('Runtime.evaluate', {
      expression: `
        window.__obsLogs = [];
        const origObs = window.IntersectionObserver;
        window.IntersectionObserver = function(cb, opts) {
          const wrappedCb = (entries, obs) => {
            window.__obsLogs.push({
              time: Date.now(),
              scrollY: window.scrollY,
              entries: entries.map(e => ({
                id: e.target.id,
                isIntersecting: e.isIntersecting,
                intersectionRatio: e.intersectionRatio,
                top: e.boundingClientRect.top
              }))
            });
            return cb(entries, obs);
          };
          return new origObs(wrappedCb, opts);
        };
      `
    });

    // Reload page to let Navbar mount with instrumented IntersectionObserver
    await send('Page.enable');
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll to 800
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo({ top: 800, behavior: 'smooth' });
      `
    });

    await new Promise((r) => setTimeout(r, 1500));

    const logs = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            scrollY: window.scrollY,
            activeAttr: document.getElementById('main-navbar')?.getAttribute('data-active-section'),
            obsLogs: window.__obsLogs || []
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Observer Logs:', JSON.stringify(logs.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testObserverEvents();
