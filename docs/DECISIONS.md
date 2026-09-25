# Decisions

> บันทึก decision ที่**อนุมัติแล้ว**เท่านั้น · brainstorm/ยังไม่ปิดอยู่ใน `DEBATE.md`  
> อ้างอิง D-id จาก PR / STATUS / OPEN_LOOPS ได้

| ID | Decision | Status | อ้างอิงไฟล์ |
|---|---|---|---|
| D-01 | Persistence layer = **better-sqlite3** ผ่าน `src/lib/db.ts` · ไฟล์ DB อยู่ที่ `${DATA_DIR:-cwd}/data/site.sqlite` (สร้าง dir อัตโนมัติ · ตาราง `contact_messages` + `guestbook`) | Approved | `src/lib/db.ts` |
| D-02 | Validation rules — `name` 1–100 ตัวอักษร · `email` 1–254 + basic regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) · contact `message` 1–2000 · guestbook `message` 1–1000 · error ที่ขึ้นต้น `"VALIDATION:"` ใช้ส่งกลับ client ได้ (HTTP 400) · error อื่นทั้งหมดคืน generic `"internal error"` (HTTP 500) ไม่หลุดรายละเอียดภายใน | Approved | `src/lib/db.ts`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts` |
| D-03 | Anti-spam = in-memory per-IP rate limit (`src/lib/rate-limit.ts`) — contact POST 3 ครั้ง/10 นาที · guestbook POST 5 ครั้ง/10 นาที · เกิน → HTTP 429 + `Retry-After` (วินาที) · จำกัดต่อ IP จาก `x-forwarded-for` ตัวแรก (fallback `x-real-ip` → `"unknown"`) · **single-process เท่านั้น** — deploy แบบหลาย instance ต้องใช้ shared store (เช่น Redis) จึงจะครอบคลุม | Approved | `src/lib/rate-limit.ts`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts`, `tests/rate-limit.test.ts` |
| D-04 | Security headers ทุก response ผ่าน `src/middleware.ts` (CSP `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'` ฯลฯ — เว้น `style-src 'unsafe-inline'` เพราะหน้าใช้ inline style attribute) + server-side sanitize: strip control chars จาก text ก่อนเก็บ (เว้น `\n`/`\t`), email ที่มี control char → reject | Approved | `src/middleware.ts`, `src/lib/db.ts`, `tests/hardening.test.ts` |
| D-05 | Honeypot = hidden field `website` ในฟอร์ม contact/guestbook — ถ้ายัดมาไม่ว่าง (bot) → ตอบ `201 {ok:true}` ปลอม **โดยไม่บันทึกลง DB** (silent success เพื่อไม่เผยสัญญาณให้ bot); field ซ่อนในฟอร์มเป็นงาน UI ฝั่ง Claude/frontend | Approved | `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts`, ฟอร์ม: `src/pages/*.astro` (Claude) |
