# QA — Personal Site

> Lab 06

## E2E Playwright

- **วันที่:** 2026-09-25 ~16:00 +07:00 · **โดย:** Claude Code (Playwright MCP, Chromium, viewport เริ่มต้น)
- **Target:** `http://localhost:4321` (`PORT=4321` จาก `.env`) — **dev server** (`astro dev`, มี `/@vite/client` + dev toolbar)
- **Demo data:** `Demo Visitor` · `demo@example.com` (ตาม skill `public-site-safe`)
- **src/ ไม่ถูกแก้ในรอบนี้**

| # | Step | Expected | Result |
|---|---|---|---|
| 1 | เปิด `/` | h1 = PROFILE `## Name`, headline = PROFILE `## Headline` | ✅ h1 `Your Name` · headline `Builder · learner · multi-agent course` ตรง PROFILE · title `Your Name · Home` |
| 2 | คลิก nav **About** | 200, ไม่ 404 | ✅ `/about` 200 · h1 `About` · title `About · Your Name` |
| 3 | ไป **Interests** | 200 + รายการ interests จาก PROFILE (3 รายการ) | ⚠️ 200 ไม่ 404 · แต่แสดง **1/3** (`AI agents` เท่านั้น) — ดู F1 |
| 4 | ไป **Contact** / **Guestbook** | 200 | ✅ ทั้งคู่ 200 (fetch `redirect:manual` ไม่มี redirect) |
| 5 | Control: path ไม่มีจริง `/nope-404-check` | 404 | ✅ 404 (ยืนยันว่าเช็ค 404 ใช้ได้จริง) |
| 6 | Contact — กด Send ฟอร์มว่าง | ถูกบล็อกฝั่ง browser | ✅ native validation: `name`, `email`, `message` เป็น `:invalid` · ไม่มี request |
| 7 | Contact — ส่ง demo data | success | ✅ status `Sent. Thank you!` · ฟอร์มถูกล้าง |
| 8 | `POST /api/contact` email ผิดรูปแบบ | error สั้น ปลอดภัย | ✅ 400 `{"error":"VALIDATION: email format is invalid"}` — ไม่มี stack/SQL |
| 9 | Guestbook — Sign ด้วย demo data | success + แสดงในรายการ | ✅ `Demo Visitor: ทักทายจาก E2E demo 👋` ขึ้นบนสุด (`2026-09-25 09:00:35`) |
| 10 | Console | 0 error | ⚠️ 1 CSP error/หน้า: inline script ถูกบล็อก (`script-src 'self'`) ที่บรรทัดเดียวกับ `/@vite/client` → มาจาก dev server · prod build ยืนยันแล้วว่า inline 0 / console 0 (H2) — **dev-only, ไม่ใช่ bug prod** · +1 error `400` ที่คาดไว้จากขั้น 8 |
| 11 | Screenshots | ≥ 2 หน้า | ✅ 5 ไฟล์ด้านล่าง |

### Screenshots (`docs/screenshots/`)

- [`e2e-home.png`](./screenshots/e2e-home.png)
- [`e2e-about.png`](./screenshots/e2e-about.png)
- [`e2e-interests.png`](./screenshots/e2e-interests.png) — เห็น F1
- [`e2e-contact-sent.png`](./screenshots/e2e-contact-sent.png)
- [`e2e-guestbook-signed.png`](./screenshots/e2e-guestbook-signed.png)

### Findings (ยังไม่แก้ — รอสั่งหลัง a11y)

| ID | Sev | Finding | ที่มา / แนวทาง |
|---|---|---|---|
| F1 | P1 | PROFILE parser เก็บได้แค่**บรรทัดแรก**ของทุก section → Interests แสดง 1/3, Bio หลายบรรทัดจะถูกตัด | `src/lib/profile.ts:42` — regex ใช้ flag `m` ทำให้ `$` ใน lookahead `(?=^##\s\|$)` จบที่ท้ายบรรทัดแรก · แก้: เปลี่ยนเป็น `(?=^##\s\|(?![\s\S]))` หรือ `\Z`-equivalent + เพิ่ม test หลาย interest · owner: Claude `frontend` (lib ใช้ร่วมกับ UI) |
| F2 | P1 | ข้อความคอร์สหลุดขึ้นหน้าเว็บ: Home bio `Replace this after Lab 01 interview.` + headline `multi-agent course` | มาจาก `docs/PROFILE.md` ที่ยังเป็น placeholder (Lab 01 ยังไม่ได้กรอกจริง) — ขัด `public-site-safe` · แก้ที่ content ไม่ใช่ src |
| F3 | P2 | Guestbook มี entry `Swarm Demo: ส่งจาก localhost demo — Lab 05b` + `JT: Test 1` / `AC: Test 2` แสดงสาธารณะ | ข้อมูลทดสอบใน SQLite local — ล้างก่อน ship (owner: OpenCode `backend`) · entry E2E รอบนี้ก็ควรล้างด้วย |
| F4 | P3 | หน้า Contact/Guestbook โชว์ `POST /api/contact` / `/api/guestbook` ให้ผู้ชม และ title ไม่มีชื่อเจ้าของ (`Contact` vs `About · Your Name`) | ความสม่ำเสมอ/ความเป็นมืออาชีพ — พิจารณาใน a11y/UI pass |


