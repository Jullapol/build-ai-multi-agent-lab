# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 +07:00  
Updated by: Claude (`frontend`)

## Current goal

- Lab 04 frontend เสร็จใน working tree (ยังไม่ commit) → JT commit A / B แยกกัน · ส่ง backend Lab 05 ผ่าน `docs/handoffs/04-claude-to-opencode.md`

## Done

- Lab 02 debate → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D12 · Lab 03 issues #1–#11
- Lab 04 **Commit A** (security + D4/D5/D9/D10 · merge ได้): `/guestbook` 404 · ตัดลิงก์ guestbook · error คงที่ · meta description กลาง · หน้า 404 แบรนด์ · Hero ตาม D4 (ผ่าน 360×640) · About เว้นย่อหน้า + การ์ด 4 ใบ · โทนครีม/ส้มอิฐ (AA ผ่าน)
- Lab 04 **Commit B** (IA · PR รอ JT): เมนู 2 อัน · `/interests` 302 → `/about#interests` · ไม่ render `/contact` · `playwright/smoke.spec.ts` แก้ในก้อนเดียวกัน
- `npm test` 3/3 · `npm run build` ผ่าน · `npm run test:e2e` 10/10 · `test:labs` แดง 2 ข้อ (NOT_IMPLEMENTED · คาดไว้)

## In progress

- —

## Blocked

- Ship: headline ใน PROFILE ยังเป็น "ทำงานแทน" และยังไม่มี `## Tagline` (D1 · L7) — Hero ซ่อน tagline อัตโนมัติจนกว่าจะมี
- Merge Commit B ต้องรอ JT ยืนยัน override Must (D7, D8 · L8) + ช่องทางติดต่อ (L4)

## Next actions

1. JT: commit A (ดูรายการไฟล์ใน handoff) → merge · commit B → เปิด PR เข้า learner repo
2. JT: แก้ `## Headline` + เพิ่ม `## Tagline` ใน PROFILE (L7) · ตอบ L4 / L8
3. OpenCode `backend`: Lab 05 ตาม handoff `04-claude-to-opencode.md` (D11 · L10)

## Files changed in latest session

- `src/layouts/BaseLayout.astro` · `src/pages/{index,about,interests,404}.astro` · ลบ `src/pages/{guestbook,contact}.astro`
- `src/lib/profile.ts` (เพิ่ม field `tagline` แบบ optional) · `playwright/site.spec.ts` (ใหม่) · `playwright/smoke.spec.ts`
- `docs/STATUS.md` · `docs/OPEN_LOOPS.md` · `docs/handoffs/04-claude-to-opencode.md`

## Notes

- prompt กลางของ Lab 04 ขอ "4 หน้า + ลิงก์ Guestbook" — **ไม่ได้ทำตาม** เพราะ D6 ✅ (guestbook 404) และ D3/D7 ⏳ · JT ตัดสินผ่าน L4/L8
- Proposed vs Approved: ⏳ = รอ JT · ✅ = ทำได้เลย · Latest D-id: D12
