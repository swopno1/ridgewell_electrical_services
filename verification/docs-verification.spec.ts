import { test, expect } from '@playwright/test';

test('Documentation routes are accessible', async ({ page }) => {
  // Go to the main docs page
  await page.goto('http://localhost:3000/docs');
  await expect(page.locator('h1')).toContainText('Documentation');
  await page.screenshot({ path: 'verification/docs-index.png' });

  // Go to Phase 1 docs
  await page.goto('http://localhost:3000/docs/phase-1');
  await expect(page.locator('h1')).toContainText('TimesheetPro User Guide');
  await page.screenshot({ path: 'verification/docs-phase-1.png' });

  // Go to Phase 2 docs
  await page.goto('http://localhost:3000/docs/phase-2');
  await expect(page.locator('h1')).toContainText('TimesheetPro: Timesheet Logging & Daily Shift Entries');
  await page.screenshot({ path: 'verification/docs-phase-2.png' });
});