## a11y Debate

> Input: ผล E2E ด้านบน + หน้า `/contact` (ตรวจด้วย Playwright MCP 2026-09-25 ~16:05) · contrast คำนวณตามสูตร WCAG 2.x จากค่าใน `src/layouts/BaseLayout.astro` (card = `color-mix(#141a2f 92%, white)` ≈ `#272c40`)  
> หลักฐาน focus: [`a11y-contact-focus.png`](./screenshots/a11y-contact-focus.png) (โฟกัสที่ Name)

**ข้อเท็จจริงที่วัดได้ (ทั้งสองฝ่ายยอมรับ)**

| หัวข้อ | วัดได้ | WCAG |
|---|---|---|
| Contrast ข้อความ | text/card 12.35 · muted/card 6.63 · accent/card 5.30 · ปุ่ม `#081018`/accent 7.34 · input text 16.21 | ✅ 1.4.3 AA ทุกคู่ |
| Contrast ขอบ input (non-text) | border `#243056` vs input bg 1.41 · input bg vs card 1.31 | ❌ 1.4.11 ต้อง ≥ 3:1 |
| Focus | Tab order: nav ×5 → name → email → message → Send (honeypot ถูกข้ามถูกต้อง) · ทุกตัว `:focus-visible` แต่ใช้ default `outline: auto` ~1px | ⚠️ 2.4.7 ผ่าน (มองเห็น) แต่บาง บนพื้นมืด |
| Labels | `name`/`email`/`message` มี `<label for>` ครบ · มี `role="status" aria-live="polite"` | ✅ 1.3.1 / 4.1.2 / 4.1.3 |
| Honeypot | input `aria-hidden` + `tabindex=-1` ✓ แต่ `<label>Website</label>` ยังอยู่ใน a11y tree (snapshot เห็น "Website") | ⚠️ screen reader อ่านป้ายลอย |
| Required / error | ไม่มีสัญลักษณ์ required ที่มองเห็น · ไม่มี `aria-invalid` / `aria-describedby` · error server แสดงดิบ `Error: VALIDATION: email format is invalid` | ⚠️ 3.3.1 / 3.3.2 |
| Autocomplete | ไม่มี `autocomplete="name"` / `"email"` | ⚠️ 1.3.5 |
| Headings | Contact: `h1` เดียว · Home: `h1` → `h2` ×4 | ✅ ลำดับถูก |
| Landmarks / skip | มี `nav[aria-label]` + `main` · ไม่มี skip link | ⚠️ 2.4.1 (nav แค่ 5 ลิงก์) |
| ภาษา | `<html lang="th">` แต่ label/ปุ่ม/หัวข้อเป็นอังกฤษ | ⚠️ 3.1.1 |
| Title | `Contact` (ไม่มีชื่อเจ้าของ ต่างจากหน้าอื่น) | ⚠️ 2.4.2 (ผ่านแต่ไม่สม่ำเสมอ — F4) |

### Advocate

1. **ขอบ input 1.41:1 คือ fail ชัดที่สุด** — ผู้ใช้สายตาเลือนรางหรือจอแดดส่องจะ "ไม่เห็นว่ามีช่องให้กรอก" — screenshot ยืนยันว่า Email/Message แทบกลืนกับ card นี่คือฟอร์มเดียวที่คนติดต่อเจ้าของได้ ต้องแก้ก่อน ship
2. **Focus ring default บางเกินไป** — `outline: auto` ~1px บนพื้น navy ยังเห็นได้ แต่ไม่ถึงระดับที่ WCAG 2.2 (2.4.13 Focus Appearance) แนะนำ ควรมี `:focus-visible` ของเราเอง ≥ 2px สี accent (5.30:1 บน card)
3. **Error ต้องบอกว่าผิดช่องไหน** — ตอนนี้ status อ่านว่า "Error: VALIDATION: email format is invalid" — มี prefix ภายใน (`VALIDATION:`) และไม่ผูกกับช่อง email; ควรตั้ง `aria-invalid="true"` + `aria-describedby` ไปที่ข้อความ error ของช่องนั้น
4. **ป้าย honeypot ลอยอยู่ใน a11y tree** — screen reader จะเจอ "Website" ไม่มีช่องกรอก งง; ครอบทั้ง label+input ด้วย container `aria-hidden="true"`
5. **`lang="th"` แต่เนื้อหาหลักอังกฤษ** — screen reader ภาษาไทยจะอ่าน "Name/Email/Send" ด้วยเสียงไทยเพี้ยน · เพิ่ม `autocomplete` ให้กรอกอัตโนมัติได้ (ช่วยผู้พิการด้านการเคลื่อนไหว)
6. เห็นด้วยว่าเรื่องที่ **ผ่านแล้ว** ไม่ต้องแตะ: contrast ข้อความทั้งหมด, labels, live region, heading order, tab order

### Pragmatist

