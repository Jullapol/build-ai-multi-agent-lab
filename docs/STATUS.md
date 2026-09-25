# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 15:35 +07:00  
Updated by: OpenCode

## Current goal

- Lab 05b swarm — guestbook/API พร้อม demo บน localhost (✅ ครบ done criteria, ก่อนเพดาน 20 turns)

## Done

- Lab 05: `insertContact` / `insertGuestbook` / `listGuestbook` ใน `src/lib/db.ts` — better-sqlite3, validate input, error ปลอดภัย ✅
- `npm run test:labs` green (2/2) · `npm test` green (3/3) — ยืนยันซ้ำล่าสุด 15:19
- API routes (`contact.ts`, `guestbook.ts`) — validation → 400, unexpected → 500 generic (ไม่หลุดรายละเอียดภายใน)
- **Lab 05b swarm** (~12/20 turns, จบก่อนเพดาน): ส่งฟอร์ม guestbook + contact บน localhost:4321 ผ่านจริง (Playwright) · สรุปใน [`SWARM.md`](./SWARM.md)

## In progress

- —

## Blocked

- —

## Next actions

1. **Claude/`frontend` (L5)**: แก้ stored XSS ใน `guestbook.astro` (innerHTML → escape/textContent) + แสดง error เมื่อ POST พัง
2. สร้าง PR ฝั่ง backend — owner OpenCode
3. บันทึก `docs/DECISIONS.md` (L3) — validation rules: name ≤100 · email ≤254 · contact msg ≤2000 · guestbook msg ≤1000

## Files changed in latest session

- `docs/SWARM.md` (ใหม่) · `docs/STATUS.md` · `docs/OPEN_LOOPS.md` — เอกสาร swarm/loop เท่านั้น (**ไม่มีการแก้โค้ดรอบนี้**)

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- ยังไม่มี `docs/DECISIONS.md` — D-id แรกควรบันทึกเมื่อเลือก validation rules ถาวร (ตอนนี้: name ≤100, email ≤254 + basic regex, contact msg ≤2000, guestbook msg ≤1000)
