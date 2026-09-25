# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L4 | เลือกช่องทางติดต่อจริง 1 ช่อง (แนะนำ GitHub) หรือประกาศว่าไม่มี | human | P0 | ก่อน merge Commit B | D7 · UX/Devil/reviewer ชี้ว่าเป็น "ข้อเดียวที่ควรตัดสินวันนี้" · ห้ามแสดง `example` |
| L7 | แก้ `## Headline` ใน PROFILE เป็น "ผู้ช่วย AI ที่ไม่ต้องจ่ายเงินเดือน (แต่ต้องสอนงาน)" + เพิ่มหัวข้อ `## Tagline` (ข้อความ tagline ตาม D1) | human | P0 | blocker ก่อน ship | D1 · agent ไม่แก้ให้ · Hero อ่าน `## Tagline` แล้ว (ไม่มี = ซ่อน) · ทดสอบกับข้อความ D1 แล้วผ่าน 360×640 |
| L8 | ยืนยัน override Must 2 ข้อ (D7 ลิงก์ dummy, D8 ผลงาน 2–3 การ์ด) + เลือกเป้าเว็บ Portfolio / หน้าแนะนำตัว | human | P0 | ก่อน merge Commit B | D12 · Commit B อยู่ใน PR รอ merge |
| L2 | ย่อ Bio ใน PROFILE จาก 5 เหลือ 3–4 ย่อหน้า | human | P0 | ก่อน Lab 04 | D5 · มุม "ผู้ช่วยที่ไม่ต้องจ่ายเงินเดือน" |
| L3 | หัว Interests ทุกข้อให้เหลือ ≤ 4 คำ ขึ้นต้นด้วยผลลัพธ์ (รูปแบบ `หัว — คำอธิบาย`) | human | P1 | ก่อน Lab 04 | D5 · เช่น "เลิกเดาบั๊ก — ไล่ process flow…" |
| L9 | Lab 04 Commit B (PR): เมนู 2 อัน · `/interests` 302 · ไม่ render `/contact` · แก้ `smoke.spec.ts` — **implement แล้วใน working tree** รอ JT แยก commit + เปิด PR + merge | human (merge) | P1 | หลัง L4 + L8 | D3, D7, D8, D12 · ไฟล์ดู handoff `04-claude-to-opencode.md` · e2e ผ่าน |
| L10 | Backend: `api/*` ตอบ 501 ด้วยข้อความกลาง (ไม่อ้างคอร์ส) · POST ไม่บันทึกลง SQLite ระหว่าง UI ปิด · ตรวจความยาวฝั่ง server | OpenCode (backend) | P1 | Lab 05 · handoff เขียนแล้ว | D11 · `docs/handoffs/04-claude-to-opencode.md` |
| L5 | ตอบว่าใครอ่านข้อความจาก contact form / guestbook · เก็บกี่วัน · ลบยังไง | human | P2 | ก่อนเปิดฟอร์ม | D11 · Devil · PDPA |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L6 | Lab 04 Commit A: `/guestbook` 404 · error คงที่ · meta description · หน้า 404 · ลบลิงก์ (implement แล้ว · รอ JT commit) | 2026-09-25 |
| — | Lab 02 DEBATE → DECISIONS (D1–D8 · ชุดเดิม) | 2026-09-25 |
| — | Lab 02 debate แบบทีม → DECISIONS D1–D12 (แทนชุดเดิม) | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
