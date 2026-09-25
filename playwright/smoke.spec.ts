import { test, expect } from '@playwright/test';

const mobileViewport = { width: 360, height: 640 };

test('home renders nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.describe('mobile home hero', () => {
  test.use({ viewport: mobileViewport });

  test('fits in the first screen on 360x640', async ({ page }) => {
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
      };
    });
    expect(heroBottom.heroViewportTop).toBeGreaterThanOrEqual(heroBottom.firstScreenTop);
    expect(heroBottom.heroBottom).toBeLessThanOrEqual(mobileViewport.height + 1);
  });
});

test('contact page has form fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
});
