# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 17:10 +07:00  
Updated by: OpenCode (merge Lab 04 → main)

## Current goal

- Ship prep — Lab 04 (PR #12) merge เข้า main แล้ว · ขั้นถัดไป: QA หลัง merge → deploy (Lab 08)

## Done

- Lab 02 debate → `docs/DEBATE.md` · `docs/DECISIONS.md` D1–D12 · Lab 03 issues #1–#11
- Lab 05: `insertContact` / `insertGuestbook` / `listGuestbook` — better-sqlite3 · **PR #13 MERGED → main (15:38)**
- Hardening D-03 (rate limit) · D-04/D-05 (CSP + sanitize + honeypot) — **PR #14/#15 MERGED** · tests 9/9 + labs 2/2
- Lab 04 **Commit A** (security + D4/D5/D9/D10): `/guestbook` 404 · error คงที่ · meta description กลาง · หน้า 404 แบรนด์ · Hero ตาม D4 (ผ่าน 360×640) · About เว้นย่อหน้า + การ์ด 4 ใบ · โทนครีม/ส้มอิฐ (AA ผ่าน)
- Lab 04 **Commit B** (IA · D3/D7/D8): เมนู 2 อัน · `/interests` 302 → `/about#interests` · ไม่ render `/contact` · `playwright/smoke.spec.ts` แก้ในก้อนเดียวกัน
- `src/lib/profile.ts`: regex F1 แก้แล้ว (lookahead `(?![\s\S])` — อ่านหลายบรรทัดได้) + เพิ่ม field `tagline` (optional)
- Lab 05b swarm (~12/20 turns): ส่งฟอร์ม guestbook + contact บน localhost:4321 ผ่านจริง · [`SWARM.md`](./SWARM.md)

## In progress

- Merge Lab 04 → main (resolve conflict 6 ไฟล์ · DECISIONS รวมสองชุด D1–D12 + D-01–D-05) · จากนั้น: npm test + build บน main → ปิด PR #12

## Blocked

- Ship: headline ใน PROFILE ยังเป็น "ทำงานแทน" และยังไม่มี `## Tagline` (D1 · L7) — Hero ซ่อน tagline อัตโนมัติจนกว่าจะมี
- **human (L4-PAT, P0)**: revoke/rotate GitHub PAT ที่หลุดเข้าแชท — ที่ github.com/settings/tokens

## Next actions

1. Commit merge → push `lab-04-frontend` → merge PR #12 (จะมี conflict แจ้งบน GitHub จนกว่า push นี้จะขึ้น)
2. บน main: `npm test` + `npm run build` + smoke หน้าเว็บ → ยืนยันก่อน deploy
3. Lab 06 a11y (ค้าง) · JT: L4 (ช่องทางติดต่อ) / L7 (headline+tagline) / L8 (override Must) ก่อน ship จริง

## Files changed in latest session

- Merge `main` → `lab-04-frontend`: resolve `docs/{DECISIONS,OPEN_LOOPS,STATUS}.md` · `opencode.json` · ลบ `src/pages/{contact,guestbook}.astro` คงตาม branch (D6/D7)
- รีวิวอิสระ: `docs/review-opencode.md` (Lab 04) · `docs/review-opencode-lab05.md` (Lab 05)

## Notes

- Proposed vs Approved: ⏳ = รอ JT · ✅ = ทำได้เลย · Latest D-id: D-05 (backend) / D12 (debate)
- API `/api/contact` + `/api/guestbook` ยังทำงาน (Lab 05) แม้ UI หน้าฟอร์มถูกลบตาม D6/D7 — hardening D-03/D-04/D-05 ครอบอยู่ · การจะปิด API ตาม D11 ต้องตัดสินที่ JT (ผูกกับ L4/L5)
