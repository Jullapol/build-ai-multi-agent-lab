---
name: ui-traps-from-debate
description: กับดักโค้ด UI + แพทเทิร์นตัดสินใจที่ได้จาก debate personal site (2026-09-25) — อ่านก่อน implement Lab 04
metadata:
  type: project
---

- ลบฟอร์ม `/contact` → ต้องแก้ `playwright/smoke.spec.ts` (เทสต์ "contact page has form fields") ใน PR เดียวกัน ให้ไปตรวจเมนูใหม่แทน · CI ไม่รัน e2e จึงไม่ฟ้อง ต้องรัน `npm run test:e2e` เอง
- `tests/public-site.test.ts` สแกนแค่ markup นิ่ง · error ตอน runtime (`data.error` ที่มี "Lab 05") หลุดได้ → UI ใช้ข้อความคงที่เสมอ · meta description ใน BaseLayout ก็หลุด guard
- สีปัจจุบันเป็น dark (`--text:#eef2ff`) · ถ้าเปลี่ยนเป็นโทนครีมตาม PROFILE ต้องสลับ token ทั้งชุดแล้วเช็ก contrast ใหม่ ห้ามแก้ `--bg` ตัวเดียว
- Redirect URL เก่า: ใช้ 302 ระหว่างรอเจ้าของยืนยัน แล้วค่อยเปลี่ยนเป็น 301 (301 ถูก browser cache ถาวร ย้อนยาก)
- Agent ห้าม override Must ใน PROFILE เอง → เสนอ + บันทึก DECISIONS/OPEN_LOOPS · implement เป็น commit แยก (security แยกจาก IA) ให้ revert ได้ทีละก้อน
- เส้นแดง UX: ชื่อ + headline + tagline ครบจอแรกที่ 360px → ยืนยันด้วย Playwright viewport 360x640 ไม่ใช่ประมาณด้วยตา (ภาษาไทยตัดบรรทัดไม่แน่นอน)

**Why:** เจอระหว่าง debate 5 รอบ (reviewer/Devil/UX ชี้) ยังไม่อยู่ในโค้ดหรือ docs ในรูปกฎ
**How to apply:** เช็กรายการนี้ก่อนเปิด PR ฝั่ง UI ทุกครั้ง · ดู [[frontend-ownership]] สำหรับขอบเขตงาน
