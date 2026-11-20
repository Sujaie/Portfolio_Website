// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gate 6 Signatures Suite: Contact Handshake & Style Guide Alignment', () => {
  test('contact-handshake-magnetic-email-and-quick-copy', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to contact section
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(800);

    // Verify email link and magnetic container
    const emailLink = page.locator('#contact a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:sujaie.dev@gmail.com');

    // Test mouse move on email target (magnetic physics)
    const box = await emailLink.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 4, box.y + box.height / 4);
      await page.waitForTimeout(200);
      await page.mouse.move(box.x + box.width * 2, box.y + box.height * 2);
    }

    // Test quick copy button
    const copyBtn = page.locator('#contact button:has-text("COPY")');
    await copyBtn.click();
    await page.waitForTimeout(200);

    // Expect copied toast state
    await expect(page.locator('#contact button:has-text("✓ COPIED")')).toBeVisible();
  });

  test('contact-modal-dispatch-keyboard-trapping-and-submission', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(500);

    // Open dispatch modal
    const openBtn = page.locator('button:has-text("WRITE A NOTE")');
    await openBtn.click();
    await page.waitForTimeout(300);

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Focus is automatically in first input (#contact-name)
    const nameInput = page.locator('#contact-name');
    await expect(nameInput).toBeFocused();

    // Fill form fields
    await nameInput.fill('Ada Lovelace');
    await page.locator('#contact-email').fill('ada@computing.org');
    await page.locator('#contact-message').fill('Collaborative system inquiry.');

    // Submit form
    const submitBtn = page.locator('button[type="submit"]:has-text("Transmit")');
    await submitBtn.click();
    await page.waitForTimeout(300);

    // Expect success message
    await expect(page.locator('text=✓ Dispatch Logged')).toBeVisible();

    // Closes automatically after timeout
    await page.waitForTimeout(2200);
    await expect(dialog).not.toBeVisible();
  });

  test('contact-modal-escape-key-and-focus-restoration', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(500);

    const openBtn = page.locator('button:has-text("WRITE A NOTE")');
    await openBtn.click();
    await page.waitForTimeout(300);

    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(dialog).not.toBeVisible();

    // Verify focus is restored to the trigger button
    await expect(openBtn).toBeFocused();
  });

  test('styleguide-route-and-six-depth-planes-alignment', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/#styleguide', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Verify Style Guide header
    await expect(page.getByRole('heading', { name: 'DESIGN SYSTEM SPECIFICATION' })).toBeVisible();

    // Verify The Six Depth Planes section
    const planesHeading = page.locator('text=The Six Depth Planes');
    await expect(planesHeading).toBeVisible();

    // Check all 6 planes exist
    for (let i = 0; i <= 5; i++) {
      await expect(page.getByText(`Plane ${i}`, { exact: true })).toBeVisible();
      await expect(page.getByText(`--plane-${i}`, { exact: true })).toBeVisible();
    }

    // Verify returning to portfolio
    const backBtn = page.locator('button:has-text("← PORTFOLIO")');
    await backBtn.click();
    await page.waitForTimeout(500);

    // Portfolio header should be visible
    await expect(page.locator('#home')).toBeVisible();
  });
});
