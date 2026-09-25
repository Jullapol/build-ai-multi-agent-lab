# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 15:40 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | human | P0 | Lab 00 | เสร็จแล้ว — ลบเมื่อเก็บกวาด |
| L4 | ตรวจว่า `.env` ไม่ถูก commit + revoke token ที่หลุดเข้าแชท | human | P0 | ทันที | พบ PAT ใน `.env` ระหว่าง session — ควร rotate |
| L5 | แก้ stored XSS ใน `src/pages/guestbook.astro` (render ด้วย innerHTML ไม่ escape) + แสดง error เมื่อ POST พัง | Claude (frontend) | P0 | ก่อน ship | พบจาก subagent review รอบ Lab 05b — รายละเอียดใน `docs/SWARM.md` §Gaps |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L2 | PR backend Lab 05 — [#13](https://github.com/Jullapol/build-ai-multi-agent-lab/pull/13) (commit `c380385`, branch `lab-05-backend`) | 2026-09-25 |
| L3 | `docs/DECISIONS.md` — D-01 (better-sqlite3) · D-02 (validation rules) Approved | 2026-09-25 |
| Lab 05 | implement insertContact/guestbook SQLite ให้ test:labs green | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
