// @ts-check
import { test, expect } from '@playwright/test';

const sections = ['home', 'about', 'work', 'skills', 'experience', 'contact'];

// Visual baseline: each section × current viewport
for (const section of sections) {
  test(`section-${section}-visual-baseline`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    // Allow fonts and animations to settle
    await page.waitForTimeout(1500);

    if (section !== 'home') {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, section);
      await page.waitForTimeout(500);
    }

    const sectionEl = page.locator(`#${section}`);
    await expect(sectionEl).toBeVisible();
    await expect(sectionEl).toHaveScreenshot(`${section}.png`, {
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
    });
  });
}

// Horizontal overflow test at current viewport
test('no-horizontal-overflow', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(overflow).toBe(false);
});

// Reduced motion variant
test('reduced-motion-hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const hero = page.locator('#home');
  await expect(hero).toBeVisible();
  await expect(hero).toHaveScreenshot('home-reduced-motion.png', {
    maxDiffPixelRatio: 0.01,
    animations: 'disabled',
  });
});
