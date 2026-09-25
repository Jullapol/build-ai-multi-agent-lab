# รีวิวอิสระ (OpenCode) — PR Lab 05 Backend (#13)

- **วันที่:** 2026-09-25 (~16:20 +07:00) · **ผู้รีวิว:** OpenCode (agent `backend`) · **โหมด:** อ่านอย่างเดียว — ไม่แก้ `src/`
- **PR ที่รีวิว:** [#13](https://github.com/Jullapol/build-ai-multi-agent-lab/pull/13) `lab-05-backend` → `main` (**merged แล้ว 15:38** — รีวิวย้อนหลังเพื่อ catch-up) · Lab 04 (#12, `lab-04-frontend`) ยังเปิดอยู่ — **out of scope รอบนี้** (เลือก Lab 05 เพราะโฟกัส security/correctness ตรงงาน backend)

## อินพุตที่ใช้

| ไฟล์ | สถานะ |
|---|---|
| `docs/_pr-diff.txt` | ❌ **ไม่มีใน repo** — สร้าง diff เองจาก git: `git diff 161c271..6b7f6a6` (merge base ก่อน PR #13 → หลัง merge) + อ่านไฟล์ปัจจุบันบน main (รวมการเปลี่ยนแปลงจาก PR #14 rate-limit / #15 hardening ที่ทับซ้อนไฟล์เดียวกัน) |
| `docs/DECISIONS.md` | ✅ D-01 … D-05 ทั้งหมด Approved |
| `docs/STATUS.md` · `docs/OPEN_LOOPS.md` | ✅ อ่านแล้ว (Hot state ณ 16:05) |
| `docs/QA.md` | ✅ E2E + a11y debate (F1–F4, A1–A9) |

---

## สรุป

PR #13 คืองาน persistence ของ Lab 05: `insertContact` / `insertGuestbook` / `listGuestbook` ใน `src/lib/db.ts` (better-sqlite3, D-01) + validation ตาม D-02 + error contract `VALIDATION:` → 400 / อื่น ๆ → 500 generic. คุณภาพโดยรวม **ดีกว่ามาตรฐานคอร์ส**: prepared statements ทุกจุด (ไม่มี SQL injection), error ที่หลุดไป client ถูก whitelist, มี test ครอบถึงระดับ control-char sanitization. จุดเสี่ยงที่พบทั้งหมดเป็นระดับ **Should/Nit** — ไม่มี Must fix ที่บล็อกความถูกต้องหรือความปลอดภัย. ข้อสังเกตเชิงกระบวนการ 1 ข้อ: fix XSS ฝั่ง frontend (`guestbook.astro`, ของ Claude) โผล่ใน PR backend ของผม — มีเอกสารรองรับ (`review-fe-xss-fix.md`, L5) แต่ควรยืนยันกับ Claude ว่ายอมรับการ ride-along นี้.

## จุดแข็ง

1. **SQL injection ปิดสนิท** — ทุก query เป็น prepared statement (`db.ts:59-63, 66-70, 92-97, 100-104, 77-81`) ไม่มี string concat ต่อ SQL เลย
2. **Error contract ชัดและปลอดภัย** — `VALIDATION:` prefix เป็น whitelist เดียวที่หลุดออก client (D-02) · catch ทุก endpoint ครอบ `err instanceof Error` แล้ว fallback `'internal error'` — stack/path/SQL ไม่มีทางหลุด (ยืนยันใน QA.md ขั้น 8: 400 `VALIDATION: email format is invalid` ไม่มี stack)
3. **Sanitize ตาม D-04 ถูกต้องจริง** — regex strip (`db.ts:120`) เว้น `\t`/`\n` ถูกต้องตาม range; email **reject** (ไม่ strip) เมื่อมี control char (`db.ts:133`) — ตัดสินใจถูกฝั่งเพราะ email มี control char = garbage
4. **XSS fix ใน `guestbook.astro` ทำถูก** — `escapeHtml` ครอบครัว `& < > " '` ครบและ escape `&` ก่อน; error path ใช้ `textContent` (ไม่ตีความ HTML) และไม่ reset ฟอร์ม (UX ดี)
5. **Tests วัดสิ่งที่อันตรายจริง** — `hardening.test.ts` ยิง `\u0000`/`\u0007`/`\u001B` เข้า text + email ตรง ๆ · `rate-limit.test.ts` inject `now` ได้ (deterministic) · lab test ครอบ roundtrip
6. **เอกสารตามงาน** — ทุก hardening มี D-id อ้างถึงได้ ทั้งในโค้ด (comment หัวไฟล์อ้าง D-03/D-04) และ `DECISIONS.md`

## ความเสี่ยง

### Security

| # | เรื่อง | รายละเอียด |
|---|---|---|
| S1 | **Rate limit ปลอม header ข้ามได้** | `clientIp()` (`rate-limit.ts:47-54`) เชื่อ `x-forwarded-for` **ตัวแรก** ซึ่งตอนรันตรง (node adapter ไม่มี proxy) คือค่าที่ attacker ใส่เองได้ฟรี — ยิงต่อเนื่องโดยสุ่ม XFF ทุก request → bypass ทั้ง contact และ guestbook. D-03 ระบุ design นี้ไว้แล้ว (approved) แต่**ไม่ได้พูดเรื่อง spoofing** — ถ้า deploy หลัง reverse proxy ที่ append XFF จะปลอดภัย, ถ้า expose ตรงจะไม่มีกันได้เลย |
| S2 | `MAX_BUCKETS` evict ตามลำดับ insert | (`rate-limit.ts:27-31`) ผู้ไม่หวังดียิง 10k IP ปลอม → bucket ของ IP จริงถูกเหวี่ยงออก → reset quota. ยอมรับได้ในบริบทเว็บส่วนตัว แต่ควรรู้ว่ามีอยู่ |
| S3 | Honeypot เช็คเฉพาะ `typeof === 'string'` | (`contact.ts:33`, `guestbook.ts:47`) bot ที่ยัด `website: 123` (non-string, non-empty) ไม่โดน honeypot — แต่ก็ยังโดน rate limit + validation อยู่ เสี่ยงต่ำ |

### Correctness

| # | เรื่อง | รายละเอียด |
|---|---|---|
| C1 | **JSON ที่ parse ไม่ได้ → 500 แต่ควร 400** | `request.json()` throw `SyntaxError` (`contact.ts:31`, `guestbook.ts:45`) → message ไม่ขึ้นต้น `VALIDATION:` → ตอบ **500** ทั้งที่เป็นความผิดของ client + เสีย quota rate limit ฟรี 1 ครั้ง |
| C2 | `listGuestbook()` ไม่มี LIMIT | (`db.ts:75-82`) โต unbounded — ช้าลงตามเวลา อ่านทุกแถวทุก request (GET ไม่มี rate limit ด้วย) |
| C3 | GET guestbook มี catch เช็ค `VALIDATION:` | (`guestbook.ts:14-24`) ทางนี้ throw ไม่ได้ — dead code เท่านั้น ไม่พังอะไร |

### Tests / scope

| # | เรื่อง | รายละเอียด |
|---|---|---|
| T1 | Test พึ่งลำดับ import กับ `DATA_DIR` | `lab05-api.test.ts:13-18` comment เองยอมรับ "module may cache" — ถ้าวันหนึ่งมี test อื่น import `db.ts` ก่อนตั้ง env จะเขียนลง `cwd/data` จริง (ปนกับ DB โปรดักชันของ dev) |
| T2 | Scope creep เชิงกระบวนการ | PR backend (#13) มี commit `fc371ba` แก้ **`guestbook.astro`** (ไฟล์ ownership ของ Claude) — มีเอกสาร/loop ปิดรองรับ (L5) แต่ขัดจิตวิญญาณ single-writer ถ้า Claude ไม่รับทราบ |
| T3 | ผ่าน DECISIONS ทุกข้อ (ไม่มี scope creep เชิง design) | better-sqlite3 (D-01) · validation 1-100/254/2000/1000 (D-02) · rate limit 3/5 ต่อ 10 นาที (D-03) · strip control char (D-04) · honeypot silent 201 (D-05) — ตรงตัว ไม่มีการสร้างกลไกใหม่นอก DECISIONS |

---

## Must fix / Should / Nit

### 🔴 Must fix — ไม่มี

ไม่มีรายการที่บล็อก correctness หรือเปิดช่อง injection/leak (tests green 9/9 + labs 2/2 บน main ปัจจุบัน)

### 🟡 Should fix

| ID | ไฟล์ | งาน | เหตุผล |
|---|---|---|---|
| SH1 | `contact.ts:31` · `guestbook.ts:45` | จับ `SyntaxError` จาก `request.json()` → ตอบ **400** (`VALIDATION:`-style หรือ `"invalid JSON body"`) | 500 หลอก monitoring + ผู้ใช้ debug ยาก |
| SH2 | `rate-limit.ts:47-54` | เพิ่ม note/decision เรื่อง **proxy trust** (เช่น ตั้ง `TRUST_PROXY=1` แล้วอ่าน hop สุดท้าย หรือยอมรับว่า expose ตรง = bypass ได้) แล้ว update D-03 | S1 — ตอนนี้ D-03 อธิบาย single-process แต่ไม่ได้พูด spoofing |
| SH3 | `db.ts:79` | เพิ่ม `LIMIT` (เช่น 200) หรือ pagination param | C2 |
| SH4 | API (A5 ต่อยอด) | ส่ง error user-facing ตรง ๆ ไม่ต้องมี prefix `VALIDATION:` ให้ frontend ต้องมาตัดเอง (ตามข้อสรุป a11y ข้อ 4 ใน `QA.md` — ข้อความ API เป็นงานของ OpenCode) | ลด coupling ระหว่าง contract กับ UI |

### ⚪ Nit

| ID | ไฟล์ | งาน |
|---|---|---|
| N1 | `guestbook.ts:14-24` | ลด catch ของ GET ให้เหลือ 500 generic (C3 — dead code) |
| N2 | `contact.ts:33` · `guestbook.ts:47` | honeypot รับ non-string (`website !== ''` แบบ coerce) หรือยอมรับ S3 ไว้ |
| N3 | `db.ts:36,42` | `datetime('now')` เป็น UTC — หน้าเว็บโชว์เวลา UTC ทั้งที่ผู้ใช้ไทย (QA ขั้น 9 เห็น 09:00 ทั้งที่ 16:00 ไทย) — งานฝั่ง render จัดการก็ได้ |
| N4 | `lab05-api.test.ts` | แยก DATA_DIR ต่อ test file ให้ชัด หรือ export `resetDbForTest()` — ลด T1 |
| N5 | honeypot vs rate limit ลำดับ | เช็ค honeypot ก่อน rate limit จะไม่เปลือง quota ให้ bot (จูนได้ทีหลัง) |

## คำถามต่อ Claude

1. **Ride-along ใน PR ของผม** — commit `fc371ba` (แก้ `guestbook.astro` + escapeHtml) อยู่ใน PR #13 ฝั่ง backend ของผม ผมเห็นว่ามี `docs/review-fe-xss-fix.md` + L5 ปิดแล้ว — Claude ยอมรับว่าเป็น exception ตาม handoff ใช่ไหม หรือควรบันทึกกติกากันไว้ (เช่น "fix ด่วนข้าม ownership ต้องมี handoff ก่อน merge")?
2. **A5 / SH4** — ฝั่ง API จะเปลี่ยน error ให้ user-facing เลยไหม (เช่น `"email format is invalid"` ไม่มี prefix)? ถ้าเปลี่ยน frontend ที่ตัด prefix เองจะกลายเป็น dead path — ให้ผมแก้ contract ทีเดียวแล้ว Claude ถอด client-side strip ทีหลังได้ไหม
3. **F1 (profile parser, 1/3 interests)** — ผมเห็น root cause ตามที่ QA วินิจฉัย (flag `m` ทำ `$` จบท้ายบรรทัด) ยืนยันว่าจะรับเป็นงาน frontend หลัง a11y แล้วใช่ไหม — ผมไม่แตะในรอบนี้
4. **F3 (ล้าง test entries)** — entry `Swarm Demo` / `JT: Test 1` / E2E demo ยังอยู่ใน SQLite local ผมพร้อมล้างเมื่อไหร่ก็ได้ (ก่อน ship ตาม OPEN_LOOPS) — แจ้งเวลาได้เลย
5. **`_pr-diff.txt`** — ไฟล์ input ที่ระบุในโจทย์ไม่มีใน repo — Claude ตั้งใจให้ผมสร้างเองจาก git ใช่ไหม (รอบนี้ผมใช้ `git diff 161c271..6b7f6a6`)

---

## Canonical state updated

> รอบนี้เป็น **รีวิวอ่านอย่างเดียว** — ไม่มีการแก้ canonical state (ไม่มี decision ใหม่ที่อนุมัติ; ข้อเสนอ SH2 รอตัดสินเป็น D-id ถ้าผู้ใช้เห็นชอบ)

- [ ] docs/STATUS.md
- [ ] docs/OPEN_LOOPS.md
- [ ] docs/DECISIONS.md (ถ้ามี decision ใหม่)
