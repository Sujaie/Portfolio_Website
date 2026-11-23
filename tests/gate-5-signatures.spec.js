// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Gate 5 Signatures Suite: Work, Skills & Experience', () => {
  test('work-playback-tabs-and-terminal-interaction', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to work section
    await page.evaluate(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);

    // Verify 3 project cards exist
    const cards = page.locator('#work .grid.grid-cols-1.lg\\:grid-cols-12');
    expect(await cards.count()).toBe(3);

    // Check tabs on the first card
    const firstCard = cards.first();
    const tabs = firstCard.locator('[role="tab"]');
    expect(await tabs.count()).toBe(3);

    // Default tab is telemetry
    await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    await expect(firstCard.locator('[role="tabpanel"]')).toBeVisible();

    // Switch to Arch tab
    await tabs.nth(1).click();
    await page.waitForTimeout(400);
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(firstCard.locator('text=SYSTEM TOPOLOGY')).toBeVisible();

    // Switch to Terminal tab
    await tabs.nth(2).click();
    await page.waitForTimeout(400);
    await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');

    // Run terminal command 'ping'
    const pingBtn = firstCard.locator('button:has-text("ping")');
    await pingBtn.click();
    await page.waitForTimeout(300);
    await expect(firstCard.locator('text=icmp_seq=1')).toBeVisible();
  });

  test('skills-constellation-hover-and-meters', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to skills section
    await page.evaluate(() => {
      const el = document.getElementById('skills');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);

    // Check skill cards count
    const cards = page.locator('#skills .skill-card');
    expect(await cards.count()).toBe(6);

    // Verify segmented meters exist
    const segments = page.locator('.skill-meter-segment');
    expect(await segments.count()).toBeGreaterThan(20);

    // Test hover on first skill item
    const firstSkill = page.locator('#skills .skill-card .group').first();
    await firstSkill.hover();
    await page.waitForTimeout(400);

    // Constellation telemetry updates focus
    const focusDisplay = page.locator('#skills').getByText('FOCUS:');
    await expect(focusDisplay).toBeVisible();

    // Check Exploring row at bottom
    const exploringRow = page.locator('.skills-exploring-row');
    await expect(exploringRow).toBeVisible();
    await expect(exploringRow.locator('text=RAG & VECTOR SEARCH')).toBeVisible();
  });

  test('experience-trajectory-milestone-nodes-and-accordion', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll to experience section
    await page.evaluate(() => {
      const el = document.getElementById('experience');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await page.waitForTimeout(1000);

    // Verify 3 timeline items
    const items = page.locator('#experience .timeline-item');
    expect(await items.count()).toBe(3);

    // Verify milestone nodes exist
    const nodes = page.locator('#experience [aria-hidden="true"].rounded-full');
    expect(await nodes.count()).toBeGreaterThanOrEqual(3);

    // Test accordion expansion on item 0
    const toggleBtn = items.first().locator('button[aria-expanded]');
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    await toggleBtn.click();
    await page.waitForTimeout(300);
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(items.first().locator('text=Architecture Scope')).toBeVisible();

    // Collapse
    await toggleBtn.click();
    await page.waitForTimeout(300);
    await expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('gate-5-reduced-motion-fallback', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    // Check work
    const work = page.locator('#work');
    await expect(work).toBeVisible();

    // Check skills
    const skills = page.locator('#skills');
    await expect(skills).toBeVisible();

    // Check experience
    const experience = page.locator('#experience');
    await expect(experience).toBeVisible();

    const expOpacity = await experience.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(expOpacity)).toBe(1);
  });
});
