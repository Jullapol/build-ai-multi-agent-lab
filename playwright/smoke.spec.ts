import { test, expect } from '@playwright/test';

test('home renders nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

// D3 + D12: replaces the old "contact page has form fields" check — the menu is now 2 items.
test('menu has exactly หน้าแรก and เกี่ยวกับผม', async ({ page }) => {
  await page.goto('/');
  const links = page.getByRole('navigation', { name: 'หลัก' }).getByRole('link');
  await expect(links).toHaveCount(2);
  await expect(links.nth(0)).toHaveText('หน้าแรก');
  await expect(links.nth(0)).toHaveAttribute('href', '/');
  await expect(links.nth(1)).toHaveText('เกี่ยวกับผม');
  await expect(links.nth(1)).toHaveAttribute('href', '/about');
});

// D3: old /interests URL keeps working via a reversible 302.
test('/interests redirects 302 to /about#interests', async ({ page, request }) => {
  const res = await request.get('/interests', { maxRedirects: 0 });
  expect(res.status()).toBe(302);
  expect(res.headers()['location']).toBe('/about#interests');
  await page.goto('/interests');
  await expect(page).toHaveURL(/\/about#interests$/);
  await expect(page.locator('#interests .interest-card')).toHaveCount(4);
});

// D7: no contact page and no dummy links until the owner picks a real channel.
test('/contact is not rendered and no example links exist', async ({ page, request }) => {
  expect((await request.get('/contact')).status()).toBe(404);
  for (const path of ['/', '/about']) {
    await page.goto(path);
    await expect(page.locator('a[href*="example"]')).toHaveCount(0);
    await expect(page.locator('a[href="/contact"], a[href="/interests"]')).toHaveCount(0);
  }
});
