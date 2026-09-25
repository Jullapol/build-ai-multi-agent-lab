# SWARM — Lab 05b (OpenCode harness)

> สรุปผล swarm ต่อรอบ · เพดาน **20 turns** · หยุดเมื่อ done หรือครบเพดาน

Run date: 2026-09-25 · Driver: OpenCode (session ses_f28763bb5ffePwNnU4saz0nFMZ)

## Turns used: ~12 / 20 — หยุดก่อนเพดาน (done)

| # | Turn | Who | งาน |
|---|---|---|---|
| 1 | load skill `public-site-safe` | driver | guardrails |
| 2 | อ่าน docs (STATUS/OPEN_LOOPS/DECISIONS/handoffs) | driver | DECISIONS ยังไม่มี (L3) |
| 3 | รัน `npm run test:labs` | driver | **green 2/2** |
| 4 | อ่าน `guestbook.astro` / `contact.astro` (read-only) | driver | ฟอร์มผูก API แล้ว |
| 5 | spawn subagent (explore, read-only) + ตรวจ dev server | driver | contract+safety review |
| 6–10 | ส่งฟอร์ม guestbook บน localhost:4321 ผ่าน Playwright | driver | POST สำเร็จ, entry persist + render |
| 11 | ส่งฟอร์ม contact บน localhost:4321 | driver | status "Sent. Thank you!" |
| 12 | เขียนสรุป SWARM + hot state | driver | เอกสารนี้ |

## Outcome — done criteria ครบ

- ✅ `npm run test:labs` green (2/2) — ยืนยันในรอบนี้
- ✅ ส่งฟอร์ม demo บน localhost ได้จริง:
  - **Guestbook**: POST → SQLite (`data/site.sqlite`) → entry "Swarm Demo — ส่งจาก localhost demo — Lab 05b" แสดงทันทีผ่าน `GET /api/guestbook`
  - **Contact**: POST → 201 → status text "Sent. Thank you!" (ผูก `POST /api/contact` สำเร็จ)

## Gaps (ยังไม่แก้ — ownership ฝั่ง Claude frontend)

1. **Blocker เชิงความปลอดภัย — stored XSS ใน guestbook** (`src/pages/guestbook.astro:29-31`): render entry ด้วย `innerHTML` จาก `${e.name}` / `${e.message}` ดิบ ๆ ไม่มี HTML escaping — ข้อความที่มี `<script>`/`<img onerror>` จะรันในเบราว์เซอร์ผู้ชมทุกคน เปิด loop **L5** ให้ Claude/`frontend` แก้ (escape หรือใช้ textContent) — ฝั่ง OpenCode **ไม่แก้ UI ตาม ownership**
2. **UX gap — guestbook submit ไม่ดู response**: ผู้ใช้ไม่เห็น error ถ้า POST พัง (`guestbook.astro:33-43`) — รวมเป็นงานฝั่ง frontend เดียวกับ L5
3. **Notes**: client maxlength เข้มกว่า server (ไม่มี conflict) · ไม่มี rate limit/spam protection · meta description ใน `BaseLayout.astro` มีคำ "multi-agent course" โผล่หน้าเว็บ (minor)

## กติกาที่ถือครบรอบนี้

- ไม่แก้ไฟล์ test · ไม่แก้ UI (อ่านอย่างเดียว) · ไม่ commit/พิมพ์ secret · MCP ไม่ได้ใช้เป็นท่อ Claude↔OpenCode (subagent = OpenCode-native harness)