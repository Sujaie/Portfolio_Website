import { spawn } from 'child_process';
import fs from 'fs';

async function auditLiveRendered() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9485',
    '--user-data-dir=C:\\Users\\Sujaie\\AppData\\Local\\Temp\\chrome_audit_live',
    '--disable-gpu',
    '--window-size=1440,900',
    'http://localhost:5173/'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  try {
    const listRes = await fetch('http://127.0.0.1:9485/json');
    const tabs = await listRes.json();
    const tab = tabs.find((t) => t.url.includes('localhost:5173'));
    if (!tab) throw new Error('Tab not found');

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
    await send('DOM.enable');
    await send('CSS.enable');

    const evaluation = await send('Runtime.evaluate', {
      returnByValue: true,
      expression: `
        (() => {
          function getStyle(selector, prop) {
            const el = document.querySelector(selector);
            if (!el) return 'NOT_FOUND';
            const cs = window.getComputedStyle(el);
            return prop ? cs.getPropertyValue(prop) : cs;
          }

          function sampleElement(selector) {
            const el = document.querySelector(selector);
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            return {
              selector,
              tagName: el.tagName,
              color: cs.color,
              backgroundColor: cs.backgroundColor,
              fontSize: cs.fontSize,
              fontFamily: cs.fontFamily,
              fontWeight: cs.fontWeight,
              lineHeight: cs.lineHeight,
              letterSpacing: cs.letterSpacing,
              paddingTop: cs.paddingTop,
              paddingBottom: cs.paddingBottom,
              borderRadius: cs.borderRadius
            };
          }

          return {
            rootTokens: {
              bgBase: getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim(),
              textPrimary: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
              textSecondary: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
              colorAccent: getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim(),
              colorData: getComputedStyle(document.documentElement).getPropertyValue('--color-data').trim(),
              sectionPy: getComputedStyle(document.documentElement).getPropertyValue('--section-py').trim(),
              navHeight: getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim(),
            },
            elements: {
              heroHeadline: sampleElement('#home h1'),
              heroAccent: sampleElement('#home span.font-serif'),
              heroSection: sampleElement('#home'),
              aboutSection: sampleElement('#about'),
              aboutLead: sampleElement('#about h2'),
              workSection: sampleElement('#work'),
              workTitle: sampleElement('#work h2'),
              workCard: sampleElement('#work .group.relative'),
              skillsSection: sampleElement('#skills'),
              skillsCard: sampleElement('#skills .skill-card'),
              experienceSection: sampleElement('#experience'),
              contactSection: sampleElement('#contact'),
              contactHeadline: sampleElement('#contact h2'),
              navbar: sampleElement('header nav')
            },
            navbarDetails: {
              navHeight: document.querySelector('header nav')?.offsetHeight,
              indicatorWidth: document.querySelector('header nav .absolute.bottom-0')?.offsetWidth,
              indicatorLeft: document.querySelector('header nav .absolute.bottom-0')?.style.transform,
              activeLinkText: document.querySelector('header nav a[aria-current="page"]')?.innerText,
              links: Array.from(document.querySelectorAll('header nav a')).map(a => ({
                href: a.getAttribute('href'),
                text: a.innerText.trim(),
                isCurrent: a.getAttribute('aria-current')
              }))
            },
            lensDetails: {
              count: document.querySelectorAll('.magnifier-lens-clip').length,
              pointerEvents: getComputedStyle(document.querySelector('.magnifier-lens-clip') || document.body).pointerEvents,
              mirrorPresent: !!document.querySelector('.cursor-mirror-element')
            }
          };
        })()
      `
    });

    console.log(JSON.stringify(evaluation.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Audit Error:', err);
  } finally {
    chrome.kill();
  }
}

auditLiveRendered();