1. **เห็นด้วย: ขอบ input + focus ring = ก่อน ship** — เป็น CSS 3–4 บรรทัดใน `BaseLayout.astro` ไฟล์เดียว กระทบทุกฟอร์ม (contact + guestbook) พร้อมกัน, ความเสี่ยง regression ต่ำ, ทำ < 10 นาที
2. **Honeypot label = ก่อน ship** — แก้ markup 2 บรรทัดต่อหน้า × 2 หน้า ไม่แตะ logic D-05 (`name="website"` เหมือนเดิม server ไม่ต้องแก้)
3. **`autocomplete` = ก่อน ship** — attribute เดียวต่อช่อง ไม่มีทางพัง
4. **Per-field error + `aria-invalid` = หลัง ship (P1 ถัดไป)** — native validation บล็อก input ว่าง/email ผิดรูปไว้แล้วตั้งแต่ฝั่ง browser (E2E ขั้น 6) ดังนั้นเส้นทางที่ user จริงจะเจอ error server มีน้อย · แต่ **ตัด prefix `VALIDATION:` ออกจากข้อความที่แสดง** ทำได้ใน 1 บรรทัดฝั่ง client — ทำก่อน ship ได้ · การแก้ข้อความที่ API ส่งมาเป็นงาน OpenCode `backend` อย่าแย่งงาน
5. **`lang` = หลัง ship** — ต้องตัดสินก่อนว่าเว็บเป็นภาษาอะไร (content เป็นเรื่องของ PROFILE/F2 ที่ยังไม่กรอก) — ไม่ควรเดาตอนนี้ · ควรเป็น D-id ใน `DECISIONS.md`
6. **Skip link / nav current state = หลัง ship (P2)** — nav มี 5 ลิงก์ ต้นทุนผู้ใช้คีย์บอร์ดต่ำ; current page มี `aria-current` แล้ว (เชิงความหมายครบ) เหลือแค่ visual (สีต่างกัน 1.86:1) เติมขีดเส้นใต้ทีหลังได้
7. **ไม่ขยาย scope** — ไม่ refactor ฟอร์มเป็น component ในรอบนี้ แม้ contact/guestbook ซ้ำกัน

**ข้อสรุปร่วม:** แก้ CSS ระดับ layout + markup เล็ก ๆ ก่อน ship (ครบภายใน 30 นาที) · งานที่ต้องตัดสินใจ (ภาษา) หรือข้าม ownership (ข้อความ API) → หลัง ship / ส่งต่อ

## a11y Action items

| ID | Pri | Action | ไฟล์ (owner) | ประมาณ | Ship |
|---|---|---|---|---|---|
| A1 | **P0** | ขอบ input/textarea ≥ 3:1 — ใช้ `--field-border: #6b7aa6` (4.28:1 vs input bg · 3.26:1 vs card) | `src/layouts/BaseLayout.astro` (Claude `frontend`) | 5 นาที | ก่อน |
| A2 | **P0** | `:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px }` (accent 5.30:1 vs card · 7.26:1 vs bg) | `src/layouts/BaseLayout.astro` (Claude `frontend`) | 5 นาที | ก่อน |
| A3 | **P1** | ครอบ honeypot label+input ด้วย `<div class="hp-field" aria-hidden="true">` ให้หายจาก a11y tree (คง `name="website"`, `tabindex="-1"`) | `contact.astro`, `guestbook.astro` (Claude `frontend`) | 5 นาที | ก่อน |
| A4 | **P1** | `autocomplete="name"` / `autocomplete="email"` บนช่อง contact (+ name ใน guestbook) | `contact.astro`, `guestbook.astro` (Claude `frontend`) | 3 นาที | ก่อน |
| A5 | **P1** | ตัด prefix `VALIDATION:` ก่อนแสดงใน status (client) · ขอ OpenCode ส่งข้อความ user-facing ตรง ๆ ทีหลัง | `contact.astro` / `guestbook.astro` (Claude) · API (OpenCode `backend`) | 5 นาที | ก่อน (client) |
| A6 | P1 | Per-field error: `aria-invalid` + `aria-describedby` + แสดงว่าช่องไหน required (เช่น "(จำเป็น)") | `contact.astro`, `guestbook.astro` | 20 นาที | หลัง |
| A7 | P2 | ตัดสิน `lang` ของเว็บ (th/en) → บันทึก D-id ใน `DECISIONS.md` แล้วแก้ `<html lang>` / `lang` ระดับ element | `BaseLayout.astro` + `DECISIONS.md` (human ตัดสิน) | — | หลัง |
| A8 | P2 | Skip link ไป `#main` + ขีดเส้นใต้ nav `aria-current` | `BaseLayout.astro` | 10 นาที | หลัง |
| A9 | P2 | Title Contact/Guestbook ให้มีชื่อเจ้าของ (F4) | `contact.astro`, `guestbook.astro` | 2 นาที | หลัง |

**P0+P1 ที่ทำได้ใน 30 นาที:** A1 + A2 + A3 + A4 + A5 ≈ 23 นาที · ยังไม่ได้แก้ไฟล์ — รอยืนยัน diff (A1+A2) ก่อน
