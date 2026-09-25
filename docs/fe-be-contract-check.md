# FE–BE Contract Check — Contact / Guestbook

> ตรวจโดย OpenCode (backend) · 2026-09-25 · **ไม่แก้ไฟล์ใดใน `src/`**
> ขอบเขต: `docs/DECISIONS.md` (D6, D9, D11) · หน้าใน `src/pages/` · API stubs `src/pages/api/*.ts` · `src/lib/db.ts`

## สรุปสั้น

**ไม่มีฟอร์ม Contact/Guestbook หลงเหลืออยู่ใน `src/pages/` เลย** — ตาม D6/D9 (Commit A) หน้า `/contact` และ `/guestbook` ถูกลบไปแล้ว และไม่มี `<script>` / `fetch` / `FormData` / `action=` ในไฟล์ `.astro` ใด ๆ (ตรวจด้วย grep ครบทั้ง `src/`) จึงไม่มี "ฝั่ง FE" ที่ยิง API อยู่จริงในวันนี้

สัญญาที่เหลืออยู่จึงเป็นสัญญา **ล่วงหน้า** ที่ stub ฝั่ง API กำหนดไว้เพื่อ FE รุ่นถัดไป (เมื่อ JT ตอบ OPEN_LOOPS และ backend ทำ D11) การเช็กนี้จึงตรวจ 2 ชั้น: (1) stub ตรงกับที่ DECISIONS สัญญาไว้หรือไม่ (2) stub พร้อมรับ FE ใหม่เมื่อเปิดฟอร์มหรือไม่

## สัญญาที่ API stub กำหนด (ฝั่งเดียว)

| Endpoint | Method | รับ | ส่งกลับ (happy) | ส่งกลับ (error) |
|---|---|---|---|---|
| `/api/contact` | POST | JSON `{name, email, message}` | 201 + row (`ContactMessage` มี `id, name, email, message, created_at`) | 501 ถ้า `NOT_IMPLEMENTED…` · 400 กรณีอื่น · body `{error: message}` |
| `/api/guestbook` | GET | — | 200 + `{entries: GuestbookEntry[]}` (`id, name, message, created_at`) | 501 ถ้า `NOT_IMPLEMENTED…` · 500 กรณีอื่น · body `{error: message}` |
| `/api/guestbook` | POST | JSON `{name, message}` | 201 + row | เหมือน POST contact |
| `/api/interests` | GET | — | 200 + `{interests: string[], source: 'profile'}` | ไม่มี try/catch (500 จาก Astro ถ้า loadProfile พัง) |

## ✅ Match

| # | เรื่อง | หลักฐาน |
|---|---|---|
| M1 | **FE ปิด POST แล้วจริง** — ไม่มีหน้า/สคริปต์ใดยิง `/api/contact` หรือ `/api/guestbook` ตรงตาม D11 "ระหว่างที่ UI ปิด POST ต้องไม่บันทึกลง SQLite" (stub ทุกตัว throw ก่อนแตะ DB อยู่แล้ว) | grep `fetch|FormData|action=` ใน `src/**` → 0 ผลลัพธ์ใน `.astro` |
| M2 | **`/contact` และ `/guestbook` ไม่มีใน `src/pages/`** ตรงตาม D6 + D7 (404 โดย default ของ Astro) | glob `src/pages/**` เจอแค่ `index/about/interests/404.astro` |
| M3 | **รูปทรง 501 ตรงข้อตกลง D11/AGENTS.md** — `NOT_IMPLEMENTED…` → 501, POST error อื่น → 400, GET → 500 ทุก route มี `try/catch` และ `prerender = false` | `api/contact.ts:20`, `api/guestbook.ts:15,33` |
| M4 | **Type ข้อมูลตรง schema ใน db.ts** — ตาราง `contact_messages`/`guestbook` มีคอลัมน์ครบตาม `ContactMessage`/`GuestbookEntry` | `db.ts:32–44` |
| M5 | **UI ไม่แสดง `data.error` ดิบ** (D9) — เพราะไม่มีโค้ด FE ที่อ่าน response เลย | grep `error` ใน `.astro` → ไม่เจอ |

## ❌ Mismatch

