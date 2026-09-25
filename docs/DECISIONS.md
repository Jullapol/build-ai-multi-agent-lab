# Decisions — Personal Site

> สังเคราะห์จาก [`DEBATE.md`](DEBATE.md) (debate แบบทีม 5 รอบ · 20/20 turns · 2026-09-25)
> **แทนที่ชุด D1–D8 เดิม** (เก็บไว้ใน `DECISIONS.md.backup`) · สถานะ `✅ ตัดสินแล้ว` = ทำได้เลย · `⏳ รอ JT` = agent เสนอได้ แต่ต้องให้ JT ยืนยันก่อน merge/ship

## สรุปการโต้วาที

ทุกมุมเห็นตรงกันว่าเว็บ v1 ต้อง**พูดความจริงทุกบรรทัด**: ห้ามมี "ทำงานแทน", ลิงก์ `example`, ข้อความ "Lab 05" หรือ "เร็ว ๆ นี้" ขึ้นหน้าเว็บ
Brand ถอน headline ที่สัญญาผลลัพธ์ หลังถูก reviewer และ Devil ท้วง แล้วได้ข้อสรุปเป็น "ผู้ช่วย AI ที่ไม่ต้องจ่ายเงินเดือน (แต่ต้องสอนงาน)"
UX เปลี่ยนจุดยืนมากที่สุด จากเว็บ 4 หน้าที่มีฟอร์มติดต่อ มาเป็น 2 เมนู (หน้าแรก · เกี่ยวกับผม) โดยให้เหตุผลว่าหน้าว่างแย่กว่าไม่มีหน้า
Devil ดันให้ตัด scope จนเหลือน้อย แล้วหันกลับมาเตือนว่า "portfolio ที่ไม่มีผลงานและไม่มีทางติดต่อ" ก็เสี่ยงอีกแบบ และ agent ไม่มีอำนาจ override Must ของเจ้าของ
ผลคือแยกงานเป็น 2 ก้อน: ก้อน security ทำได้ทันที ส่วนก้อน IA ที่ไปแตะ Must ของ PROFILE ต้องเข้า PR รอ JT merge และมี 4 เรื่องที่ JT ต้องตัดสินเอง

## การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D1 | Headline + tagline | ⏳ **Headline:** "ผู้ช่วย AI ที่ไม่ต้องจ่ายเงินเดือน (แต่ต้องสอนงาน)" · **Tagline:** "ผมจัดทีม AI ให้แบ่งกันจด เช็ก และเตือน แล้วมาเล่าที่นี่ว่าอะไรเวิร์ก อะไรพัง" · "Builder" เป็นบรรทัดรองใต้ชื่อ · **JT แก้ `PROFILE.md` `## Headline` เอง** (agent ไม่แก้) · ถ้ายังเป็น "ทำงานแทน" = **blocker ก่อน ship** | ไม่สัญญาผลลัพธ์ · วงเล็บยอมรับขีดจำกัดของ AI · มีคำว่า AI เพื่อให้คนนอกสาย tech เข้าใจใน 10 วิ | Brand (reviewer + Devil ท้วงจนได้เวอร์ชันนี้) |
| D2 | กลุ่มเป้าหมาย | ✅ กลุ่มหลัก = **คนทำงานที่งานล้นมือ** ไม่ต้องสาย tech · กลุ่มรอง = dev (เรื่อง debug/process flow อยู่ในการ์ด Interests ไม่ขึ้น Hero) · ครั้งแรกที่พูดถึง multi-agent ให้ใช้คำว่า "ทีมผู้ช่วยที่แบ่งหน้าที่กัน" | แก้จุดที่ Audience ขัดกับ Interests ข้อ debug | Brand |
| D3 | IA + เมนู | ⏳ เมนู 2 อัน: **หน้าแรก · เกี่ยวกับผม** · การ์ด Interests 4 ใบย้ายไปอยู่ใน About (`#interests`) · `/interests` redirect **302** (ไม่ใช่ 301) ไป `/about#interests` · ไม่มีลิงก์ไปหน้าที่ไม่มีอยู่แล้ว | เมนูที่พาไปหน้าว่างคือทางตัน · 302 ย้อนกลับได้ถ้า JT ไม่เห็นด้วย | UX + Brand (frontend ค้านแล้วยอม) |
| D4 | Hero (จอแรก) | ✅ มีแค่ชื่อ + Builder + headline + tagline + ลิงก์เดียว "รู้จักผมมากขึ้น →" · ตัด Bio / "Audience:" / "Personal branding site" ออกจาก Hero · **ต้องครบในจอแรกที่ 360×640 โดยไม่ scroll** และมี Playwright ยืนยัน | เป้าหมาย "รู้ใน 10 วินาที" · ภาษาไทยตัดบรรทัดคาดเดายาก จึงต้องวัดจริง | UX (เส้นแดง) + frontend |
| D5 | About | ✅ Bio แสดงแบบคงการเว้นย่อหน้า (ตอนนี้ยุบเป็น `<p>` เดียว) · การ์ด Interests 4 ใบ หัว section "เรื่องที่ผมให้ผู้ช่วย AI ช่วยอยู่" · แยกหัว/คำอธิบายตรง "—" ใน UI โดยไม่แตะ parser (ต้องคง `interests: string[]` ไว้) · ท้ายหน้า: "อ่านจบแล้ว ลองหยิบสักข้อไปใช้กับงานตัวเองดูครับ เสร็จเร็วแล้วก็ไปนอนเล่นได้เลย" + "← กลับหน้าแรก" | ไม่ให้ About เป็นทางตัน · ไม่แตะ parser ที่ `/api/interests` ใช้ร่วมอยู่ | UX (+ frontend เรื่องวิธีทำ) |
| D6 | Guestbook | ✅ **`/guestbook` ตอบ 404** (ลบหน้า) · ตัดลิงก์ที่ `index.astro:19` และใน nav · `/api/guestbook` ส่งเป็น handoff ให้ backend (D11) | ปิด XSS (`guestbook.astro:29-30`) และ error "Lab 05" ที่รั่วตั้งแต่โหลดหน้า (`:26`) ได้ในทีเดียว · guestbook อยู่ใน Nice จึงไม่ถือว่า override Must | Devil (reviewer ตัดสิน) |
| D7 | ช่องทางติดต่อ | ⏳ **ห้ามแสดงลิงก์ dummy** (`example`) · **ไม่ render `/contact`** (404) และไม่ parse `## Contact` ในรอบนี้ · เมื่อ JT ให้ช่องทางจริง 1 ช่อง (แนะนำ GitHub) ให้วางท้าย About โดยไม่ต้องมีหน้าติดต่อแยก · **override Must "ลิงก์ติดต่อ (dummy)"** | dummy ที่ชี้ไปบัญชีคนอื่น = เว็บดูปลอม · ถ้าฟอร์มปิดและ dummy ถูกซ่อน หน้าติดต่อจะว่าง | Devil + UX (Brand: ต้องมีทางไปต่อ 1 ช่อง) |
| D8 | ผลงาน | ⏳ **ไม่มีส่วนผลงานใน v1** จนกว่าจะมีเคสจริง · ห้ามการ์ดสมมุติ ห้ามป้าย "เร็ว ๆ นี้" · เคส "เว็บนี้เอง" ใช้ได้ **หลังมี URL ที่ตอบ 200 จริง + มีตัวเลขที่วัดได้** และต้องเล่าโดยไม่อ้างโครงคอร์ส · **override Must "ผลงานตัวอย่าง 2–3 การ์ด"** | การ์ดสมมุติ 3 ใบทำลายความน่าเชื่อถือ · เคส "เว็บนี้เอง" ตอนนี้ยังไม่มีผลลัพธ์จริง | Devil + Brand + UX (ตรงกันทั้ง 3 มุม) |
| D9 | ข้อความเทคนิค / error บนหน้าเว็บ | ✅ UI ห้ามแสดง `data.error` ดิบ ให้ใช้ข้อความคงที่ · ตัด `POST /api/contact`, "อัปเดตเร็ว ๆ นี้" · แก้ meta description ค่าเริ่มต้นใน `BaseLayout.astro:6` (ตอนนี้มีคำว่า "…multi-agent course") · เพิ่มหน้า 404 โทนแบรนด์ "หน้านี้ผู้ช่วยผมเก็บไปแล้วครับ" + ปุ่ม หน้าแรก / เกี่ยวกับผม | public-site guard สแกนแค่ markup นิ่ง จึงไม่จับ runtime error กับ meta | reviewer (หลักฐาน) + UX + Devil |
| D10 | Tone + สี | ✅ คงน้ำเสียงสนุก เป็นกันเอง แต่มุก **ไม่เกิน 1 จุดต่อ section** · โทนครีม / ส้มอิฐ / น้ำตาลอ่อน = **Should (ค้างไว้ ไม่ได้ตัด)** ถ้าทำต้องเปลี่ยน token ทั้งชุดและตรวจ contrast (`--text:#eef2ff` บนพื้นครีมไม่ผ่าน) | สีคือตัวแบรนด์ (Brand) แต่ไม่อยู่ใน Must และเปลี่ยนแบบรีบ ๆ เสี่ยง contrast ตก | Brand vs frontend → reviewer ตัดสินเป็น Should |
| D11 | Handoff ถึง backend (OpenCode) | ✅ `db.ts:55,60,68` + `api/*.ts` ตอบ 501 ด้วยข้อความกลางที่ไม่อ้างคอร์ส · ระหว่างที่ UI ปิด POST ต้องไม่บันทึกลง SQLite · ตรวจความยาวฝั่ง server · เปิดใช้ฟอร์ม/guestbook เมื่อ JT ตอบ OPEN_LOOPS เรื่อง "ใครอ่าน เก็บกี่วัน ลบยังไง" แล้วเท่านั้น | ซ่อน UI ≠ แก้ปัญหา: `/api/*` ยังยิงตรงได้ | Devil + reviewer |
| D12 | วิธีส่งงาน Lab 04 | ✅ **Commit A (security: D6, D9)** merge ได้เลย · **Commit B (IA: D3, D7, D8)** เปิดเป็น branch/PR **รอ JT merge** ไม่ push เข้า main แล้วรอ revert · ลบฟอร์ม `/contact` ต้องแก้ `playwright/smoke.spec.ts:9-14` ใน PR เดียวกัน (เปลี่ยนไปตรวจเมนูใหม่ ไม่ใช่ลบทิ้ง) | revert ได้ ≠ ได้รับอนุญาต · CI ไม่รัน e2e ถ้า spec แดงจะถูก merge ไปเงียบ ๆ | Devil (reviewer เข้าข้าง · frontend เสนอการแยก A/B) |

