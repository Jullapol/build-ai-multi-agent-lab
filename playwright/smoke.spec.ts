import { test, expect } from '@playwright/test';

test('home renders nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('home hero fits in the first screen on 360x640', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/');

  const hero = page.locator('main .hero');
  await expect(hero).toBeVisible();
  await expect(hero.getByText('Builder')).toBeVisible();
  await expect(hero.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(hero).toContainText('ออกแบบงานให้คนที่งานล้นมือเบาขึ้นได้จริง');
  await expect(hero).toContainText('ทีมผู้ช่วยที่แบ่งหน้าที่กัน');
  await expect(hero.getByRole('link', { name: 'รู้จักผมมากขึ้น →' })).toBeVisible();
  await expect(hero.getByText('Personal branding site')).toHaveCount(0);
  await expect(hero.getByText('Audience:')).toHaveCount(0);

  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBe(0);

  const heroBottom = await hero.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { bottom: rect.bottom, viewportHeight: window.innerHeight };
  });
  expect(heroBottom.bottom).toBeLessThanOrEqual(heroBottom.viewportHeight);
});

test('contact page has form fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
});
