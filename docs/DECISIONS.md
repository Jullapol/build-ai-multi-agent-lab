# Decisions

> บันทึก decision ที่**อนุมัติแล้ว**เท่านั้น · brainstorm/ยังไม่ปิดอยู่ใน `DEBATE.md`  
> อ้างอิง D-id จาก PR / STATUS / OPEN_LOOPS ได้

| ID | Decision | Status | อ้างอิงไฟล์ |
|---|---|---|---|
| D-01 | Persistence layer = **better-sqlite3** ผ่าน `src/lib/db.ts` · ไฟล์ DB อยู่ที่ `${DATA_DIR:-cwd}/data/site.sqlite` (สร้าง dir อัตโนมัติ · ตาราง `contact_messages` + `guestbook`) | Approved | `src/lib/db.ts` |
| D-02 | Validation rules — `name` 1–100 ตัวอักษร · `email` 1–254 + basic regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) · contact `message` 1–2000 · guestbook `message` 1–1000 · error ที่ขึ้นต้น `"VALIDATION:"` ใช้ส่งกลับ client ได้ (HTTP 400) · error อื่นทั้งหมดคืน generic `"internal error"` (HTTP 500) ไม่หลุดรายละเอียดภายใน | Approved | `src/lib/db.ts`, `src/pages/api/contact.ts`, `src/pages/api/guestbook.ts` |
