# Review — FE fix: guestbook stored XSS + submit UX (L5)

Owner: Claude · frontend · ไฟล์ที่แก้: `src/pages/guestbook.astro` เท่านั้น

## สิ่งที่แก้

1. **Stored XSS** — เพิ่ม `escapeHtml()` ใน `<script>` เดียวกัน (escape `& < > " '`) และห่อทุกค่าจาก DB (`name`, `message`, `created_at`) ก่อนประกอบ template literal ที่ใส่ `innerHTML`
2. **Submit UX** — handler submit เก็บ `res` แล้วตรวจ `res.ok`
   - ไม่ ok → แสดง `ส่งไม่สำเร็จ: <error จาก API หรือ HTTP status>` ใน `#entries` ผ่าน `textContent` และ **ไม่** `form.reset()`
   - ok → พฤติกรรมเดิม (`form.reset()` + `load()`)

## เหตุผล

- ข้อความ guestbook เป็น input สาธารณะที่ถูกเก็บลง SQLite แล้ว render ให้ทุกคนเห็น — ถ้าไม่ escape ใครส่ง `<img src=x onerror=...>` ก็รันสคริปต์ในเบราว์เซอร์ผู้เข้าชมทุกคน
- ใช้ helper เล็ก ๆ แทน dependency ใหม่ (ตามขอบเขตงาน) · error ใช้ `textContent` จึงปลอดภัยแม้ข้อความ error จะมี HTML
- ไม่ reset ตอนพัง เพื่อให้ผู้ใช้ไม่เสียข้อความที่พิมพ์ไว้ และรู้ว่าส่งไม่ผ่าน (เดิมเงียบแล้วล้างฟอร์ม)

## วิธีทดสอบ

1. `npm run test:labs` และ `npm test` — ต้อง green
2. `npm run dev` → เปิด `/guestbook` → ส่ง name=`<b>x</b>`, message=`<img src=x onerror=alert(1)>` → ต้องเห็นเป็นข้อความดิบ ไม่มี alert ไม่มีตัวหนา
3. ทำให้ POST พัง (เช่นส่ง payload ที่ API ปฏิเสธ หรือ DevTools → block request `/api/guestbook`) → เห็น `ส่งไม่สำเร็จ: ...` ใน `#entries` และข้อความในฟอร์มยังอยู่
