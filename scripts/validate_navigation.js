import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function validateNavigation() {
  const baseDir = path.resolve('baselines', 'navigation');
  fs.mkdirSync(baseDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9449',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_nav_val',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9449/json');
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

    await send('Runtime.evaluate', {
      expression: 'document.fonts.ready',
      awaitPromise: true,
    });
    await new Promise((r) => setTimeout(r, 500));

    console.log('=== TEST 1: NAVBAR HEIGHT & ZOOM STABILITY (80%, 100%, 125%) ===');
    const zooms = [0.8, 1.0, 1.25];
    const zoomResults = [];
    for (const zoom of zooms) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: zoom,
        mobile: false,
      });
      await new Promise((r) => setTimeout(r, 200));

      const navEval = await send('Runtime.evaluate', {
        expression: `(() => {
          const nav = document.getElementById('main-navbar');
          return {
            height: nav ? Math.round(nav.getBoundingClientRect().height) : null,
            computedHeight: nav ? getComputedStyle(nav).height : null,
          };
        })()`,
        returnByValue: true
      });
      zoomResults.push({ zoom: `${zoom * 100}%`, ...navEval.result.value });
    }
    console.table(zoomResults);

    // Reset to 100%
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('=== TEST 2: ANCHOR CLICK & SCROLL OFFSET AUDIT ===');
    const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
    const anchorResults = [];

    for (const secId of sections) {
      const clickRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const link = document.querySelector(\`#main-navbar nav a[href="#${secId}"]\`);
          if (link) {
            link.click();
            return true;
          }
          return false;
        })()`,
        returnByValue: true
      });

      await new Promise((r) => setTimeout(r, 600));

      const offsetCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const sec = document.getElementById("${secId}");
          const nav = document.getElementById('main-navbar');
          const navHeight = nav ? nav.offsetHeight : 72;
          const rect = sec ? sec.getBoundingClientRect() : null;
          const activeSec = nav ? nav.getAttribute('data-active-section') : null;

          // Check single sliding underline indicator
          const indicator = document.querySelector('#main-navbar nav span.transition-\\\\[transform\\\\,width\\\\,opacity\\\\]') ||
                            document.querySelector('#main-navbar nav span.absolute.bottom-0');
          const indicatorStyle = indicator ? {
            width: indicator.style.width,
            transform: indicator.style.transform,
            opacity: indicator.style.opacity
          } : null;

          return {
            targetId: "${secId}",
            activeSection: activeSec,
            rectTop: rect ? Math.round(rect.top) : null,
            isHeadingObscured: rect ? rect.top < 0 : false,
            indicatorStyle
          };
        })()`,
        returnByValue: true
      });

      anchorResults.push(offsetCheck.result.value);
    }
    console.table(anchorResults);

    console.log('=== TEST 3: MOBILE MENU & ACCESSIBILITY (390px) ===');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 300));

    // Test toggle opening menu
    const mobileTest = await send('Runtime.evaluate', {
      expression: `(() => {
        const toggleBtn = document.querySelector('#main-navbar button[aria-controls="mobile-navigation-menu"]');
        const initialAria = toggleBtn ? toggleBtn.getAttribute('aria-expanded') : null;

        // Open menu
        if (toggleBtn) toggleBtn.click();
        const menuAfterOpen = document.getElementById('mobile-navigation-menu');
        const ariaAfterOpen = toggleBtn ? toggleBtn.getAttribute('aria-expanded') : null;
        const bodyOverflow = document.body.style.overflow;

        // Press Escape to test keyboard dismiss
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        const menuAfterEsc = document.getElementById('mobile-navigation-menu');
        const ariaAfterEsc = toggleBtn ? toggleBtn.getAttribute('aria-expanded') : null;

        return {
          initialAria,
          ariaAfterOpen,
          menuVisibleWhenOpen: Boolean(menuAfterOpen),
          bodyScrollLocked: bodyOverflow === 'hidden',
          ariaAfterEsc,
          menuClosedOnEsc: !menuAfterEsc
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile menu audit:', JSON.stringify(mobileTest.result.value, null, 2));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, 'mobile-menu-test.png'), Buffer.from(shot.data, 'base64'));

    ws.close();
    chrome.kill();
    console.log('Task 6 navigation validation complete!');
  } catch (err) {
    console.error('Validation error:', err);
    chrome.kill();
    process.exit(1);
  }
}

validateNavigation();
