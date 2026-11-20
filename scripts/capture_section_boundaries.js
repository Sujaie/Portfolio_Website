import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function captureBoundaries() {
  const baseDir = path.resolve('baselines', 'boundaries');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9490',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_boundaries',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9490/json');
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

    // 1. Boundary: Hero -> About (scrollY = 450)
    await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 450, behavior: "instant" });' });
    await new Promise(r => setTimeout(r, 400));
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '01_hero_about_boundary.png'), Buffer.from(shot.data, 'base64'));

    // 2. Center of About (scrollY = 850)
    await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 850, behavior: "instant" });' });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '02_about_center.png'), Buffer.from(shot.data, 'base64'));

    // 3. Boundary: About -> Work (scrollY = 1350)
    await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1350, behavior: "instant" });' });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '03_about_work_boundary.png'), Buffer.from(shot.data, 'base64'));

    // 4. Center of Work (scrollY = 1800)
    await send('Runtime.evaluate', { expression: 'window.scrollTo({ top: 1800, behavior: "instant" });' });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, '04_work_center.png'), Buffer.from(shot.data, 'base64'));

    console.log('Boundary screenshots saved in baselines/boundaries/');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

captureBoundaries();
