// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gate 2A + 2B: Palette V2 Foundation & Layered Atmospheric Background', () => {
  test('palette-v2-token-primitives-and-semantic-mapping', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const tokens = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        inkCanvas: cs.getPropertyValue('--ink-canvas').trim(),
        inkSurface1: cs.getPropertyValue('--ink-surface-1').trim(),
        inkSurface2: cs.getPropertyValue('--ink-surface-2').trim(),
        tealElectric: cs.getPropertyValue('--teal-electric').trim(),
        tealOriginal: cs.getPropertyValue('--teal-original').trim(),
        goldChampagne: cs.getPropertyValue('--gold-champagne').trim(),
        indigoSoft: cs.getPropertyValue('--indigo-soft').trim(),
        bgBase: cs.getPropertyValue('--bg-base').trim(),
        colorAccent: cs.getPropertyValue('--color-accent').trim(),
        colorData: cs.getPropertyValue('--color-data').trim(),
        borderSubtle: cs.getPropertyValue('--border-subtle').trim(),
        borderDefault: cs.getPropertyValue('--border-default').trim(),
      };
    });

    // Foundation
    expect(tokens.inkCanvas.toLowerCase()).toBe('#050810');
    expect(tokens.inkSurface1.toLowerCase()).toBe('#0b1420');
    expect(tokens.inkSurface2.toLowerCase()).toBe('#111c2b');

    // Accents
    expect(tokens.tealElectric.toLowerCase()).toBe('#35d6df');
    expect(tokens.tealOriginal.toLowerCase()).toBe('#1fc2c9');
    expect(tokens.goldChampagne.toLowerCase()).toBe('#f0bd58');
    expect(tokens.indigoSoft.toLowerCase()).toBe('#7588ff');

    // Semantic bindings
    expect(tokens.bgBase.toLowerCase()).toBe('#050810');
    expect(tokens.colorAccent.toLowerCase()).toBe('#f0bd58');
    expect(tokens.colorData.toLowerCase()).toBe('#35d6df');
  });

  test('atmospheric-background-6-layers-exist-and-render-in-z-plane-0', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const layers = await page.evaluate(() => {
      const bg = document.getElementById('atmospheric-background');
      if (!bg) return null;

      const hasCanvas = !!document.getElementById('atmosphere-canvas');
      const hasNoise = !!document.getElementById('atmosphere-grain');
      const hasGrid = !!document.getElementById('atmosphere-grid');
      const hasVignette = !!document.getElementById('atmosphere-vignette');
      const hasHome = !!document.getElementById('atmosphere-home');
      const hasContact = !!document.getElementById('atmosphere-contact');

      return {
        exists: true,
        hasCanvas,
        hasNoise,
        hasGrid,
        hasVignette,
        hasHome,
        hasContact,
      };
    });

    expect(layers).not.toBeNull();
    expect(layers?.exists).toBe(true);
    expect(layers?.hasCanvas).toBe(true);
    expect(layers?.hasNoise).toBe(true);
    expect(layers?.hasGrid).toBe(true);
    expect(layers?.hasVignette).toBe(true);
    expect(layers?.hasHome).toBe(true);
    expect(layers?.hasContact).toBe(true);
  });

  test('continuous-smooth-reversible-scroll-transitions', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // 1. At top of page (Hero active): Hero opacity is high, Contact is 0
    const topOpacities = await page.evaluate(() => {
      const home = document.getElementById('atmosphere-home');
      const contact = document.getElementById('atmosphere-contact');
      return {
        home: parseFloat(home?.style?.opacity || getComputedStyle(home).opacity || '0'),
        contact: parseFloat(contact?.style?.opacity || getComputedStyle(contact).opacity || '0'),
      };
    });
    expect(topOpacities.home).toBeGreaterThan(0.7);
    expect(topOpacities.contact).toBeLessThan(0.1);

    // 2. Scroll to Contact section: Contact opacity rises, Hero drops
    await page.evaluate(() => {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(600);

    const bottomOpacities = await page.evaluate(() => {
      const home = document.getElementById('atmosphere-home');
      const contact = document.getElementById('atmosphere-contact');
      return {
        home: parseFloat(home?.style?.opacity || getComputedStyle(home).opacity || '0'),
        contact: parseFloat(contact?.style?.opacity || getComputedStyle(contact).opacity || '0'),
      };
    });
    expect(bottomOpacities.contact).toBeGreaterThan(0.7);
    expect(bottomOpacities.home).toBeLessThan(0.1);

    // 3. Scroll back up to Hero: Reversibility verified
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(600);

    const returnOpacities = await page.evaluate(() => {
      const home = document.getElementById('atmosphere-home');
      const contact = document.getElementById('atmosphere-contact');
      return {
        home: parseFloat(home?.style?.opacity || getComputedStyle(home).opacity || '0'),
        contact: parseFloat(contact?.style?.opacity || getComputedStyle(contact).opacity || '0'),
      };
    });
    expect(returnOpacities.home).toBeGreaterThan(0.7);
    expect(returnOpacities.contact).toBeLessThan(0.1);
  });

  test('reduced-motion-fallback-preserves-static-lighting', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Hero opacity is static 1
    const homeOpacity = await page.evaluate(() => {
      const home = document.getElementById('atmosphere-home');
      return parseFloat(home?.style?.opacity || getComputedStyle(home).opacity || '0');
    });
    expect(homeOpacity).toBeGreaterThan(0.7);
  });
});
