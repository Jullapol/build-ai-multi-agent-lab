# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# Claude Code — seed คอร์ส (อย่าลบตอน /init)

หลัง Lab 00 ให้ `/init` **merge** — เก็บกฎด้านล่างไว้เสมอ

## สี่เสา (ย่อ)

1. Multi-Agent แยกหน้าที่/ความจำ · 2. Sub-Agent ใช้แล้วทิ้ง · 3. ประสานผ่าน docs/PR · 4. Swarm เพดาน **20 turns**

## Ownership (บังคับ)

| Artifact | Owner |
|---|---|
| UI | Claude · `.claude/agents/frontend.md` |
| API + SQLite | OpenCode · `.opencode/agents/backend.md` |
| docs PROFILE / DEBATE / DECISIONS | Claude (Lab 01–02) |
| Hot state STATUS / OPEN_LOOPS | ผู้ถืองานรอบนั้น (single-writer) |

## Canonical context (อ่านก่อน · อย่าคัดลอกซ้ำในไฟล์นี้)

ก่อนลงมือ:

1. `docs/STATUS.md`
2. `docs/OPEN_LOOPS.md`
3. handoff ล่าสุดใน `docs/handoffs/` (ถ้ามี)
4. ตามงาน: `docs/PROFILE.md` · `docs/DECISIONS.md`

สรุป Goal / Latest D-id / Open loops / Blockers **ไม่เกิน 8 บรรทัด**  
ห้ามสมมุติจากแชท OpenCode ถ้าไม่มีใน `docs/`  
จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก [`docs/handoffs/TEMPLATE.md`](docs/handoffs/TEMPLATE.md)

> Template ใหม่มีแค่ `docs/STATUS.md.example` / `docs/OPEN_LOOPS.md.example` — ถ้ายังไม่มีไฟล์จริง ให้คัดลอกจาก `.example`

## กฎสั้น

- Root เท่านั้น · plugin **project scope**
- Skill **`public-site-safe`**
- Agent ถาวรใช้ `memory: project` (harness) — ตรวจใน Lab 00 · ห้ามสร้าง memory bus เอง
- MCP ไม่ใช่ท่อ Claude ↔ OpenCode (ห้ามใช้ MCP เป็นท่อส่งงาน) · Cross-CLI เฉพาะ Lab 07
- ห้าม commit `.env` · PR เข้า learner repo เท่านั้น
- Swarm: หยุดเมื่อ done หรือครบ 20 turns
- STATUS/OPEN_LOOPS = single-writer · commit ก่อนสลับ harness

## Commands

```powershell
npm install                 # Node >= 22.12 · better-sqlite3 เป็น native module
npm run dev                 # astro dev → http://localhost:4321
npm test                    # vitest: tests/**/*.test.ts (ไม่รวม tests/labs)
npm run test:labs           # vitest --config vitest.labs.config.ts → tests/labs/** (RED บน template สด จนกว่าจะทำ Lab 05)
npm run test:e2e            # playwright (playwright/*.spec.ts) · ต้องรันเว็บก่อน · baseURL = PLAYWRIGHT_BASE_URL หรือ http://127.0.0.1:4321
npm run build               # astro build → dist/
npm start                   # node ./dist/server/entry.mjs (standalone)
npm run create-issues       # node scripts/create-course-issues.mjs (อ่าน .github/course-issues/)
```

รัน test เดี่ยว: `npx vitest run tests/smoke.test.ts` · กรองชื่อ: `npx vitest run -t "insertContact"` · lab test: `npx vitest run --config vitest.labs.config.ts tests/labs/lab05-api.test.ts`

CI (`.github/workflows/ci.yml`) รัน `npm ci` → `npm test` → `npm run build` บน Node 22 — ไม่รัน `test:labs`

## Architecture

- **Astro 7 SSR** (`output: 'server'`, adapter `@astrojs/node` standalone) — ทุกหน้า/route ใช้ `export const prerender = false`
- **Profile content**: `src/lib/profile.ts` `loadProfile()` parse `docs/PROFILE.md` ตอน runtime ตามหัวข้อ `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests` (bullet list) — ถ้าไม่มีหัวข้อไหนจะใช้ `FALLBACK` แทน การแก้เนื้อหาหน้าเว็บจึงทำที่ PROFILE.md ไม่ใช่ใน `.astro` · Dockerfile copy `docs/` เข้า runtime image ด้วยเหตุนี้
- **Persistence**: `src/lib/db.ts` — `getDb()` เป็น singleton ของ better-sqlite3 ที่ `$DATA_DIR/site.sqlite` (default `./data`) สร้างตาราง `contact_messages`, `guestbook` · `insertContact` / `listGuestbook` / `insertGuestbook` เป็น stub ที่ throw `NOT_IMPLEMENTED…` (Lab 05 · OpenCode เป็นเจ้าของ)
- **API routes** (`src/pages/api/*.ts`): ห่อ lib call ด้วย try/catch — error ที่ขึ้นต้นด้วย `NOT_IMPLEMENTED` → 501 นอกนั้น → 400 (POST) / 500 (GET) · validation error ให้ throw จาก lib เพื่อได้ 400 · `/api/interests` อ่านจาก profile
- **Pages** (`src/pages/*.astro` + `src/layouts/BaseLayout.astro`) เป็น UI ของ Claude/`frontend` — guestbook/contact เป็น client-side `fetch` ไปที่ `/api/*`
- **Public-site guard**: `tests/public-site.test.ts` scan markup ที่ render ได้ใน `src/**/*.astro|html` (ไม่รวม frontmatter / HTML comments) ห้ามมีคำว่า "lab 0x" / "แล็บ" — ห้ามเอาข้อความอ้างอิงคอร์สไปไว้ใน UI (comment ใน `.ts` ใส่ได้)
- **Deploy**: Dockerfile multi-stage · `DATA_DIR=/data` volume · `SITE_URL` build arg · Coolify (Lab 08) — ห้ามเคลมว่า deploy สำเร็จถ้ายังไม่ได้ URL ที่ตอบ 200 จริง
- **Agent/skill files**: Claude → `.claude/agents/` (`frontend`, `reviewer`), `.claude/skills/` (`public-site-safe`, `opencode`) · OpenCode → `.opencode/agents/backend.md`, `.opencode/skills/` · config ตัวอย่าง: `.claude/settings.json.example`, `opencode.json.example`, `.mcp.json.example`

## Labs

ดู [`labs/README.md`](labs/README.md) · เริ่ม [`lab-00-project-init`](labs/lab-00-project-init/README.md)
