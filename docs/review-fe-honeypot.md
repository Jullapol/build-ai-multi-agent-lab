# Review FE — H2 Honeypot field (D-05)

ผู้เขียน: Claude (frontend) · เรียกผ่าน `claude -p` · ยังไม่ commit (ผู้เรียกตรวจแล้ว commit เอง)

## สิ่งที่เพิ่ม

| ไฟล์ | การเปลี่ยนแปลง |
|---|---|
| `src/pages/contact.astro` | เพิ่ม `<label class="hp-field" for="website">` + `<input id="website" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">` หลัง textarea `message` · เพิ่ม `<style is:global>` กำหนด `.hp-field` |
| `src/pages/guestbook.astro` | เหมือนกันทุกอย่าง |

- CSS: `.hp-field { position: absolute; left: -9999px; }`
- ใส่ class `hp-field` ให้**ทั้ง label และ input** (spec ระบุ class ไว้ที่ label — ถ้าไม่ใส่ที่ input ด้วย ช่อง input จะยังโผล่บนจอ)
- ไม่ได้แก้ `<script>` เดิมเลย — `new FormData(form)` เก็บ `website` ติดไปใน payload เอง

## เหตุผล

- D-05: bot มักกรอกทุก field → API (`src/pages/api/contact.ts`, `guestbook.ts`) เห็น `website` ไม่ว่าง → ตอบ `201 {ok:true}` ปลอม ไม่บันทึก DB
- ซ่อนแบบย้ายออกนอกจอ ไม่ใช้ `display:none` — bot บางตัวข้าม field ที่ `display:none` และ autofill บางตัวไม่กรอก field ที่มองไม่เห็นแบบนั้น
- `tabindex="-1"` กันคนใช้คีย์บอร์ด tab เข้าไป · `aria-hidden="true"` กัน screen reader อ่าน · `autocomplete="off"` ลดโอกาส browser เติมค่าให้คนจริงโดยไม่ตั้งใจ
- CSP ปัจจุบัน `style-src 'self' 'unsafe-inline'` → `<style is:global>` ไม่ถูกบล็อก

## วิธีทดสอบ

1. `npm run dev` → เปิด `/contact` และ `/guestbook` — ต้อง**ไม่เห็น** ช่อง Website · กด Tab ไล่ field ต้องไม่หยุดที่ช่องนี้
2. คนจริง: กรอกฟอร์มปกติแล้วส่ง → contact ขึ้น "Sent. Thank you!" · guestbook มีข้อความใหม่ในรายการ
3. จำลอง bot: DevTools → `document.getElementById('website').value = 'http://spam'` แล้วส่ง → ได้ 201 (UI แสดงเหมือนสำเร็จ) แต่ **ไม่มีแถวใหม่** ใน DB / guestbook ไม่มีข้อความนั้นหลัง reload
4. Network tab: payload ที่ POST มีคีย์ `website` (ค่าว่างสำหรับคนจริง)
5. `npm run build` ผ่าน

## นอกขอบเขต (ไม่ได้แตะ)

`src/lib/**` · `src/pages/api/**` · `tests/**` · `src/middleware.ts` · `.env`
