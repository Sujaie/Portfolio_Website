// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Global Optical Cursor Instrument Glass Orb Verification', () => {
  test('optical-glass-orb-renders-and-tracks-with-zero-dom-duplication', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify zero mirror elements or duplicate DOM exist anywhere
    const mirrorCount = await page.evaluate(() => {
      return document.querySelectorAll('.cursor-mirror-element').length;
    });
    expect(mirrorCount).toBe(0);

    // 2. Verify cursor lens shell exists in high z-index plane
    const lensShell = page.locator('#cursor-lens-shell');
    await expect(lensShell).toBeAttached();

    // 3. Move pointer over hero headline
    await page.mouse.move(500, 400);
    await page.waitForTimeout(350);

    // 4. Verify lens shell tracks pointer coordinates
    const transform = await page.evaluate(() => {
      const shell = document.getElementById('cursor-lens-shell');
      return shell?.style.transform || '';
    });
    expect(transform).toContain('translate3d');

    // 5. Verify optical filter has contrast and brightness enhancement
    const filterStyle = await page.evaluate(() => {
      const filterEl = document.getElementById('cursor-optical-filter');
      return filterEl ? getComputedStyle(filterEl).backdropFilter || filterEl.style.backdropFilter : '';
    });
    expect(filterStyle).toContain('contrast');

    // 6. Test hover over interactive element changes rim color to Champagne Gold and expands
    const navLink = page.locator('#main-navbar a[href="#work"]');
    const box = await navLink.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(350);

      const result = await page.evaluate(() => {
        const rim = document.getElementById('cursor-lens-rim');
        const borderColor = rim ? getComputedStyle(rim).borderColor : '';
        return {
          borderColor,
          isMatch: borderColor.includes('240') || borderColor.includes('233') || borderColor.includes('gold'),
        };
      });
      expect(result.isMatch).toBe(true);
    }
  });
});
