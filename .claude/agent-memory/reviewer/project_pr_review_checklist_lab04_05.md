---
name: pr-review-checklist-lab04-05
description: Recurring checks when reviewing Lab 04 (frontend) / Lab 05 (backend) PRs of JT's personal site — traps the static guard misses, from 2026-09-25 debate
metadata:
  type: project
---

Checklist from the 2026-09-25 team debate. Verify each item against the diff; don't assume it's already fixed.

- Runtime leak: `NOT_IMPLEMENTED…Lab 05` from db.ts goes through api/*.ts `err.message` to the UI and to direct API calls. tests/public-site.test.ts scans static markup only, so it can't catch this. Grep the diff for `data.error` / `err.message`.
- Meta description default in BaseLayout contains "multi-agent course" and the guard misses it. Check it changed.
- Removing /contact or /guestbook: playwright/smoke.spec.ts must be updated in the same PR (CI doesn't run e2e, so a red spec gets merged silently).
- /interests redirect must be 302, not 301, until JT confirms the IA (browsers cache 301 permanently).
- No links to removed pages (nav + home). No "เร็ว ๆ นี้" / "กำลังตามมา". No `example.com` rendered publicly.
- Any override of a PROFILE Must (portfolio cards, dummy contact) needs evidence that JT approved it (a PROFILE edit or a commit/message from JT). Agents only propose and record in DECISIONS/OPEN_LOOPS. IA changes go through a PR for JT to merge, not a direct push to main.
- Headline "ทำงานแทน" going live = ship blocker. PROFILE.md must be edited by JT, not by an agent.
- Must require a 360x640 Playwright check that name + headline + tagline fit on the first screen.
- Backend: POST must not write to SQLite while the UI is closed. Server-side length checks. Error message must be neutral, never mention the course.

**Why:** these traps came out of the debate and aren't in the code or docs yet.
**How to apply:** use as the Must checklist when reviewing Lab 04/05 PRs (Lab 07).
