import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function inspectMagnifier() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9455',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_mag',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9455/json');
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes('localhost:5173'));
    if (!tab || !tab.webSocketDebuggerUrl) {
      throw new Error('Could not find Chrome tab');
    }

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

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    // Scroll to about section
    await send('Runtime.evaluate', {
      expression: `
        const about = document.getElementById('about');
        about.scrollIntoView();
      `
    });

    await new Promise((r) => setTimeout(r, 600));

    // Move mouse over the About section (e.g. at 500, 400)
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 500,
      y: 400
    });

    await new Promise((r) => setTimeout(r, 600));

    // Inspect DOM and styles inside magnifier
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const lens = document.querySelector('[aria-hidden="true"]');
          const clipLayer = document.querySelector('div[style*="clip-path"], div[style*="clipPath"]');
          const contentMirror = document.querySelector('.cursor-mirror-element');
          const mainSource = document.querySelector('[data-magnifier-source]');
          
          return {
            windowScrollY: window.scrollY,
            lensFound: !!lens,
            clipLayerStyle: clipLayer ? clipLayer.getAttribute('style') : null,
            contentMirrorFound: !!contentMirror,
            contentMirrorStyle: contentMirror ? contentMirror.getAttribute('style') : null,
            contentMirrorParentTransform: contentMirror && contentMirror.parentElement ? contentMirror.parentElement.getAttribute('style') : null,
            contentMirrorInnerHTMLSnippet: contentMirror ? contentMirror.innerHTML.substring(0, 300) : null,
            contentMirrorOffsetHeight: contentMirror ? contentMirror.offsetHeight : null,
            contentMirrorScrollHeight: contentMirror ? contentMirror.scrollHeight : null,
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Inspection Result:', JSON.stringify(res.result.value, null, 2));

    // Capture screenshot
    const screenshot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('baselines/magnifier_about_test.png', Buffer.from(screenshot.data, 'base64'));
    console.log('Saved screenshot to baselines/magnifier_about_test.png');

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}

inspectMagnifier();
