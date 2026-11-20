import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function testOptimizedCursor() {
  const outDir = path.resolve('baselines', 'cursor_optimized');
  fs.mkdirSync(outDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9485',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_cursor_opt',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9485/json');
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

    // 1. Audit DOM structures & inert accessibility
    const domAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        const lens = document.querySelector('[class*="z-[9999]"]');
        const mirrorElements = document.querySelectorAll('.cursor-mirror-element');
        const focusableInMirror = clipLayer ? clipLayer.querySelectorAll('a, button, input, [tabindex="0"]').length : 0;
        return {
          totalLenses: document.querySelectorAll('[class*="z-[9999]"]').length,
          clipLayerInert: clipLayer ? clipLayer.hasAttribute('inert') : false,
          focusableInMirror,
          mirrorElementCount: mirrorElements.length,
          mirrorSubtreeNodeCount: document.querySelectorAll('.cursor-mirror-element *').length
        };
      })()`,
      returnByValue: true
    });
    console.log('DOM & Accessibility Audit:', JSON.stringify(domAudit.result.value, null, 2));

    // 2. Test targets across the real page sections
    const targets = [
      { name: '01_hero_headline', scrollY: 0, x: 450, y: 380 },
      { name: '02_navbar_link_hover', scrollY: 0, x: 450, y: 32 },
      { name: '03_about_lead', scrollY: 850, x: 320, y: 340 },
      { name: '04_projects_telemetry', scrollY: 1900, x: 380, y: 420 },
      { name: '05_skills_grid', scrollY: 3900, x: 350, y: 350 },
      { name: '06_experience_timeline', scrollY: 5300, x: 420, y: 380 },
      { name: '07_contact_action', scrollY: 6300, x: 320, y: 380 }
    ];

    for (const t of targets) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${t.scrollY}, behavior: 'instant' });`
      });
      await new Promise(r => setTimeout(r, 150));

      // Native mouse movement
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: t.x,
        y: t.y
      });
      await new Promise(r => setTimeout(r, 300));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${t.name}.png`), Buffer.from(shot.data, 'base64'));

      // Check coordinates and transform
      const stats = await send('Runtime.evaluate', {
        expression: `(() => {
          const lens = document.querySelector('[class*="z-[9999]"]');
          const clipLayer = document.querySelector('[class*="z-[9990]"]');
          const contentMirror = clipLayer ? clipLayer.firstElementChild : null;
          return {
            lensTransform: lens ? lens.style.transform : 'none',
            clipPath: clipLayer ? clipLayer.style.clipPath : 'none',
            contentMirrorTransform: contentMirror ? contentMirror.style.transform : 'none',
            lensOpacity: lens ? window.getComputedStyle(lens).opacity : 'none'
          };
        })()`,
        returnByValue: true
      });
      console.log(`Target ${t.name}:`, JSON.stringify(stats.result.value));
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testOptimizedCursor();
