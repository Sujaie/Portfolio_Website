import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function testSpecific() {
  const outDir = path.resolve('baselines', 'cursor_targeted');
  fs.mkdirSync(outDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9483',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_cursor_specific',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9483/json');
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

    // 1. Target exact elements dynamically by finding their client rects
    const testCases = [
      {
        name: 'navbar_home_link',
        scrollY: 0,
        selector: '#main-navbar a[href="#home"]',
        isInteractive: true
      },
      {
        name: 'navbar_experience_link',
        scrollY: 0,
        selector: '#main-navbar a[href="#experience"]',
        isInteractive: true
      },
      {
        name: 'skills_first_card',
        scrollY: 3800,
        selector: '.skill-card',
        isInteractive: false
      },
      {
        name: 'contact_email_link',
        scrollY: 6140,
        selector: '#contact a[href^="mailto:"]',
        isInteractive: true
      }
    ];

    for (const tc of testCases) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo({ top: ${tc.scrollY}, behavior: 'instant' });`
      });
      await new Promise(r => setTimeout(r, 400));

      const rectResult = await send('Runtime.evaluate', {
        expression: `(() => {
          const el = document.querySelector('${tc.selector}');
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          return {
            x: Math.round(rect.left + rect.width / 2),
            y: Math.round(rect.top + rect.height / 2)
          };
        })()`,
        returnByValue: true
      });

      const pos = rectResult.result.value;
      if (!pos) {
        console.error(`Could not find ${tc.selector}`);
        continue;
      }

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: pos.x,
        y: pos.y
      });
      await new Promise(r => setTimeout(r, 350));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `${tc.name}.png`), Buffer.from(shot.data, 'base64'));

      // Check hover styling on lensRim
      const rimStyle = await send('Runtime.evaluate', {
        expression: `(() => {
          const lensRim = document.querySelector('[class*="border-[1.5px]"]');
          return {
            borderColor: lensRim ? lensRim.style.borderColor : 'none',
            boxShadow: lensRim ? lensRim.style.boxShadow : 'none'
          };
        })()`,
        returnByValue: true
      });

      console.log(`Target ${tc.name} at (${pos.x}, ${pos.y}): Rim style =`, JSON.stringify(rimStyle.result.value));
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testSpecific();
