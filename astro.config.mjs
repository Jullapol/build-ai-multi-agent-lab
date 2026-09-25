// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { host: true, port: 4321 },
  // D-04: ห้าม inline page scripts — CSP `script-src 'self'` จะ block inline script
  // (บังคับออกเป็นไฟล์ external แทนการคลาย CSP ด้วย 'unsafe-inline')
  vite: { build: { assetsInlineLimit: 0 } },
});
