import { spawn } from 'child_process';

async function checkSections() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9470',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_sections',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9470/json');
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

    const sectionsInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
          return sections.map(id => {
            const el = document.getElementById(id);
            if (!el) return { id, error: 'not found' };
            const r = el.getBoundingClientRect();
            const top = el.offsetTop;
            const height = el.offsetHeight;
            return { id, top, height, bottom: top + height };
          });
        })()
      `,
      returnByValue: true
    });

    console.log('Sections Info:', JSON.stringify(sectionsInfo.result.value, null, 2));

    // Now let's test clicking each nav link one by one, wait for scroll, and check activeSection
    const links = ['#home', '#about', '#work', '#skills', '#experience', '#contact'];
    for (const link of links) {
      console.log('\\n--- Clicking link', link, '---');
      await send('Runtime.evaluate', {
        expression: `
          const a = document.querySelector('header a[href="${link}"]');
          if (a) a.click();
        `
      });

      // Wait 1.2s for smooth scroll to finish
      await new Promise((r) => setTimeout(r, 1200));

      const status = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const nav = document.getElementById('main-navbar');
            const activeAttr = nav ? nav.getAttribute('data-active-section') : null;
            const scrollY = window.scrollY;
            const targetEl = document.getElementById('${link.slice(1)}');
            const targetRect = targetEl ? targetEl.getBoundingClientRect() : null;
            return {
              target: '${link}',
              activeAttr,
              scrollY,
              targetTop: targetRect ? targetRect.top : null,
              matches: activeAttr === '${link.slice(1)}'
            };
          })()
        `,
        returnByValue: true
      });

      console.log('Click result:', JSON.stringify(status.result.value, null, 2));
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

checkSections();