| # | เรื่อง | รายละเอียด | อ้างอิง |
|---|---|---|---|
| X1 | **ข้อความ error 501 อ้างคอร์ส** — stub throw `NOT_IMPLEMENTED: insertContact — Lab 05 OpenCode` แล้ว API ส่งตรงนี้ออกไปใน body เป็น `{error: "…Lab 05 OpenCode"}` ขัด D11 ที่กำหนด "**ข้อความกลางที่ไม่อ้างคอร์ส**" และเสี่ยงละเมิด public-site-safe ทันทีที่ FE ใหม่แสดง `data.error` (แม้ D9 ห้าม แต่ API ไม่ควรเป็นแหล่งข้อความนี้เอง) | `db.ts:55,60,68` | D11 |
| X2 | **Error body echo `err.message` ดิบทุกกรณี** — 400/500 ส่งข้อความจาก exception ออกไปตรง ๆ เช่น ถ้า `request.json()` พัง body จะได้ `"Unexpected token … in JSON"` = ฟิงเกอร์พริ้นต์ฝั่ง server · ในกรณีอื่นอาจ leak รายละเอียด runtime — ขัดหลัก "error ที่ไม่ leak stack" ของ backend | `api/contact.ts:19–21`, `api/guestbook.ts:14–17,33–35` | public-site-safe |
| X3 | **Validation ยังไม่มีใน stub** — `insertContact(body)` รับ body ที่ parse ได้ทุกอย่างแล้ว throw ทันที (โดยไม่ดู shape) ตอน implement จริง (Lab 05) ถ้าลืมตรวจความยาว/type ฝั่ง server ตาม D11 จะได้ 500/201 ที่ผิดสัญญา — สัญญาที่ docstring สัญญาไว้คือ "validate JSON {name,email,message}" แต่โค้ด route ไม่ได้ตรวจเอง ต้องพึ่ง lib | `db.ts:50–56`, `api/contact.ts:8` | D11 |
| X4 | **Docstring ใน `db.ts` ค้างเก่า** — บอกว่า "Stubs return null" แต่โค้ดจริง **throw** อ่าน docstring แล้วเข้าใจผิดว่า route จะได้ 200/201 ตอน stub | `db.ts:3` vs `db.ts:55` | ความสอดคล้องเอกสาร |

## 💡 ข้อเสนอแนะ (เมื่อทำ Lab 05 · ยังไม่แก้ตอนนี้)

1. **แก้ข้อความ 501 ให้เป็นกลาง** ตาม D11 เช่น `NOT_IMPLEMENTED` อย่างเดียว (ห้ามมี "Lab" / "course" ใน message ที่ออก body) — คง logic `startsWith('NOT_IMPLEMENTED')` ได้เพราะ prefix ยังจำแนก 501 ได้ และ identifier นี้เป็นศัพท์เทคนิค ไม่อ้างคอร์ส
2. **อย่า echo `err.message` ใน 400/500** — ตอบ `{error: 'invalid request'}` (400) / `{error: 'internal error'}` (500) และคง 501 เป็นข้อความกลางเช่นกัน · log รายละเอียดจริงไว้ฝั่ง server เท่านั้น
3. **Validation อยู่ใน lib (`db.ts`) ไม่ใช่ route** ตาม AGENTS.md — throw จาก lib เพื่อได้ 400: ตรวจ type string, trim, ความยาว name/email/message (เช่น name ≤ 100, email ≤ 254 + รูปแบบคร่าว ๆ, message 1–2000) และเช็คความยาวฝั่ง **server เสมอ** ไม่พึ่ง `maxlength` ของฟอร์ม
4. **แก้ docstring `db.ts:3`** จาก "Stubs return null" เป็น "Stubs throw NOT_IMPLEMENTED" ให้ตรงพฤติกรรมจริง
5. **เมื่อเปิดฟอร์มใหม่ (ตาม Out of scope v1):** คุยสัญญากับ frontend ก่อนให้ตรง 4 สถานะ UI (ปกติ/กำลังส่ง/สำเร็จ/ล้มเหลว) + ข้อความแจ้ง PII · ฝั่ง guestbook ต้องมี escape + rate limit/honeypot + วิธีลบข้อความก่อนเปิด ตาม D6/D11 · response 201 ควรคง shape `{id, name, ..., created_at}` ที่ FE จะใช้ render และห้ามส่งฟิลด์ภายใน (เช่น raw SQL error) กลับไป
6. **ทางเลือกที่ปลอดภัยกว่าตอนนี้:** ถ้าจะชะลอ Lab 05 ต่อ ให้ `/api/contact` POST ตอบ `503` + `{error: 'unavailable'}` แบบกลาง ๆ แทนการรอเปิด เพราะ endpoint เปิดรับ POST ได้จากภายนอกแม้ UI ปิด (D11 ชี้เรื่องนี้ไว้แล้ว) — แจ้งเป็น open loop ให้ JT ตัดสิน

## ข้อจำกัดของการตรวจ

- ตรวจแบบ static (อ่านโค้ด + grep) ไม่ได้ยิง request จริงไปที่ dev server
- ไม่ได้ตรวจ `tests/labs/**` ว่า contract test คาดหวัง body รูปไหน — ควรเทียบ `tests/labs` กับตารางข้างบนก่อน implement Lab 05 เพื่อไม่ให้ข้อเสนอข้อ 1–2 ทำ test แตก