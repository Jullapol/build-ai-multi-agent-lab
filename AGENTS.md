# Agents — Build AI Multi-Agent Lab (V4)

กติการ่วมของ **Claude Code** และ **OpenCode** — สินค้าคือเว็บ personal branding (Astro SSR) ใน root นี้
หลัง Lab 00 ทำ `/init` แล้วต้อง **merge** ไฟล์นี้ — ห้ามลบ Ownership / Native harness

## Commands

```powershell
npm install            # Node >= 22.12 · better-sqlite3 เป็น native module (ต้อง allowScripts ตาม package.json)
npm run dev            # astro dev → http://localhost:4321
npm test               # vitest: tests/**/*.test.ts — ไม่รวม tests/labs
npm run test:labs      # tests/labs/** ผ่าน vitest.labs.config.ts — RED บน template สด (stub NOT_IMPLEMENTED) จนกว่าจะทำ Lab 05
npm run test:e2e       # playwright/*.spec.ts — ต้องรันเว็บก่อน · baseURL = PLAYWRIGHT_BASE_URL หรือ http://127.0.0.1:4321
npm run build && npm start   # astro build → dist/ · standalone: node ./dist/server/entry.mjs
node scripts/create-course-issues.mjs   # สร้าง issues จาก .github/course-issues/
```

- รัน test เดี่ยว: `npx vitest run tests/smoke.test.ts` · กรองชื่อ: `npx vitest run -t "insertContact"`
- CI (`.github/workflows/ci.yml`) = `npm ci` → `npm test` → `npm run build` บน Node 22 — **ไม่รัน** `test:labs` / e2e

## Start-of-session (≤ 8 บรรทัด)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` (+ handoff ล่าสุดใน `docs/handoffs/` ที่ส่งถึงคุณ)
2. Template ใหม่ยังไม่มีไฟล์จริง — คัดลอกจาก `docs/*.md.example` ก่อน (ห้ามแก้ `.example`)
3. สรุป: Current goal · Latest D-id · Open loops · Blockers
4. ไฟล์ขัดแย้งกัน → หยุดวิเคราะห์ก่อนแก้โค้ด · ห้ามสมมุติสิ่งที่เกิดในแชทอีกฝั่งถ้าไม่มีใน `docs/`
5. จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff จาก `docs/handoffs/TEMPLATE.md`

## Single-writer + Ownership

- `STATUS.md` / `OPEN_LOOPS.md` — writer **คนเดียวต่อรอบ**, สลับ Claude ↔ OpenCode หลัง commit หรือหลังเขียน handoff
- อย่าให้สอง agent แก้ไฟล์เดียวกันพร้อมกันโดยไม่แยก branch · reviewer อ่านอย่างเดียวจนกว่า handoff จะโอนงานชัด

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`, styles) | Claude · agent `frontend` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · agent `backend` |
| E2E / a11y (`docs/QA.md`) | Playwright MCP + either CLI |
| Profile / debate docs | Claude (Lab 01–02 · subagents) |
| Handoffs / Ship / Review artifacts | ผู้ส่งงาน · Lab 07–08 ตาม `labs/README.md` |

## Cross-CLI (Native harness เท่านั้น)

- ความจำถาวรใช้ของ harness เอง: Claude = `memory: project` → `.claude/agent-memory/` · OpenCode = `AGENTS.md` + agent file + resume session — **ห้ามสร้าง memory bus / JSON ท่อส่งงาน / daemon เอง**
- Call ข้าม harness ได้ (ฝั่ง OpenCode เรียก `claude -p` · ฝั่ง Claude เรียก `opencode run` — skills `claude-code` / `opencode`) · ท่อ = ไฟล์รายงานใน `docs/`
- ฝั่งถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ · commit ก่อนให้อีก harness เขียน working tree
- MCP (GitHub / Playwright, ดู `opencode.json.example` / `.mcp.json.example`) = งานผลิต — **ไม่ใช่**ท่อระหว่าง CLI

## Architecture (จุดที่ชื่อไฟล์บอกไม่หมด)

- **Astro 7 SSR** (`output: 'server'`, adapter node standalone) — ทุกหน้า/route มี `export const prerender = false` — เพิ่มหน้าใหม่ต้องใส่ด้วย
- **เนื้อหาเว็บมาจาก `docs/PROFILE.md`** — `src/lib/profile.ts` `loadProfile()` parse ตอน runtime (หัวข้อ `## Name/Headline/Bio/Audience/Interests`, ขาด → FALLBACK) แก้คอนเทนต์ที่ PROFILE.md ไม่ใช่ใน `.astro` · Dockerfile copy `docs/` ลง image ด้วยเหตุนี้
- **`src/lib/db.ts`** — `getDb()` singleton better-sqlite3 ที่ `$DATA_DIR/site.sqlite` (default `./data`) · `insertContact` / `listGuestbook` / `insertGuestbook` เป็น stub throw `NOT_IMPLEMENTED…` (Lab 05 · OpenCode)
- **API routes** (`src/pages/api/*.ts`) ห่อ lib ด้วย try/catch: error `NOT_IMPLEMENTED…` → 501 · นอกนั้น → 400 (POST) / 500 (GET) — validation ให้ throw จาก lib เพื่อได้ 400
- **Public-site guard** (`tests/public-site.test.ts`) — markup ที่ render ได้ใน `src/**/*.astro|html` ห้ามมีคำ "lab 0x" / "แล็บ" (frontmatter + HTML comment ถูก strip, comment ใน `.ts` ใส่ได้)
- **Deploy**: Dockerfile multi-stage · `DATA_DIR=/data` volume · `SITE_URL` build arg · Coolify (Lab 08)

## Swarm

- หลายตัวได้ แต่เพดาน **20 turns** — ครบแล้วหยุดสรุปช่องว่าง (Lab 05b)
- ใช้ skill **`public-site-safe`** ทุกงาน implement / swarm / ship

## ห้าม

- Commit `.env`, PAT, Coolify webhook, `node_modules` (env จริงอ่านจาก `.env` — ดู `.env.example`: `STUDENT_SLUG`, `SITE_URL`, `DATA_DIR`, `GITHUB_PERSONAL_ACCESS_TOKEN`, `COOLIFY_DEPLOY_WEBHOOK`)
- เคลม deploy สำเร็จโดยไม่มี URL ตอบ 200 จริง
- บังคับ tmux บน Windows · PR เข้า `Onto-IQ/*` (เข้า learner repo เท่านั้น)
- ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## Labs

[`SETUP.md`](./SETUP.md) → [`labs/lab-00-project-init`](./labs/lab-00-project-init/README.md) → [`labs/README.md`](./labs/README.md) · งานละ 1 issue จาก `.github/course-issues/`
