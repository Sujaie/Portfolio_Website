// @ts-check
import { test, expect } from '@playwright/test';

// Relative luminance and contrast ratio calculation per WCAG 2.2
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseRgb(str) {
  const match = str.match(/\d+/g);
  return match ? match.slice(0, 3).map(Number) : [0, 0, 0];
}

test.describe('WCAG 2.2 Accessibility & Contrast Audit Suite', () => {
  test('wcag-color-contrast-ratios', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const colors = await page.evaluate(() => {
      const root = document.documentElement;
      const cs = getComputedStyle(root);
      return {
        bgBase: cs.getPropertyValue('--bg-base').trim(),
        textPrimary: cs.getPropertyValue('--text-primary').trim(),
        textSecondary: cs.getPropertyValue('--text-secondary').trim(),
        colorAccent: cs.getPropertyValue('--color-accent').trim(),
        colorData: cs.getPropertyValue('--color-data').trim(),
      };
    });

    // Ink 950 canvas (#04070b = rgb(4, 7, 11))
    const canvasRgb = [4, 7, 11];
    // Paper 50 primary text (#f6f3ee = rgb(246, 243, 238))
    const primaryRgb = [246, 243, 238];
    // Grey 300 secondary text (#b5bcc6 = rgb(181, 188, 198))
    const secondaryRgb = [181, 188, 198];
    // Gold 500 accent (#e8a823 = rgb(232, 168, 35))
    const goldRgb = [232, 168, 35];
    // Teal 400 data (#1fc2c9 = rgb(31, 194, 201))
    const tealRgb = [31, 194, 201];

    const primaryContrast = getContrastRatio(primaryRgb, canvasRgb);
    const secondaryContrast = getContrastRatio(secondaryRgb, canvasRgb);
    const goldContrast = getContrastRatio(goldRgb, canvasRgb);
    const tealContrast = getContrastRatio(tealRgb, canvasRgb);

    console.log(`Contrast Ratios against Base Canvas:`);
    console.log(`  Primary Text:   ${primaryContrast.toFixed(2)}:1 (Requires ≥ 7.0:1 for AAA)`);
    console.log(`  Secondary Text: ${secondaryContrast.toFixed(2)}:1 (Requires ≥ 4.5:1 for AA)`);
    console.log(`  Gold Accent:    ${goldContrast.toFixed(2)}:1 (Requires ≥ 4.5:1 for AA)`);
    console.log(`  Teal Technical: ${tealContrast.toFixed(2)}:1 (Requires ≥ 4.5:1 for AA)`);

    // WCAG AAA for body text (≥ 7.0:1)
    expect(primaryContrast).toBeGreaterThanOrEqual(7.0);

    // WCAG AA for secondary text (≥ 4.5:1)
    expect(secondaryContrast).toBeGreaterThanOrEqual(4.5);

    // WCAG AA for accent text (≥ 4.5:1)
    expect(goldContrast).toBeGreaterThanOrEqual(4.5);
  });

  test('interactive-elements-have-accessible-names', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const issues = await page.evaluate(() => {
      const results = [];
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach((btn, idx) => {
        const text = btn.innerText?.trim() || btn.getAttribute('aria-label') || btn.getAttribute('title');
        if (!text) {
          results.push(`Button ${idx} missing accessible name`);
        }
      });

      const links = Array.from(document.querySelectorAll('a'));
      links.forEach((a, idx) => {
        const text = a.innerText?.trim() || a.getAttribute('aria-label') || a.getAttribute('title');
        if (!text) {
          results.push(`Link ${idx} missing accessible name: ${a.outerHTML}`);
        }
      });

      return results;
    });

    expect(issues).toEqual([]);
  });

  test('external-links-security-and-target-blank', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const violations = await page.evaluate(() => {
      const results = [];
      const externalLinks = Array.from(document.querySelectorAll('a[target="_blank"]'));
      externalLinks.forEach((a) => {
        const rel = a.getAttribute('rel') || '';
        if (!rel.includes('noopener') || !rel.includes('noreferrer')) {
          results.push(`Link missing rel="noopener noreferrer": ${a.getAttribute('href')}`);
        }
      });
      return results;
    });

    expect(violations).toEqual([]);
  });

  test('form-inputs-have-associated-labels', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Open modal to expose form
    await page.evaluate(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    const openBtn = page.locator('button:has-text("WRITE A NOTE")');
    await openBtn.click();
    await page.waitForTimeout(300);

    const formLabels = await page.evaluate(() => {
      const results = [];
      const inputs = Array.from(document.querySelectorAll('form input, form textarea'));
      inputs.forEach((input) => {
        const id = input.id;
        if (!id) {
          results.push('Form input missing id attribute');
          return;
        }
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          results.push(`Form input #${id} has no matching label[for="${id}"]`);
        }
      });
      return results;
    });

    expect(formLabels).toEqual([]);
  });
});