### ยังไม่ลงตัว — JT ตัดสิน

1. **ช่องทางติดต่อจริง 1 ช่อง** (หรือประกาศว่าไม่มี) · 3 ใน 4 เสียงเลือกข้อนี้เป็น "ข้อเดียวที่ควรตัดสินวันนี้" (UX, Devil, reviewer) เพราะคำตอบข้อนี้กำหนดว่าเว็บเป็น portfolio หรือไม่
2. **เป้าเว็บ:** คงเป็น Portfolio (Brand) หรือเปลี่ยนเป็นหน้าแนะนำตัว (Devil)
3. **ยืนยัน override Must 2 ข้อ** (D7 ลิงก์ dummy, D8 ผลงาน 2–3 การ์ด) และ merge Commit B
4. **แก้ headline ใน PROFILE** ตาม D1 (Brand เลือกข้อนี้เป็นข้อเดียววันนี้)
5. จะเปิดฟอร์ม/guestbook เมื่อไหร่ · ใครอ่าน · เก็บกี่วัน · ลบยังไง

## สิ่งที่เลื่อนออก (Out of scope v1)

- ส่วนผลงาน / หัวข้อ `## Work` / เมนู "ผลงาน": รอเคสจริง หรือรอเงื่อนไขของเคส "เว็บนี้เอง" ตาม D8
- ฟอร์ม contact: รอ JT ตอบ OPEN_LOOPS + backend ทำ D11 · วันที่เปิดต้องมี 4 สถานะ (ปกติพร้อมบอกวัตถุประสงค์ · กำลังส่ง · สำเร็จ · ล้มเหลว) และข้อความแจ้งเรื่อง PII
- Guestbook ทั้งฟีเจอร์: กลับมาได้เมื่อมี escape + rate limit/honeypot + วิธีลบข้อความ + คนดูแล
- Parser สำหรับ `## Contact`: รอช่องทางจริง
- ป้าย "ตัวอย่างสมมุติ": ไม่มีส่วนผลงานให้ติด
- โทนสีครีม: Should ค้างไว้ตาม D10 ทำได้ถ้าเหลือ turn หลังผ่านเกณฑ์ด้านล่าง
- ประโยค "เว็บนี้ทำโดยทีมผู้ช่วย AI ที่แบ่งหน้าที่กัน" ใน About: หลัง ship จริงเท่านั้น
- แผนภาพทีม agent · ตัวอย่าง process flow ก่อน/หลัง (ต้องใช้ระบบสมมุติที่สร้างขึ้นเอง เพราะเสี่ยง NDA) · หน้า Uses · case study ฉบับยาว · สลับภาษาไทย/อังกฤษ · blog/CMS · login · newsletter · analytics

