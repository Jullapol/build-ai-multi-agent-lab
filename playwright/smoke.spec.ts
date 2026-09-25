import { test, expect } from '@playwright/test';

test('home renders nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('home hero fits in the first screen on 360x640', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 0));

  const hero = page.locator('main .hero');
  await expect(hero).toBeVisible();
  await expect(hero.locator('.hero-role')).toBeVisible();
  await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  const cta = hero.locator('a[href="/about"]');
  await expect(cta).toBeVisible();
  await expect(hero.locator('a')).toHaveCount(1);

  const heroBottom = await hero.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      heroViewportTop: rect.top,
      heroBottom: rect.bottom,
      firstScreenTop: 0,
      firstScreenBottom: window.innerHeight,
    };
  });
  expect(heroBottom.heroViewportTop).toBeGreaterThanOrEqual(heroBottom.firstScreenTop);
  expect(heroBottom.heroBottom).toBeLessThanOrEqual(heroBottom.firstScreenBottom + 1);
});

test('contact page has form fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
});
