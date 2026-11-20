// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gate 3 Navigation & Tracking Suite', () => {
  test('nav-dimensions-and-aria-current-desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const header = page.locator('#main-navbar');
    await expect(header).toBeVisible();

    const box = await header.boundingBox();
    expect(box?.height).toBe(72);

    // Initial page load at top: HOME link has aria-current="page"
    const homeLink = page.locator('header nav a[href="#home"]');
    await expect(homeLink).toHaveAttribute('aria-current', 'page');

    // Other links must not have aria-current
    const otherLinks = page.locator('header nav a:not([href="#home"])');
    const count = await otherLinks.count();
    for (let i = 0; i < count; i++) {
      await expect(otherLinks.nth(i)).not.toHaveAttribute('aria-current');
    }
  });

  test('nav-dimensions-mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const header = page.locator('#main-navbar');
    const box = await header.boundingBox();
    expect(box?.height).toBe(64);
  });

  test('nav-scroll-tracking-and-edge-cases', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const header = page.locator('#main-navbar');

    // 1. Top of page: HOME
    await expect(header).toHaveAttribute('data-active-section', 'home');

    // 2. Scroll to each section and verify tracking
    const sections = ['about', 'work', 'skills', 'experience', 'contact'];
    for (const section of sections) {
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) {
          const navHeight = 72;
          const y = el.getBoundingClientRect().top + window.pageYOffset - navHeight + 20;
          window.scrollTo({ top: y, behavior: 'instant' });
        }
      }, section);
      await page.waitForTimeout(500);

      await expect(header).toHaveAttribute('data-active-section', section);
      const activeLink = page.locator(`header nav a[href="#${section}"]`);
      await expect(activeLink).toHaveAttribute('aria-current', 'page');
    }

    // 3. Scroll to bottom edge guard: strictly CONTACT
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await expect(header).toHaveAttribute('data-active-section', 'contact');

    // 4. Scroll back to top: strictly HOME
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);
    await expect(header).toHaveAttribute('data-active-section', 'home');
  });

  test('nav-link-click-scrolling-and-heading-visibility', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const sections = ['about', 'work', 'skills', 'experience', 'contact'];
    for (const section of sections) {
      const link = page.locator(`header nav a[href="#${section}"]`);
      await link.click();
      await page.waitForTimeout(1000);

      // Verify heading position is below the fixed 72px navbar
      const headingBox = await page.locator(`#${section}`).boundingBox();
      expect(headingBox?.y).toBeGreaterThanOrEqual(70);
    }
  });

  test('sfx-toggle-and-persistence', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const sfxBtn = page.locator('header button:has-text("SFX")').first();
    await expect(sfxBtn).toContainText('SFX OFF');

    // Click to enable
    await sfxBtn.click();
    await expect(sfxBtn).toContainText('SFX ON');

    // Check localStorage persistence
    const stored = await page.evaluate(() => localStorage.getItem('sujaie_sfx_enabled'));
    expect(stored).toBe('true');

    // Reload page and check persistence
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const reloadedBtn = page.locator('header button:has-text("SFX")').first();
    await expect(reloadedBtn).toContainText('SFX ON');

    // Turn off
    await reloadedBtn.click();
    await expect(reloadedBtn).toContainText('SFX OFF');
  });

  test('mobile-menu-accessibility-and-keyboard-trapping', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const menuToggle = page.locator('header button:has-text("MENU")');
    await menuToggle.click();

    const drawer = page.locator('#mobile-navigation-menu');
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();

    // Reopen and click link
    await page.locator('header button:has-text("MENU")').click();
    await expect(drawer).toBeVisible();

    const aboutLink = drawer.locator('a[href="#about"]');
    await aboutLink.click();
    await page.waitForTimeout(1000);

    // Drawer must be closed after navigation
    await expect(drawer).toBeHidden();
  });
});
