import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function validateAccessibility() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9485',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_val_a11y',
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

    const evalReport = await send('Runtime.evaluate', {
      expression: `
        (() => {
          function parseRgb(colorStr) {
            const m = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
            if (!m) return null;
            return {
              r: parseInt(m[1]),
              g: parseInt(m[2]),
              b: parseInt(m[3]),
              a: m[4] !== undefined ? parseFloat(m[4]) : 1
            };
          }

          function getEffectiveBg(el) {
            let cur = el;
            while (cur && cur !== document.documentElement) {
              const style = window.getComputedStyle(cur);
              const bg = parseRgb(style.backgroundColor);
              if (bg && bg.a > 0.1) return bg;
              cur = cur.parentElement;
            }
            return { r: 5, g: 6, b: 9, a: 1 };
          }

          function getLuminance(rgb) {
            const [rs, gs, bs] = [rgb.r, rgb.g, rgb.b].map(c => {
              c = c / 255;
              return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
          }

          function contrastRatio(fg, bg) {
            const l1 = getLuminance(fg);
            const l2 = getLuminance(bg);
            return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          }

          // 1. Text contrast & sizing
          const contrastFailures = [];
          const smallTextElements = [];
          const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label');

          textElements.forEach(el => {
            if (el.closest('.cursor-mirror-element') || el.closest('[aria-hidden="true"]')) return;
            const text = (el.innerText || el.textContent || '').trim();
            if (!text) return;

            const style = window.getComputedStyle(el);
            const fontSizePx = parseFloat(style.fontSize);
            const fontWeight = parseInt(style.fontWeight) || 400;
            const isLarge = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
            const minRatio = isLarge ? 3.0 : 4.5;

            const fg = parseRgb(style.color);
            const bg = getEffectiveBg(el);

            if (fg && bg) {
              const effectiveFg = {
                r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
                g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
                b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
                a: 1
              };
              const ratio = contrastRatio(effectiveFg, bg);
              if (ratio < minRatio) {
                contrastFailures.push({ text: text.slice(0, 30), ratio: ratio.toFixed(2), minRatio });
              }
            }

            if (fontSizePx < 11.0) {
              smallTextElements.push({ text: text.slice(0, 30), fontSizePx });
            }
          });

          // 2. Interactive elements accessible names
          const missingAccessibleNames = [];
          document.querySelectorAll('a, button, input, textarea').forEach(el => {
            if (el.closest('.cursor-mirror-element') || el.closest('[aria-hidden="true"]')) return;
            if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
            const label = el.getAttribute('aria-label') || el.innerText || el.value || el.placeholder || el.title;
            if (!label || !label.trim()) {
              missingAccessibleNames.push({ tag: el.tagName, id: el.id, className: el.className.slice(0, 40) });
            }
          });

          // 3. Heading hierarchy
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .filter(h => !h.closest('.cursor-mirror-element') && !h.closest('[aria-hidden="true"]'))
            .map(h => ({
              level: parseInt(h.tagName[1]),
              text: h.innerText.replace(/\\s+/g, ' ').trim().slice(0, 35)
            }));

          let headingOrderValid = true;
          for (let i = 1; i < headings.length; i++) {
            if (headings[i].level > headings[i-1].level + 1) {
              headingOrderValid = false;
            }
          }

          // 4. ARIA Tablists & Tabs
          const tablists = Array.from(document.querySelectorAll('[role="tablist"]'))
            .filter(el => !el.closest('.cursor-mirror-element'))
            .map(t => ({
              label: t.getAttribute('aria-label'),
              tabCount: t.querySelectorAll('[role="tab"]').length
            }));

          return {
            totalScannedText: textElements.length,
            contrastFailuresCount: contrastFailures.length,
            contrastFailures,
            sub11pxTextCount: smallTextElements.length,
            sub11pxTextSample: smallTextElements.slice(0, 5),
            missingAccessibleNamesCount: missingAccessibleNames.length,
            missingAccessibleNames,
            headingCount: headings.length,
            headingOrderValid,
            headings,
            tablists
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Accessibility Validation Report:', JSON.stringify(evalReport.result.value, null, 2));

    // Capture baseline screenshots at 100% and 80% zoom
    const baseDir = path.resolve('baselines', 'accessibility');
    fs.mkdirSync(baseDir, { recursive: true });

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, 'a11y_100pct.png'), Buffer.from(shot.data, 'base64'));

    // Test at 80% scale
    await send('Emulation.setPageScaleFactor', { pageScaleFactor: 0.8 });
    await new Promise(r => setTimeout(r, 400));
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(baseDir, 'a11y_80pct.png'), Buffer.from(shot.data, 'base64'));

    console.log('Screenshots saved to baselines/accessibility/');

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

validateAccessibility();
