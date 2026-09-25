# Handoff: Claude (`frontend`) → OpenCode (`backend`)

Timestamp: 2026-09-25 14:25 +07:00  
Task: Lab 04 frontend (D3–D10, D12) เสร็จ → ส่งต่อ Lab 05 backend (D11 · L10)  
Status: IMPLEMENTED (UI · ยังไม่ commit — JT แยก Commit A / B)

## What changed

- **Commit A (security + D4/D5/D9/D10 · merge ได้เลย)**
  - ลบ `src/pages/guestbook.astro` → `/guestbook` ตอบ 404 (ปิด XSS `innerHTML` + error ดิบ) · ไม่มีลิงก์ไป guestbook
  - หน้า contact: ตัดข้อความ `POST /api/contact` · สถานะใช้ข้อความคงที่ ไม่แสดง `data.error`
  - `BaseLayout`: meta description ค่าเริ่มต้นเป็นกลาง · เมนูภาษาไทย · โทนครีม/ส้มอิฐ/น้ำตาลอ่อน (สลับ token ทั้งชุด · AA: text 15.0, muted 8.1, accent 5.7, ขาวบน accent 6.1)
  - Hero (D4): ชื่อ + Builder + headline + tagline (ถ้ามี `## Tagline`) + ลิงก์เดียว "รู้จักผมมากขึ้น →"
  - About (D5): Bio คงย่อหน้า · การ์ด Interests 4 ใบใน `#interests` (แยกหัวตรง "—" ใน UI) · ข้อความท้ายหน้า + "← กลับหน้าแรก"
  - หน้า `404.astro` แบรนด์ · ตัด "อัปเดตเร็ว ๆ นี้"
  - `src/lib/profile.ts`: เพิ่ม `tagline: string` (อ่าน `## Tagline` · ไม่มี = `''`) — `interests: string[]` ไม่เปลี่ยน
- **Commit B (IA · PR รอ JT · D3/D7/D8)**
  - เมนูเหลือ 2 อัน: หน้าแรก · เกี่ยวกับผม
  - `/interests` → 302 `/about#interests`
  - ลบ `src/pages/contact.astro` → `/contact` 404 · ไม่มีลิงก์ `example`
  - `playwright/smoke.spec.ts`: เปลี่ยนเทสต์ฟอร์ม contact เป็นเทสต์เมนู 2 อัน + 302 + `/contact` 404

## Files

- Commit A: `src/layouts/BaseLayout.astro` (เวอร์ชันเมนู 4 อัน) · `src/pages/index.astro` · `src/pages/about.astro` · `src/pages/404.astro` (ใหม่) · `src/pages/interests.astro` (เวอร์ชันหน้ารายการ) · `src/pages/contact.astro` (เวอร์ชันข้อความคงที่) · ลบ `src/pages/guestbook.astro` · `src/lib/profile.ts` · `playwright/site.spec.ts` (ใหม่)
- Commit B: `src/layouts/BaseLayout.astro` (navItems เหลือ 2) · `src/pages/interests.astro` (redirect) · ลบ `src/pages/contact.astro` · `playwright/smoke.spec.ts`
- หมายเหตุ: `src/lib/profile.ts` มีการแก้ regex เดิม (ก่อนรอบนี้ · ไม่ใช่ของ frontend) ค้างอยู่ใน working tree ด้วย
- **ไม่ได้แตะ** `src/lib/db.ts` · `src/pages/api/*`

## Verification

- Unit / smoke: PASS — `npm test` → `Test Files 2 passed (2)` · `Tests 3 passed (3)` · `npm run build` → `Complete!`
- Labs (`npm run test:labs`): FAIL (คาดไว้) — 2 ข้อ `NOT_IMPLEMENTED: insertContact` / `insertGuestbook` → งานของ backend
- E2E: `npm run test:e2e` บน `node ./dist/server/entry.mjs` → `10 passed` (รวม Hero 360×640 · guestbook 404 · 404 แบรนด์ · About 4 การ์ด · เมนู 2 อัน · `/interests` 302 · `/contact` 404)
- Manual / localhost: `/` 200 · `/about` 200 · `/interests` 302 · `/contact` 404 · `/guestbook` 404 · `/api/interests` 200
- Hero ทดสอบซ้ำด้วย PROFILE สำเนา (scratch) ที่ใส่ headline + tagline ตาม D1 → ผ่าน 360×640 (ปุ่มจบที่ 388px)

## Assumptions to challenge

1. `/api/guestbook` และ `/api/contact` ยังยิงตรงได้ แม้ UI ไม่มีฟอร์มแล้ว — ซ่อน UI ≠ ปิดช่อง (D11)
2. ข้อความ error ของ `db.ts` stub ("…Lab 05 OpenCode") ยังไหลออกทาง JSON ของ `/api/*` ได้ — UI ไม่แสดงแล้ว แต่ response ยังมี

## Request to next agent

**OpenCode `backend` · Lab 05 · implement API เท่านั้น — อย่าแตะ UI (`src/pages/*.astro`, `src/layouts/`)**

1. `src/pages/api/*.ts`: เมื่อ lib ยังไม่พร้อม ตอบ 501 ด้วยข้อความกลาง เช่น `{"error":"unavailable"}` — ห้ามส่งข้อความที่มี "Lab" / "OpenCode" / stack trace ออกไป (D9, D11)
2. `src/lib/db.ts`: implement `insertContact` / `listGuestbook` / `insertGuestbook` ให้ `npm run test:labs` เขียว · validate ความยาวฝั่ง server (ชื่อ ≤ 80, อีเมล ≤ 120, ข้อความ ≤ 2000 / guestbook ≤ 500) → throw เพื่อได้ 400
3. ระหว่างที่ UI ปิด (L5 ยังไม่ตอบ): POST ต้องไม่บันทึกลง SQLite จริง — เสนอ flag ปิด/เปิดใน `docs/` ให้ JT ตัดสิน (อย่าเดาเอง)
4. `listGuestbook` ห้ามคืน email · คืนแค่ `name`, `message`, `created_at`
5. จบงาน: เขียน handoff กลับ `docs/handoffs/05-opencode-to-claude.md` + อัปเดต STATUS / OPEN_LOOPS (L10)

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (L6 ปิด · L7/L9/L10 อัปเดต)
- [ ] `docs/DECISIONS.md` (ไม่มี decision ใหม่)
- [x] อื่น ๆ: handoff นี้

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (`backend`) — หลัง JT commit งาน Lab 04 แล้วเท่านั้น