## เกณฑ์พร้อม Frontend (Lab 04)

- **Security ก่อน (Commit A):** `/guestbook` ตอบ 404 · ไม่มีหน้าไหนแสดง `data.error` หรือข้อความ "Lab 05" / "course" (รวม meta description) · ไม่มีลิงก์ไปหน้าที่ 404
- **จอแรก:** Hero มีเฉพาะชื่อ + Builder + headline + tagline + ลิงก์เดียว และผ่าน Playwright ที่ 360×640 โดยไม่ต้อง scroll (D4)
- **About:** Bio คงการเว้นย่อหน้า + การ์ด Interests 4 ใบ (แยกหัว/คำอธิบายตรง "—") + ข้อความท้ายหน้า (D5) · `/interests` → 302
- **IA (Commit B · PR รอ JT):** เมนู 2 อัน · ไม่มี `/contact` · ไม่มีลิงก์ `example` · `playwright/smoke.spec.ts` แก้ใน PR เดียวกัน
- **ผ่านทั้งหมด:** `npm test` (รวม public-site guard) + `npm run build` + `npm run test:e2e` · ทุกหน้าใหม่มี `export const prerender = false` · ไม่แตะ `src/lib/db.ts` / `src/pages/api/*`

## บันทึกการแก้ PROFILE

- **รอบนี้ไม่ได้แก้ `docs/PROFILE.md`** · debate สรุปว่า headline (D1) และการ override Must (D7, D8) ต้องให้ JT ตัดสินและแก้เอง
- headline ใน PROFILE ตอนนี้ ("Builder ที่ให้ทีม AI ทำงานแทน") มาจาก D1 ของชุดเดิม และรอบนี้ถูกตีตกเพราะคำว่า "ทำงานแทน" เกินจริง

## GitHub issues (Lab 03)

