import { spawn } from 'child_process';

async function checkSkillsCard() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9480',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_check_skills',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9480/json');
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
      expression: `window.scrollTo({ top: 4000, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 400));

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const realCard = document.querySelector('#skills .skill-card');
        const mirrorCard = document.querySelector('.cursor-mirror-element #skills-mirror .skill-card, .cursor-mirror-element .skill-card');
        return {
          realCardOpacity: realCard ? window.getComputedStyle(realCard).opacity : 'none',
          realCardTransform: realCard ? realCard.style.transform : 'none',
          mirrorCardOpacity: mirrorCard ? window.getComputedStyle(mirrorCard).opacity : 'none',
          mirrorCardTransform: mirrorCard ? mirrorCard.style.transform : 'none',
          mirrorCardStyle: mirrorCard ? mirrorCard.getAttribute('style') : 'none'
        };
      })()`,
      returnByValue: true
    });

    console.log('Skills Card Diagnostic:', JSON.stringify(result.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

checkSkillsCard();
