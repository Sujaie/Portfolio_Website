import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function testSkillsShot() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9482',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_skills_shot',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9482/json');
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

    // Scroll directly into skills grid
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 4000, behavior: 'instant' });`
    });
    await new Promise(r => setTimeout(r, 600));

    // Get position of the first skill card
    const rectResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.skill-card');
        if (!cards.length) return null;
        const rect = cards[0].getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          centerX: Math.round(rect.left + rect.width / 2),
          centerY: Math.round(rect.top + rect.height / 2)
        };
      })()`,
      returnByValue: true
    });

    const pos = rectResult.result.value;
    console.log('Skill card rect at scroll 4000:', JSON.stringify(pos, null, 2));

    if (pos) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: pos.centerX,
        y: pos.centerY
      });
      await new Promise(r => setTimeout(r, 400));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('baselines/cursor_targeted/skills_card_magnified.png', Buffer.from(shot.data, 'base64'));
      console.log('Captured skills_card_magnified.png');
    }

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

testSkillsShot();