| Issue # | Title | มาจาก Decision |
|---|---|---|
| [#1](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/1) | Headline + tagline ใหม่ใน PROFILE (JT แก้เอง · blocker ก่อน ship) | D1 |
| [#2](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/2) | Hero จอแรก สำหรับคนทำงานที่งานล้นมือ (360×640 ไม่ scroll) | D2 + D4 |
| [#3](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/3) | IA: เมนู 2 อัน (หน้าแรก · เกี่ยวกับผม) + /interests → 302 | D3 |
| [#4](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/4) | หน้า About: Bio เว้นย่อหน้า + การ์ด Interests 4 ใบ + ข้อความท้ายหน้า | D5 |
| [#5](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/5) | Guestbook scope: ปิด /guestbook (404) + ตัดลิงก์ · ส่ง API ให้ backend | D6 |
| [#7](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/7) | ตัด contact dummy + ส่วนผลงานออกจาก v1 (override Must · รอ JT) | D7 + D8 |
| [#8](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/8) | ห้าม error ดิบ / ข้อความเทคนิคบนหน้าเว็บ + meta description + หน้า 404 | D9 |
| [#9](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/9) | Tone + สี: มุกไม่เกิน 1 จุด/section · โทนครีม (Should + ตรวจ contrast) | D10 |
| [#10](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/10) | Handoff ถึง backend: API ตอบ 501 ข้อความกลาง · ไม่บันทึก SQLite ระหว่างปิด UI | D11 |
| [#11](https://github.com/Jullapol/build-ai-multi-agent-lab/issues/11) | วิธีส่งงาน Lab 04: Commit A (security) merge ได้ · Commit B (IA) เป็น PR รอ JT | D12 |

> #6 = draft PR ของ Copilot ที่แก้ #2 (ไม่ใช่ issue จาก decision)

## Lab 03 — MCP vs gh

- **ความเร็ว:** ฝั่ง MCP สร้างได้ 5 issue ใน turn เดียว (ยิงพร้อมกัน) และอ่าน label / issue ซ้ำ / `get_me` ได้ก่อนสร้าง แต่ต้องโหลด schema ของ tool ก่อนใช้ครั้งแรก · ฝั่ง `gh` ยิงได้ทีละคำสั่ง ถ้า body เป็นภาษาไทยหลายบรรทัดต้องใช้ here-string ของ PowerShell (quoting พลาดง่ายกว่า) แต่มนุษย์พิมพ์เองได้ทันที ไม่ต้องผ่าน agent
- **สิทธิ์:** MCP ใช้ token ที่ตั้งค่าไว้ใน config ของ MCP server สิทธิ์เท่ากับ scope ของ token นั้น และ agent เรียกได้ทุก tool ที่ server เปิดให้ (รวม `delete_repository` / `merge_pull_request`) จึงต้องคุมด้วย permission ของ harness · `gh` ใช้ token จาก `gh auth login` (keyring) และคนเป็นผู้กด Enter เอง · ทั้งสองแบบห้ามใส่ token ลงในไฟล์ที่ commit
- **Audit trail:** บน GitHub ทั้งสองแบบแสดงผู้สร้างเป็นบัญชีเดียวกัน (Jullapol) จึงแยกจาก issue ไม่ได้ว่า agent หรือคนเป็นผู้สร้าง · ฝั่ง MCP มี transcript ของ Claude และตารางใน `DECISIONS.md` ช่วยย้อนดู · ฝั่ง `gh` เหลือแค่ shell history → ควรตั้ง prefix ของ title (`[D-id]` / `[Lab 03]`) แล้วลิงก์กลับ `docs/` เสมอ
- **ข้อผิดพลาดที่เจอ (ฝั่ง MCP):** ไม่เจอ 401 · label `docs` ไม่มีใน repo จึงใช้ `documentation` แทน · เลข issue ข้ามจาก #5 ไป #7 เพราะ Copilot เปิด draft PR #6 (issue กับ PR ใช้ชุดเลขเดียวกัน) · ลิงก์ `blob/main/docs/DECISIONS.md` ใน issue จะเปิดได้ 404 จนกว่าไฟล์จะเข้า `main` · ฝั่ง `gh` ให้บันทึกเพิ่มหลังรันจริง
- **เมื่อไหร่ใช้อะไร:** ใช้ MCP เมื่อต้องสร้างหลาย issue จากเอกสารใน loop ของ agent (อ่าน → เช็กซ้ำ → สร้าง → สรุปตาราง) · ใช้ `gh` เมื่อคนสร้างเอง issue เดียว หรืออยากดู draft ก่อน publish (`--web`) หรือเมื่อ MCP ล่ม/ได้ 401 · MCP เป็นช่องทางทำงานกับ GitHub เท่านั้น ไม่ใช่ช่องส่งงานระหว่าง Claude ↔ OpenCode
