import { test, expect } from '@playwright/test';

test('Maintenance doc is accessible with new title', async ({ page }) => {
  // Go to the maintenance docs page
  await page.goto('http://localhost:3000/docs/maintenance');

  // Check for the new title in the content
  await expect(page.locator('h1')).toContainText('Release Notes & Maintenance Proposal');

  // Check for specific maintenance plan pricing
  await expect(page.locator('body')).toContainText('$100/month');

  // Check for hosting info
  await expect(page.locator('body')).toContainText('Vercel');
  await expect(page.locator('body')).toContainText('Hobby');

  await page.screenshot({ path: 'verification/docs-maintenance-updated.png' });
});
