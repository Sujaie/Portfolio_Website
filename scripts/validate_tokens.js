import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function validate() {
  const outDir = path.resolve('baselines', 'token-verification');
  fs.mkdirSync(outDir, { recursive: true });

  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9445',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_token_val',
    '--disable-gpu',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9445/json');
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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('--- TEST 1: COMPUTED STYLES VERIFICATION ---');
    const evalRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const rootStyles = getComputedStyle(document.documentElement);
        const bgBase = rootStyles.getPropertyValue('--bg-base').trim();
        const colorAccent = rootStyles.getPropertyValue('--color-accent').trim();
        const textPrimary = rootStyles.getPropertyValue('--text-primary').trim();
        const colorData = rootStyles.getPropertyValue('--color-data').trim();

        // Sample hero elements
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        const heroAccent = document.querySelector('#home span.font-serif');
        const heroAccentColor = heroAccent ? getComputedStyle(heroAccent).color : null;
        const brandDot = document.querySelector('#main-navbar span.rounded-full');
        const brandDotBg = brandDot ? getComputedStyle(brandDot).backgroundColor : null;

        return {
          tokens: { bgBase, colorAccent, textPrimary, colorData },
          bodyBg,
          heroAccentColor,
          brandDotBg
        };
      })()`,
      returnByValue: true
    });
    console.log('Token values & computed styles:', JSON.stringify(evalRes.result.value, null, 2));

    console.log('--- TEST 2: DYNAMIC TOKEN MUTATION TEST ---');
    // Change --color-accent dynamically to #FF00FF and check if elements update
    const mutationRes = await send('Runtime.evaluate', {
      expression: `(() => {
        document.documentElement.style.setProperty('--color-accent', '#FF00FF');
        const heroAccent = document.querySelector('#home span.font-serif');
        const updatedHeroColor = heroAccent ? getComputedStyle(heroAccent).color : null;
        const brandDot = document.querySelector('#main-navbar span.rounded-full');
        const updatedBrandDotBg = brandDot ? getComputedStyle(brandDot).backgroundColor : null;

        // Reset back
        document.documentElement.style.removeProperty('--color-accent');
        const restoredHeroColor = heroAccent ? getComputedStyle(heroAccent).color : null;

        return {
          updatedHeroColor,
          updatedBrandDotBg,
          restoredHeroColor
        };
      })()`,
      returnByValue: true
    });
    console.log('Dynamic mutation check:', JSON.stringify(mutationRes.result.value, null, 2));

    // Capture visual verification screenshot of Desktop Home and About
    for (const section of ['home', 'about', 'work']) {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById("${section}");
          if (el) el.scrollIntoView();
        `,
      });
      await new Promise((r) => setTimeout(r, 600));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(outDir, `${section}-verified.png`);
      fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
      console.log(`Saved token-verified screenshot: ${filePath}`);
    }

    ws.close();
    chrome.kill();
    console.log('Validation completed successfully!');
  } catch (err) {
    console.error('Validation error:', err);
    chrome.kill();
    process.exit(1);
  }
}

validate();
