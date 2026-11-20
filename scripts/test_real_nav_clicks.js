import { spawn } from 'child_process';

async function testRealNavClicks() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9475',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_real_nav',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9475/json');
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

    const links = ['#about', '#work', '#skills', '#experience', '#contact', '#home'];
    const results = [];

    for (const href of links) {
      const clickRes = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const a = document.querySelector('#main-navbar nav a[href="${href}"]');
            if (!a) return { error: 'Link not found: ${href}' };
            a.click();
            return {
              immediateActive: document.getElementById('main-navbar').getAttribute('data-active-section')
            };
          })()
        `,
        returnByValue: true
      });

      // Wait 1s for smooth scroll to finish
      await new Promise(r => setTimeout(r, 1000));

      const status = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const nav = document.getElementById('main-navbar');
            const target = document.getElementById('${href.slice(1)}');
            const targetRect = target ? target.getBoundingClientRect() : null;
            return {
              href: '${href}',
              immediateActive: ${JSON.stringify(clickRes.result.value?.immediateActive)},
              settledActive: nav.getAttribute('data-active-section'),
              scrollY: window.scrollY,
              targetTop: targetRect ? targetRect.top : null,
              matches: nav.getAttribute('data-active-section') === '${href.slice(1)}'
            };
          })()
        `,
        returnByValue: true
      });

      results.push(status.result.value);
    }

    console.table(results);

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testRealNavClicks();
