import { test, expect } from '@playwright/test';

// D4: hero must fit the first screen at 360x640 without scrolling.
test.describe('hero at 360x640', () => {
  test.use({ viewport: { width: 360, height: 640 } });

  test('name, Builder, headline, tagline and link are all above the fold', async ({ page }) => {
    await page.goto('/');
    const parts = [
      page.getByRole('heading', { level: 1 }),
      page.getByText('Builder', { exact: true }),
      page.getByTestId('hero-headline'),
      page.getByTestId('hero-link'),
    ];
    const tagline = page.getByTestId('hero-tagline');
    if (await tagline.count()) parts.push(tagline);
    for (const el of parts) {
      await expect(el).toBeVisible();
      const box = await el.boundingBox();
      expect(box, 'element has a box').not.toBeNull();
      expect(box!.y + box!.height).toBeLessThanOrEqual(640);
    }
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });

  test('hero has exactly one link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main a')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'รู้จักผมมากขึ้น →' })).toHaveAttribute('href', '/about');
  });
});

// D6: guestbook is closed and nothing links to it.
test('guestbook returns 404 and is not linked', async ({ page, request }) => {
  const res = await request.get('/guestbook');
  expect(res.status()).toBe(404);
  await page.goto('/');
  await expect(page.locator('a[href="/guestbook"]')).toHaveCount(0);
});

// D9: branded 404 with fixed copy and two ways back.
test('404 page is branded with home/about buttons', async ({ page }) => {
  const res = await page.goto('/this-page-does-not-exist');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'หน้านี้ผู้ช่วยผมเก็บไปแล้วครับ' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'หน้าแรก' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('main').getByRole('link', { name: 'เกี่ยวกับผม' })).toHaveAttribute('href', '/about');
});

// D5: bio paragraphs + 4 interest cards + closing line.
test('about shows bio paragraphs, 4 interest cards and a way home', async ({ page }) => {
  await page.goto('/about');
  expect(await page.locator('article p').count()).toBeGreaterThan(1);
  await expect(page.locator('#interests .interest-card')).toHaveCount(4);
  await expect(page.locator('#interests .interest-card h3').first()).not.toContainText('—');
  await expect(page.getByRole('link', { name: '← กลับหน้าแรก' })).toHaveAttribute('href', '/');
});

// D9: no course/tech leaks in rendered pages (runtime check the static guard can't do).
test('rendered pages have no course or placeholder text', async ({ page }) => {
  for (const path of ['/', '/about']) {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toMatch(/\blab\s*0?\d/i);
    expect(html).not.toMatch(/course|เวิร์กช็อป|เร็ว ๆ นี้|example\.com|github\.com\/example/i);
  }
});
