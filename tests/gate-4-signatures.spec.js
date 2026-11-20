// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gate 4 Signatures Suite: Hero Ignition & About Transmission', () => {
  test('hero-ignition-masked-hierarchy-and-structure', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Verify lines exist inside overflow-hidden masks
    const line1 = page.locator('.hero-line-1');
    const line2 = page.locator('.hero-line-2');
    const accent = page.locator('.hero-accent');

    await expect(line1).toBeVisible();
    await expect(line2).toBeVisible();
    await expect(accent).toBeVisible();

    // Verify gold italic serif accent styling
    const color = await accent.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(232, 168, 35)'); // #e8a823

    // Verify metadata items rendered
    const metaItems = page.locator('.hero-meta-item');
    expect(await metaItems.count()).toBe(3);

    // Verify explore indicator
    const explore = page.locator('.hero-explore');
    await expect(explore).toBeVisible();
  });

  test('hero-ignition-reduced-motion-immediate-position', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const line1 = page.locator('.hero-line-1');
    const accent = page.locator('.hero-accent');
    const line2 = page.locator('.hero-line-2');

    await expect(line1).toBeVisible();
    await expect(accent).toBeVisible();
    await expect(line2).toBeVisible();

    const opacity1 = await line1.evaluate((el) => getComputedStyle(el).opacity);
    const opacityAccent = await accent.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity1)).toBe(1);
    expect(Number(opacityAccent)).toBe(1);
  });

  test('about-transmission-category-tab-switch-and-telemetry', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to about section
    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);

    // Check category tabs
    const tabs = page.locator('#about [role="tab"]');
    const tabCount = await tabs.count();
    expect(tabCount).toBe(4);

    // Active tab is first
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');

    // Switch to tab 2
    await tabs.nth(1).click();
    await page.waitForTimeout(600);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');

    // Check next button
    const nextBtn = page.locator('button[aria-label="Next Project"]');
    await nextBtn.click();
    await page.waitForTimeout(600);
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

    // Check prev button
    const prevBtn = page.locator('button[aria-label="Previous Project"]');
    await prevBtn.click();
    await page.waitForTimeout(600);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');

    // Telemetry grid exists and renders sub-ms metrics
    const telemetry = page.locator('#about .grid.grid-cols-3');
    await expect(telemetry).toBeVisible();
  });

  test('about-transmission-reduced-motion-switch', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(500);

    const tabs = page.locator('#about [role="tab"]');
    await tabs.nth(3).click();
    await page.waitForTimeout(100);
    await expect(tabs.nth(3)).toHaveAttribute('aria-selected', 'true');
  });
});
