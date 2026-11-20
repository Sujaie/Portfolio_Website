import { spawn } from 'child_process';

async function testFullScrollAudit() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9473',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_audit',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9473/json');
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

    // Scroll incrementally through the whole page in 300px steps
    const maxScroll = await send('Runtime.evaluate', {
      expression: 'document.documentElement.scrollHeight - window.innerHeight',
      returnByValue: true
    });
    const max = maxScroll.result.value;

    console.log('Max scroll height:', max);

    const samples = [];
    for (let y = 0; y <= max; y += 400) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${y}, behavior: 'instant' });`
      });
      // Wait for observer
      await new Promise((r) => setTimeout(r, 150));

      const sample = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const nav = document.getElementById('main-navbar');
            const active = nav ? nav.getAttribute('data-active-section') : null;

            // Which section is ACTUALLY in the viewport focal area?
            // Navbar is 72px. Focal point is ~150px-300px from top of viewport.
            const focalY = window.scrollY + 200;
            const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
            let actualExpected = 'home';
            for (const id of sections) {
              const el = document.getElementById(id);
              if (el) {
                const top = el.offsetTop;
                const bottom = top + el.offsetHeight;
                if (focalY >= top && focalY < bottom) {
                  actualExpected = id;
                  break;
                }
              }
            }

            return {
              scrollY: window.scrollY,
              activeInNavbar: active,
              actualExpectedSection: actualExpected,
              matches: active === actualExpected
            };
          })()
        `,
        returnByValue: true
      });

      samples.push(sample.result.value);
    }

    console.table(samples);

    const mismatches = samples.filter(s => !s.matches);
    console.log(`Mismatches: ${mismatches.length} / ${samples.length}`);
    if (mismatches.length > 0) {
      console.log('Sample mismatches:', mismatches);
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testFullScrollAudit();
