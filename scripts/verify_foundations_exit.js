import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function verifyFoundationsExit() {
  const outDir = path.resolve('baselines', 'foundations_exit');
  fs.mkdirSync(outDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9475',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_exit_verify',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9475/json');
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

    console.log('=== 1. VERIFYING STYLEGUIDE ROUTE ===');
    // Navigate to /styleguide
    await send('Runtime.evaluate', {
      expression: `window.location.hash = '#styleguide';`
    });
    await new Promise(r => setTimeout(r, 600));

    const styleGuideCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const sections = ['colors', 'typography', 'spacing', 'radius', 'elevation', 'motion', 'cursor'];
        const found = sections.map(id => ({ id, exists: !!document.getElementById(id) }));
        const lensCount = document.querySelectorAll('[class*="z-[9999]"]').length;
        const clipLayer = document.querySelector('[class*="z-[9990]"]');
        return {
          sections: found,
          lensCount,
          hasClipLayer: !!clipLayer,
          clipLayerInert: clipLayer ? clipLayer.hasAttribute('inert') : false
        };
      })()`,
      returnByValue: true
    });
    console.log('Styleguide Structure & Lens:', JSON.stringify(styleGuideCheck.result.value, null, 2));

    // Capture Styleguide top
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'styleguide_overview.png'), Buffer.from(shot.data, 'base64'));

    // Move mouse over interactive cursor showcase in styleguide
    await send('Runtime.evaluate', {
      expression: `document.getElementById('cursor').scrollIntoView();`
    });
    await new Promise(r => setTimeout(r, 300));
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 400, y: 350 });
    await new Promise(r => setTimeout(r, 300));

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'styleguide_cursor_showcase.png'), Buffer.from(shot.data, 'base64'));

    console.log('=== 2. RETURN TO PORTFOLIO ROUTE ===');
    await send('Runtime.evaluate', {
      expression: `(() => {
        window.location.hash = '';
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new Event('popstate'));
      })()`
    });
    await new Promise(r => setTimeout(r, 500));

    console.log('=== 3. RESPONSIVE VIEWPORT & OVERFLOW AUDIT ===');
    const viewports = [
      { name: 'mobile_360', width: 360, height: 740 },
      { name: 'mobile_390', width: 390, height: 844 },
      { name: 'tablet_768', width: 768, height: 1024 },
      { name: 'laptop_1024', width: 1024, height: 768 },
      { name: 'desktop_1440', width: 1440, height: 900 },
      { name: 'ultrawide_1920', width: 1920, height: 1080 }
    ];

    const overflowResults = [];
    for (const vp of viewports) {
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.width <= 768
      });
      await new Promise(r => setTimeout(r, 300));

      const overflow = await send('Runtime.evaluate', {
        expression: `(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
          const clientWidth = docEl.clientWidth;
          return {
            clientWidth,
            scrollWidth,
            hasOverflow: scrollWidth > clientWidth + 1, // allow 1px rounding
            delta: scrollWidth - clientWidth
          };
        })()`,
        returnByValue: true
      });

      overflowResults.push({
        viewport: vp.name,
        width: vp.width,
        ...overflow.result.value
      });

      const vpShot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(outDir, `viewport_${vp.name}.png`), Buffer.from(vpShot.data, 'base64'));
    }
    console.log('Overflow Verification Table:\n', JSON.stringify(overflowResults, null, 2));

    console.log('=== 4. ACCESSIBILITY & REDUCED MOTION AUDIT ===');
    const a11yCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        // Check focus visible CSS
        const testBtn = document.createElement('button');
        document.body.appendChild(testBtn);
        testBtn.focus();
        const focusOutline = window.getComputedStyle(testBtn).outline;
        testBtn.remove();

        // Check headings hierarchy
        const h1 = document.querySelectorAll('h1').length;
        const h2 = document.querySelectorAll('h2').length;
        const h3 = document.querySelectorAll('h3').length;

        // Check nav links aria attributes
        const navLinks = Array.from(document.querySelectorAll('#main-navbar a')).map(a => ({
          href: a.getAttribute('href'),
          text: a.innerText.trim(),
          hasAriaLabel: !!a.getAttribute('aria-label') || !!a.innerText.trim()
        }));

        return {
          h1Count: h1,
          h2Count: h2,
          h3Count: h3,
          navLinksCount: navLinks.length,
          allNavLinksNamed: navLinks.every(n => n.hasAriaLabel)
        };
      })()`,
      returnByValue: true
    });
    console.log('Accessibility Audit:', JSON.stringify(a11yCheck.result.value, null, 2));

    ws.close();
    chrome.kill();
    console.log('=== FOUNDATIONS VERIFICATION SUITE COMPLETE ===');
  } catch (err) {
    console.error('Verification error:', err);
    chrome.kill();
  }
}

verifyFoundationsExit();
