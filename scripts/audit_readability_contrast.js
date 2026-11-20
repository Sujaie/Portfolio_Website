import { spawn } from 'child_process';

async function runAudit() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9481',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_audit_wcag2',
    '--disable-gpu',
    '--window-size=1280,800',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch('http://127.0.0.1:9481/json');
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

    const result = await send('Runtime.evaluate', {
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
              if (bg && bg.a > 0.1) {
                return bg;
              }
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

          const failedContrast = [];
          const all = document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label, input, textarea');

          all.forEach(el => {
            if (el.closest('.cursor-mirror-element') || el.closest('[aria-hidden="true"]')) return;
            const text = (el.innerText || el.textContent || '').trim();
            if (!text) return;

            const style = window.getComputedStyle(el);
            const fg = parseRgb(style.color);
            const bg = getEffectiveBg(el);
            const fontSizePx = parseFloat(style.fontSize);
            const fontWeight = parseInt(style.fontWeight) || 400;
            const isLarge = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
            const minRatio = isLarge ? 3.0 : 4.5;

            if (fg && bg) {
              const effectiveFg = {
                r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
                g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
                b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
                a: 1
              };
              const ratio = contrastRatio(effectiveFg, bg);
              if (ratio < minRatio) {
                failedContrast.push({
                  tag: el.tagName.toLowerCase(),
                  text: text.substring(0, 50),
                  fontSizePx,
                  fontWeight,
                  color: style.color,
                  ratio: ratio.toFixed(2),
                  minRatio,
                  parentSection: el.closest('section')?.id || 'header/nav',
                  className: el.className
                });
              }
            }
          });

          return {
            failedContrastCount: failedContrast.length,
            failedContrast
          };
        })()
      `,
      returnByValue: true
    });

    console.log('Failed Contrast Items:', JSON.stringify(result.result.value, null, 2));

    ws.close();
    chrome.kill();
  } catch (e) {
    console.error(e);
    chrome.kill();
  }
}

runAudit();
