import { spawn } from 'child_process';

async function checkMirrorLayers() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9461',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_inspect_mag_layers',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9461/json');
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
      expression: `
        document.getElementById('about').scrollIntoView();
      `
    });

    await new Promise((r) => setTimeout(r, 600));

    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 500,
      y: 400
    });

    await new Promise((r) => setTimeout(r, 600));

    const layerInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const mirror = document.querySelector('.cursor-mirror-element');
          const aboutMirror = document.getElementById('about-mirror');
          if (!aboutMirror) return { error: 'No about mirror' };

          // Let's inspect all children of aboutMirror
          const children = Array.from(aboutMirror.children).map(child => ({
            tagName: child.tagName,
            className: child.className,
            style: child.getAttribute('style'),
            rect: {
              top: child.getBoundingClientRect().top,
              left: child.getBoundingClientRect().left,
              width: child.getBoundingClientRect().width,
              height: child.getBoundingClientRect().height,
            },
            zIndex: window.getComputedStyle(child).zIndex,
            opacity: window.getComputedStyle(child).opacity,
            overflow: window.getComputedStyle(child).overflow,
          }));

          // Inspect the heading text in mirror
          const heading = aboutMirror.querySelector('h2');
          const headingColor = heading ? window.getComputedStyle(heading).color : null;
          const headingOpacity = heading ? window.getComputedStyle(heading).opacity : null;

          return {
            children,
            headingColor,
            headingOpacity,
            mirrorBg: window.getComputedStyle(mirror).backgroundColor,
            aboutMirrorBg: window.getComputedStyle(aboutMirror).backgroundColor
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Layer Info:', JSON.stringify(layerInfo.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

checkMirrorLayers();
