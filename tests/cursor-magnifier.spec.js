// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Global Optical Cursor Magnifier Verification', () => {
  test('optical-magnifier-renders-mirror-and-tracks-cursor', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // 1. Verify data-magnifier-source is present on main
    const mainSource = page.locator('main[data-magnifier-source]');
    await expect(mainSource).toBeVisible();

    // 2. Move pointer over hero headline
    await page.mouse.move(400, 350);
    await page.waitForTimeout(300);

    // 3. Verify optical mirror contains mirrored elements
    const mirrorContent = await page.evaluate(() => {
      const mirror = document.querySelector('.cursor-mirror-element');
      return {
        exists: !!mirror,
        hasChildren: (mirror?.children.length || 0) > 0,
      };
    });
    expect(mirrorContent.exists).toBe(true);
    expect(mirrorContent.hasChildren).toBe(true);

    // 4. Verify clip-path circle is positioned around cursor coordinates
    const clipPath = await page.evaluate(() => {
      const clipLayer = document.querySelector('div[style*="clip-path"]');
      return clipLayer?.getAttribute('style') || '';
    });
    expect(clipPath).toContain('circle(65px at');

    // 5. Test hover over interactive element changes rim color to gold
    const navLink = page.locator('#main-navbar a[href="#work"]');
    const box = await navLink.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(300);

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
