import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function auditCursor() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9495',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_cursor_audit',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9495/json');
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
    await send('Page.enable');

    // 1. Audit DOM structures
    const domAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const lenses = document.querySelectorAll('[aria-hidden="true"]');
        const mirrorElements = document.querySelectorAll('.cursor-mirror-element');
        const mainNavbar = document.getElementById('main-navbar');
        const contentSource = document.querySelector('[data-magnifier-source]');
        const mirrorNodes = contentSource ? document.querySelectorAll('.cursor-mirror-element *').length : 0;
        return {
          totalLenses: document.querySelectorAll('[class*="z-[9999]"]').length,
          hasClipLayer: !!document.querySelector('[class*="z-[9990]"]'),
          mirrorElementCount: mirrorElements.length,
          mirrorSubtreeNodeCount: mirrorNodes,
          realMainNodeCount: contentSource ? contentSource.querySelectorAll('*').length : 0
        };
      })()`,
      returnByValue: true
    });

    console.log('DOM Audit Results:', JSON.stringify(domAudit.result.value, null, 2));

    // 2. Test positioning & magnification across 5 sections
    const testPositions = [
      { name: 'hero_headline', x: 400, y: 350, scrollY: 0 },
      { name: 'navbar_link', x: 450, y: 30, scrollY: 0 },
      { name: 'about_statement', x: 300, y: 300, scrollY: 850 },
      { name: 'projects_card', x: 400, y: 400, scrollY: 1750 },
      { name: 'contact_link', x: 300, y: 500, scrollY: 3400 }
    ];

    const outDir = path.resolve('baselines', 'cursor');
    fs.mkdirSync(outDir, { recursive: true });

    for (const pos of testPositions) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${pos.scrollY}, behavior: 'instant' });`
      });
      await new Promise(r => setTimeout(r, 200));

      // Dispatch mouse move event
      await send('Runtime.evaluate', {
        expression: `(() => {
          const evt = new MouseEvent('mousemove', {
            clientX: ${pos.x},
            clientY: ${pos.y},
            bubbles: true
          });
          window.dispatchEvent(evt);
        })()`
      });
      await new Promise(r => setTimeout(r, 300));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${pos.name}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`Captured screenshot for ${pos.name} at (${pos.x}, ${pos.y}, scroll: ${pos.scrollY})`);
    }

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Audit error:', err);
    chrome.kill();
  }
}

auditCursor();
