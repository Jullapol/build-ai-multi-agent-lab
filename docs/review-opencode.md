# รีวิวอิสระ (OpenCode) — PR Lab 04 Frontend (#12)

- **วันที่:** 2026-09-25 (~16:40 +07:00) · **ผู้รีวิว:** OpenCode (agent `backend`) · **โหมด:** อ่านอย่างเดียว — ไม่แก้ `src/`
- **PR ที่รีวิว:** [#12](https://github.com/Jullapol/build-ai-multi-agent-lab/pull/12) `lab-04-frontend` → `main` (**ยังเปิดอยู่** · head = commit `e7db779` จาก merge-base `cc0d19b`)
- **รอบก่อน:** รีวิว PR #13 (Lab 05 backend) ไปแล้วที่ [`review-opencode-lab05.md`](./review-opencode-lab05.md)

## อินพุตที่ใช้

| ไฟล์ | สถานะ |
|---|---|
| `docs/_pr-diff.txt` | ✅ มีแล้ว (300KB · สร้าง 16:22) — ตรวจสอบแล้วว่า **ตรงกับ PR #12 ทุกไฟล์** (33 ไฟล์ · ชุดเดียวกับ `git diff cc0d19b..lab-04-frontend --name-only`) แต่**ขนาดไม่ตรงกับ git** (171,889 vs 178,674 chars — น่าจะตัด binary/.docx ตอนสร้าง) · สรุป: ใช้ได้ แต่แนะนำให้ regenerate ด้วย `git diff cc0d19b..lab-04-frontend > docs/_pr-diff.txt` เพื่อความชัวร์ |
| `docs/DECISIONS.md` | ⚠️ **คนละชุดกับ main!** — บน branch คือ "Decisions — Personal Site" (D1–D12 · มาจาก debate Lab 02 5 รอบ) แต่บน main คือ D-01–D-05 (better-sqlite3, validation, rate limit, CSP, honeypot) — **ID ชนกัน (D1≠D-01 ฯลฯ)** และ branch **แทนที่ไฟล์ทิ้ง** ทั้งที่ main มี D-03/D-04/D-05 เพิ่มหลัง branch แยกออกไป |
| `docs/STATUS.md` · `docs/OPEN_LOOPS.md` | ✅ อ่านแล้ว (Hot state ณ 16:05 — Lab 05 merged, Lab 06 QA กำลังทำ) |
| `docs/QA.md` | ✅ E2E + a11y (F1–F4 · A1–A9) |

---

## สรุป

PR #12 คืองาน UI ของ Lab 04 จาก Claude (`frontend`): หน้าใหม่ (Hero/About/404) · โทนครีม · เมนู 2 อัน · redirect 302 · ลบหน้า contact/guestbook · e2e ใหม่ 68 บรรทัด. โค้ดฝั่ง frontend **คุณภาพสูงจริง** — XSS ปิดด้วยการลบหน้า, meta leak แก้, regex F1 แก้ถูกจุด, e2e เขียนเกินมาตรฐานคอร์ส. **แต่ merge ตอนนี้ไม่ได้** เพราะ 2 ปัญหาใหญ่:

1. **Branch แก่กว่า main มาก** — ยังไม่มี `src/lib/db.ts` (Lab 05) · `rate-limit.ts` (D-03) · `middleware.ts` (D-04) · API จริง (contact/guestbook ยังเป็น 501 stub) — รวมแล้ว main มี ~12 commits ที่ branch ไม่เห็น ทั้งที่ **PR นี้ลบหน้าที่ main ผูกกับ API เหล่านั้นไป**
2. **`docs/DECISIONS.md` ชนกัน** — branch มี D1–D12 (debate), main มี D-01–D-05 (backend hardening) — ถ้า merge ตรง ๆ ไฟล์จะถูกแทนที่ทิ้ง (backup ของฝั่ง branch ก็เป็น D1–D8 ชุดเก่ากว่า main อีก)

ทั้งหมด**แก้ได้ด้วย rebase บน main** — ไม่ใช่โค้ดพัง แต่เป็นเรื่อง git/state ที่ต้องรีบตัดสินใจ

## จุดแข็ง

1. **แก้ XSS ถูกชั้น** — ลบ `guestbook.astro` ทิ้ง (จุดที่มี `innerHTML` + error ดิบ) ได้ผลถาวรกว่า patch ทีหลัง
2. **regex F1 แก้ถูกจุดแล้ว** — `profile.ts:45` เปลี่ยน lookahead เป็น `(?=^##\s|(?![\s\S]))` — ตรงตามที่ QA.md F1 วินิจฉัย (แก้ได้ทุก section ไม่ใช่แค่ Interests) — **แต่ไม่มี unit test ครอบ** (ดู C3)
3. **meta description ค่าเริ่มต้นกลาง** — `BaseLayout` ดึงจาก profile แทน "…multi-agent course" — ปิด F2 เชิง meta (แต่ PROFILE ตัวจริงก็ยังเป็น placeholder อยู่)
4. **E2E เขียนเกินมาตรฐานคอร์ส** — `site.spec.ts` มี runtime guard ที่ static test จับไม่ได้ (หา course leak ใน rendered HTML จริง) · วัด above-the-fold ด้วย `boundingBox` ที่ 360×640 ไม่ใช่ตาเปล่า
5. **สัญญา parser คงเดิม** — เพิ่ม `tagline` โดยไม่แตะ `interests: string[]` (ที่ `/api/interests` ใช้ร่วม) · `about.astro` แยกหัว/คำอธิบายใน UI ไม่ใช่ parser
6. **redirect ปลอดภัย** — 302 (ไม่ 301) ไป `/about#interests` · nav ใหม่ไม่มีลิงก์ตาย

## ความเสี่ยง

### 🔴 Critical — ขัด merge กับ main

| # | เรื่อง | รายละเอียด |
|---|---|---|
| X1 | **DECISIONS.md ชนกันแน่** | Branch มี D1–D12 (debate) · main มี D-01–D-05 (hardening) — merge ตรง ๆ แทนที่ทิ้งทั้งไฟล์ · **ID ชนกันเชิงความหมาย** ถ้ายังอ้างข้ามเอกสาร |
| X2 | **แก้ทับงาน hardening ของ main** | Branch ยังเห็น contact.astro/guestbook.astro เวอร์ชัน 501 stub — ไม่รู้จัก honeypot `website` (D-05) ฯลฯ · ถ้า merge ตรง หน้าเหล่านี้หายไป + ต้อง re-verify ว่า `middleware.ts` ยังครอบ endpoint ที่เหลือ |
| X3 | **Prerender flag หายจาก guestbook/contact** | `guestbook.astro` (main) มี `export const prerender = false` (POST ต้อง server) — branch ลบทิ้ง ทำให้ **API ยังลอยอยู่** แต่ UI คุมไม่ได้ · ถ้า merge แล้วยังไม่ปิด API จะเสี่ยง post ปลอม ๆ ได้ (ยังมี rate limit + honeypot คุมอยู่บน main) |

### Security

| # | เรื่อง | รายละเอียด |
|---|---|---|
| S1 | **`opencode.json` มี env var ใน config** | `"Authorization": "Bearer {env:GITHUB_PERSONAL_ACCESS_TOKEN}"` — **ไม่ใช่ leak** (env interpolation ปลอดภัย) แต่ L4 (PAT หลุดเข้าแชท) ยัง **P0 ค้างอยู่** — ต้อง revoke ก่อน merge นี้ ไม่งั้น config ชี้ไปที่ token ที่ถูกเปิดเผยแล้ว |
| S2 | `.docx` binary ใน git | `AI_Developer_Training_Guide.docx` (~?) — ไฟล์คอร์สที่ไม่เกี่ยวกับเว็บ · ควรออกจาก repo (นอก DECISIONS ทั้งหมด) |
| S3 | `.backup` files | `DEBATE.md.backup` / `DECISIONS.md.backup` / `PROFILE.md.backup` — snapshot ที่ไม่ถูกอ้างถึงใน canonical flow ใด ๆ · ควรออกจาก repo หรือย้ายไป outside git |

### Correctness

| # | เรื่อง | รายละเอียด |
|---|---|---|
| C1 | **ไม่มี unit test สำหรับ regex fix** | F1 แก้แล้วแต่ `tests/smoke.test.ts` ยังเช็คแค่ `name/headline/interests` — ไม่มี test ที่ยิง PROFILE หลายบรรทัด (ตามที่ QA F1 แนะนำ "เพิ่ม test หลาย interest") |
| C2 | **`data-testid` ปนใน production markup** | `index.astro` มี `data-testid` 3 จุด — ใช้ได้ ไม่ leak แต่ควรรู้ว่ามันคือ public markup |
| C3 | **ตรวจ F1 แล้วยังไม่ได้เก็บเข้า canonical state** | การแก้ regex นี้ยังไม่อยู่ใน `STATUS.md` / `OPEN_LOOPS.md` (F1 ยังเปิดใน QA.md · owner ระบุว่า Claude) — ต้องอัปเดตหลัง merge |

### Tests

| # | เรื่อง | รายละเอียด |
|---|---|CI—|
| T1 | **Playwright tests ไม่ผ่านบนเว็บ main ปัจจุบัน** | `smoke.spec.ts` ใหม่ expect nav = 2 อัน + `/contact` 404 — บน main (มี 5 หน้า + nav 5 อัน) จะแดงทันที — **ต้อง merge พร้อมกัน** ไม่งั้น e2e แดงบน main หลัง merge |
| T2 | **Vitest บน main ผ่านปกติ** | `smoke.test.ts` / `public-site.test.ts` ไม่อ้าง nav หรือหน้าที่ branch ลบ — ผ่านได้ทั้งสองฝั่ง · ตัวนี้ OK |
| T3 | **`npm test` ผ่านบน branch** | `smoke.test.ts` + `public-site.test.ts` = 3 tests (handoff ระบุว่า 3 passed) — แต่**ไม่มี test ใหม่**สำหรับ F1 fix · ควรเพิ่ม (C1) |

---

## Must fix / Should / Nit

### 🔴 Must fix — ก่อน merge (บล็อกจริง)

| ID | งาน | เหตุผล |
|---|---|---|
| MF1 | **Rebase บน main ใหม่** (`git rebase main` จาก `lab-04-frontend`) — ทั้งหมดอ้างอิงจากหลัง PR #13/#14/#15 merged | X1/X2 — branch แก่กว่า 12 commits · มี conflict ที่ต้องตัดสินใจเอง (DECISIONS.md, contact/guestbook) ไม่ใช่ auto-resolve |
| MF2 | **แก้ DECISIONS.md หลัง rebase** — merge D1–D12 กับ D-01–D-05 เป็นไฟล์เดียว (เช่น เปลี่ยนชุด debate เป็น D-06…D-17 หรือแยกสองหมวด "Design (Lab 02)" / "Backend (Lab 05)" ชัดเจน) | X1 — ทั้งหมดเป็น approved decisions ทั้งคู่ ห้ามทิ้งฝั่งใดฝั่งหนึ่ง |
| MF3 | **ตัดสินใจเรื่องหน้า contact/guestbook ให้ชัดก่อน merge** — ถ้าจะลบ ต้อง: (a) ตัด API endpoint ด้วย (ตาม D11 ของ branch ที่แนะนำ 501/404 กลาง) **หรือ** (b) เก็บ API + ประกาศว่า UI ปิด (rate limit + honeypot บน main คุมอยู่) · อย่าปล่อยลอย | X2/X3 — ถ้าลบ UI แต่เก็บ API จะเสี่ยงเขียนข้อมูลลอย ๆ ไม่มีใครดูแล |

### 🟡 Should fix

| ID | งาน |
|---|---|
| SH1 | ลบ `AI_Developer_Training_Guide.docx` + `generate_ai_training_guide.py` + `*.backup` ออกจาก repo (S2/S3) — ไม่ใช่ส่วนเว็บ |
| SH2 | เพิ่ม unit test สำหรับ F1 fix: PROFILE จำลองที่มี `## Interests` 3 รายการ + `## Bio` หลายย่อหน้า → expect ได้ครบ (C1) |
| SH3 | ยืนยันว่า PR นี้ถูกหักเข้า Commit A/B ตาม D12 — ตอนนี้ทั้ง security + IA มา PR เดียว — ถ้า JT ยังไม่ตัดสิน D7/D8 ให้แยกเป็น 2 PR (หรือยอมรับว่า PR เดียวก็ได้ **แต่ต้องมี JT approve ทั้ง 2 ก้อน** ชัด ๆ) |
| SH4 | Revoke PAT (L4 · P0) ก่อน merge — config ชี้ env `GITHUB_PERSONAL_ACCESS_TOKEN` ที่ค่าเดิมรั่วแล้ว (S1) |
| SH5 | Regenerate `docs/_pr-d size.txt` จาก git หลัง rebase (รายละเอียดใน input table ด้านบน) |

### ⚪ Nit

| ID | งาน |
|---|---|
| N1 | `data-testid` 3 จุดบน hero (C2) — ใช้ได้ แต่ควรเก็บไว้เป็น pattern ที่รู้กันว่ามี |
| N2 | `site.spec.ts` ตรวจ `example.com` leak — ดีแล้ว แต่ PROFILE ตัวจรig ยังมี `## Contact` เป็น dummy อยู่ — ควรอัปเดต PROFILE ด้วย (F2) |
| N3 | ชื่อไฟล์ typo ใน SH5 ของผม — ขออภัย ตั้งใจเขียน `_pr-diff.txt` |

## คำถามต่อ Claude

1. **Commit A/B ยังแยกได้ไหม?** — D12 บังคับให้แยก (Commit A = security merge ได้เลย · Commit B = IA รอ JT) — แต่ตอนนี้ทั้งหมดอยู่ commit เดียว `e7db779` — Claude สะดวก split เป็น 2 branch ไหม หรือให้ JT ตัดสิน D7/D8 ทั้งคู่แล้ว merge ทีเดียว?
2. **DECISIONS.md — ชุดไหน canonical?** — บน branch มี D1–D12 (debate) · บน main มี D-01–D-05 (backend) — ผมเสนอ merge เป็นไฟล์เดียวหลัง rebase โดยเปลี่ยนชุด debate เป็น D-06+ — Claude เห็นด้วยไหม เพราะ Claude ถือ ownership `docs/` ฝั่ง debate
3. **F1 fix บน branch นี้** — regex แก้แล้ว (ตรงตาม QA F1) แต่ handoff เขียนว่า "มีการแก้ regex เดิม (ก่อนรอบนี้ · ไม่ใช่ของ frontend) ค้างอยู่ใน working tree ด้วย" — ตกลงใครเป็นคนแก้ + จะเพิ่ม unit test ตามที่ QA แนะนำไหม?
4. **`/api/guestbook` + `/api/contact` หลัง merge** — ตาม D11 ของ branch แนะนำ 501 กลาง · แต่ main ตอนนี้ endpoint ทำงานจริง (Lab 05 merged) + rate limit + honeypot คุมอยู่ — ให้เปิด API ไว้ (คุมด้วย hardening ของ main) หรือปิดตาม D11?
5. **D6 (ลบ guestbook) vs STATUS ฝั่งผม (Lab 05b swarm ทดสอบ guestbook บน localhost)** — ถ้า merge แล้ว E2E ของ Lab 06 จะทดสอบอะไรต่อ ในเมื่อหน้า/API หายไป — จำเป็นต้อง re-plan Lab 06 QA ไหม?

## Canonical state updated

> รอบนี้เป็น **รีวิวอ่านอย่างเดียว** — ไม่มีการแก้ canonical state (ข้อเสนอ MF1–MF3 / SH1–SH5 รอผู้ใช้/Claude ตัดสินก่อน)

- [ ] docs/STATUS.md
- [ ] docs/OPEN_LOOPS.md
- [ ] docs/DECISIONS.md (ถ้ามี decision ใหม่)
