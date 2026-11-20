// @ts-check
import { test, expect } from '@playwright/test';

test('measure-nav-height-and-computed-colors', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const measurements = await page.evaluate(() => {
    const header = document.querySelector('header');
    const root = document.documentElement;
    const cs = getComputedStyle(root);

    const result = {
      nav: {},
      tokens: {},
    };

    if (header) {
      result.nav.offsetHeight = header.offsetHeight;
      result.nav.computedHeight = getComputedStyle(header).height;
      result.nav.navHeightToken = cs.getPropertyValue('--nav-height').trim();
      result.nav.navHeightDesktop = cs.getPropertyValue('--nav-height-desktop').trim();
    }

    // Sample computed colors
    const colorTokens = [
      '--bg-base', '--bg-raised', '--text-primary', '--text-secondary',
      '--color-accent', '--color-data', '--border-subtle', '--border-default',
      '--ink-950', '--ink-900', '--ink-800', '--paper-50', '--slate-400',
      '--gold-500', '--teal-400', '--content-max-width',
    ];
    for (const t of colorTokens) {
      result.tokens[t] = cs.getPropertyValue(t).trim();
    }

    // Check aria-current on nav links
    const navLinks = Array.from(document.querySelectorAll('header nav a'));
    result.nav.ariaCurrentValues = navLinks.map(a => ({
      text: a.textContent.trim(),
      ariaCurrent: a.getAttribute('aria-current'),
    }));

    // Check active section data attribute
    result.nav.activeSectionAttr = header?.getAttribute('data-active-section') || 'none';

    // Count lens elements
    result.lensCount = document.querySelectorAll('[class*="magnifier"], [class*="lens"]').length;

    // Check scroll dimensions
    result.scrollWidth = document.documentElement.scrollWidth;
    result.clientWidth = document.documentElement.clientWidth;
    result.hasOverflow = document.documentElement.scrollWidth > document.documentElement.clientWidth;

    return result;
  });

  console.log('=== MEASUREMENTS ===');
  console.log(JSON.stringify(measurements, null, 2));

  // Nav height should resolve to 72px at desktop
  expect(measurements.nav.navHeightDesktop).toBe('72px');

  // No horizontal overflow
  expect(measurements.hasOverflow).toBe(false);
});

// Screenshot captures for docs/qa/gate-3
test('capture-gate-3-screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];
  for (const section of sections) {
    if (section !== 'home') {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, section);
      await page.waitForTimeout(500);
    }

    await page.screenshot({
      path: `docs/qa/gate-3/${section}-1440.png`,
      fullPage: false,
    });
  }

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (const section of sections) {
    if (section !== 'home') {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, section);
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: `docs/qa/gate-3/${section}-768.png`,
      fullPage: false,
    });
  }

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  for (const section of sections) {
    if (section !== 'home') {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, section);
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: `docs/qa/gate-3/${section}-390.png`,
      fullPage: false,
    });
  }
});
