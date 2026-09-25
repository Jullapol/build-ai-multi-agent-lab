import { chromium } from '@playwright/test';
const base = 'http://localhost:4321';
const shots = 'C:/Users/Lenovo/Downloads/dev/demo/build-ai-multi-agent-lab/docs/screenshots/';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
const p = await ctx.newPage();
const log = (...a) => console.log(...a);
let r = await p.goto(base + '/');
log('HOME', r.status(), '| h1=', await p.locator('h1').innerText(), '| headline=', await p.getByTestId('hero-headline').innerText(), '| tagline count=', await p.getByTestId('hero-tagline').count(), '| title=', await p.title());
await p.screenshot({ path: shots + 'home-desktop.png', fullPage: true });
for (const path of ['/about', '/interests', '/contact', '/guestbook']) {
  const res = await p.goto(base + path);
  const chain = []; let q = res.request(); while (q.redirectedFrom()) { q = q.redirectedFrom(); chain.push(q.url()); }
  log('PAGE', path, 'final=', res.status(), p.url(), 'redirectedFrom=', chain.join(','), '| h1=', await p.locator('h1').first().innerText().catch(() => '-'), '| cards=', await p.locator('#interests .interest-card').count(), '| forms=', await p.locator('form').count());
  if (path === '/about') await p.screenshot({ path: shots + 'about-desktop.png', fullPage: true });
  if (path === '/contact') await p.screenshot({ path: shots + 'not-found-contact.png', fullPage: true });
}
log('NAV', JSON.stringify(await p.locator('nav a').evaluateAll((as) => as.map((a) => a.textContent + '→' + a.getAttribute('href')))));
const demo = { name: 'Demo Visitor', email: 'demo@example.com', message: 'สวัสดีครับ ข้อความทดสอบ (demo)' };
for (const [url, body] of [['/api/contact', demo], ['/api/guestbook', { name: demo.name, message: demo.message }]]) {
  const res = await ctx.request.post(base + url, { data: body });
  log('POST', url, res.status(), (await res.text()).slice(0, 200));
}
const g = await ctx.request.get(base + '/api/guestbook');
log('GET /api/guestbook', g.status(), (await g.text()).slice(0, 200));
const m = await b.newPage({ viewport: { width: 360, height: 640 } });
await m.goto(base + '/');
const box = await m.getByTestId('hero-link').boundingBox();
log('MOBILE hero link bottom', Math.round(box.y + box.height), 'scrollY', await m.evaluate(() => scrollY));
await m.screenshot({ path: shots + 'home-mobile-360.png' });
await b.close();
