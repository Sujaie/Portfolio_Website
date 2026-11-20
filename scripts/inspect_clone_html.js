import { spawn } from 'child_process';

async function inspectCloneHTML() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9463',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_clone',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9463/json');
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

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const mirror = document.querySelector('.cursor-mirror-element');
          if (!mirror) return { error: 'No mirror element found!' };

          const heroH1 = mirror.querySelector('#home-mirror h1');
          const heroSpan = mirror.querySelector('#home-mirror span.font-serif');
          
          const aboutCard = mirror.querySelector('#about-mirror .showcase-active-content');
          const aboutCardMock = mirror.querySelector('#about-mirror .showcase-active-content [class*="surface-preview"]');

          return {
            heroH1Text: heroH1 ? heroH1.innerText : 'null',
            heroH1Style: heroH1 ? window.getComputedStyle(heroH1).color : 'null',
            heroSpanText: heroSpan ? heroSpan.innerText : 'null',
            heroSpanStyle: heroSpan ? window.getComputedStyle(heroSpan).color : 'null',
            aboutCardFound: !!aboutCard,
            aboutCardHTML: aboutCard ? aboutCard.innerHTML.substring(0, 500) : 'null',
            aboutCardMockFound: !!aboutCardMock,
            aboutCardMockChildrenCount: aboutCardMock ? aboutCardMock.children.length : 0,
            aboutCardMockColor: aboutCardMock ? window.getComputedStyle(aboutCardMock).color : 'null',
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Clone HTML Inspection:', JSON.stringify(res.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

inspectCloneHTML();
