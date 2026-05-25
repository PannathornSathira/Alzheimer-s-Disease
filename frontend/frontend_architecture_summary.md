# Frontend Architecture & Implementation Summary
**Project:** Epilepsy After Ischemic Stroke - Clinical Trial Randomization System
**Stack:** React + Vite + Tailwind CSS + React Router DOM

---

## 1. State Management (Context API)
**File:** `src/context/PatientContext.jsx`
เราใช้ React Context ในการเก็บข้อมูลการลงทะเบียนของผู้ป่วย (Session State) เพื่อให้ทุกหน้าสามารถเข้าถึงและแก้ไขข้อมูลได้โดยสมบูรณ์ ข้อมูลจะไม่สูญหายเมื่อกดเปลี่ยนหน้า (ในกรณีที่ยังไม่ได้รีเฟรชเบราว์เซอร์)

**โครงสร้างตัวแปร (patientData):**
```javascript
{
  systemId: null,        // รหัส System ID ที่ถูก Anonymize แล้ว
  hospital: '',          // ชื่อโรงพยาบาล
  hn: '',                // หมายเลข HN จริง (เก็บซ่อนไว้ ไม่แสดงผล)
  inclusionPass: false,  // สถานะผ่าน Inclusion
  exclusionPass: false,  // สถานะผ่าน Exclusion
  selectScore: 0,        // คะแนนรวม SeLECT Score
  assignedArm: null      // กลุ่มที่ถูกสุ่ม (Intervention / Placebo)
}
```

---

## 2. Routing & App Entry
**File:** `src/App.jsx`
เป็นตัวจัดการ Provider และ Navigation ทั้งหมดของแอป แบ่งเป็นหน้า Home อิสระ และหน้า Form ต่างๆ ที่ถูกหุ้มด้วย `<Layout />`

**โครงสร้าง Path:**
- `/` -> `Home.jsx`
- `/admin` -> `AdminHome.jsx`
- `/admin-dashboard` -> `AdminDashboard.jsx`
- **Protected by Layout (เริ่มกระบวนการ):**
  - `/registration`
  - `/inclusion`
  - `/exclusion`
  - `/score`
  - `/result`

---

## 3. UI Shell & Components
**File:** `src/components/Layout.jsx`, `src/components/ui/ProgressBar.jsx`
- **Layout:** ทำหน้าที่เก็บ `Header` สีขาวแบบ Fixed ไว้ด้านบนสุด โดย Header นี้จะแสดง **Active Patient Record (System ID & Hospital)** หน้าที่นี้ถูกออกแบบมาเพื่อแยกส่วนประกอบ (แยก Element) ไม่ให้ UI บังเนื้อหา โดยตั้งค่า Padding อัตโนมัติและสั่ง `window.scrollTo(0, 0)` ทุกครั้งที่เปลี่ยนหน้าเพื่อแก้ปัญหาจอแสดงผลผิดตำแหน่ง
- **ProgressBar:** แสดงแถบสถานะวงกลม 5 ขั้นตอน โดยเลื่อนตามเพจลงมาได้ ไม่ล็อคติดตายน่ารำคาญ

---

## 4. Pages Detail (Flow การลงทะเบียน)

### Page 1: Patient Registration (`src/pages/Registration.jsx`)
- **หน้าที่:** รับค่า `HN` และเลือก `Hospital` จาก 7 แห่งตามสเปค
- **Function/Logic:** 
  - `handleGenerate()`: ทำการ **Anonymize ข้อมูล** ผู้ป่วยเพื่อความเป็นส่วนตัว โดยจะไม่เอาเลข HN ตรงๆ มาแสดง แต่จำลองเลขสมมุติ 4 หลักรวมกับ Hash ให้กลายเป็น System ID รูปแบบ: `[Prefix]-P[สุ่ม4หลัก]-[อักขระสุ่ม]` (เช่น `KCMH-P5921-X9A1`) ก่อนจะส่งข้อมูลทั้งหมดเข้าสู่ `PatientContext`

### Page 2: Inclusion Criteria (`src/pages/InclusionCriteria.jsx`)
- **หน้าที่:** ตรวจสอบคุณสมบัติผู้ป่วย 4 ข้อด้วยการคลิกช่อง Checkbox
- **Function/Logic:** 
  - `toggleCheck(id)`: อัปเดต Object state ว่าข้อไหนถูกติ๊กบ้าง
  - `allChecked`: บังคับว่าต้องตอบ **"ครบ 4 ข้อ"** เท่านั้น ปุ่ม "Continue" ด้านล่างจึงจะอนุญาตให้กดผ่านไปได้

### Page 3: Exclusion Criteria (`src/pages/ExclusionCriteria.jsx`)
- **หน้าที่:** ตรวจสอบข้อห้าม/โรคประจำตัว 11 ข้อที่ขัดต่อการวิจัย
- **Function/Logic:** 
  - ใช้ปุ่ม **"No"** และ **"Yes"** แยกชัดเจน โดยบังคับให้ผู้ใช้ต้องกดตอบอย่างตั้งใจทุกข้อ (`allAnswered` ต้องเป็นจริง)
  - **Disqualification Logic:** หากผู้ใช้กดเลือก "Yes" แม้แต่ข้อเดียว (`anyYes = true`) ระบบจะแสดงแถบแจ้งเตือนสีแดง "Patient is DISQUALIFIED" และปุ่ม Continue จะถูกล็อกทันที เพื่อให้ตรงตามสเปคเข้มงวด

### Page 4: SeLECT Score Calculator (`src/pages/SelectScore.jsx`)
- **หน้าที่:** คำนวณความเสี่ยงด้วยพารามิเตอร์ 5 ตัว (Severity, Atherosclerosis, Early Seizure, Cortical, MCA)
- **Function/Logic:** 
  - แต่ละปุ่มจะมีค่าคะแนน (Points) ฝังอยู่ เมื่อกดเลือก ระบบจะรวมค่า `totalScore` ให้อัตโนมัติ (เต็ม 9)
  - **Stratification:** โค้ดมีการแยกกลุ่มความเสี่ยงให้เห็นบนจอเลยทันที (`Moderate Risk (4-5)` หรือ `High/Very High Risk (6-9)`)
  - **Mock Randomization:** เมื่อกดปุ่ม ระบบจำลองของหน้าบ้านตอนนี้จะตั้งค่า `assignedArm` เป็น Intervention หรือ Placebo โดยอิงจากเปอร์เซ็นต์อย่างง่ายและส่งตัวแปรไปยังหน้าสุดท้าย

### Page 5: Randomization Result (`src/pages/RandomizationResult.jsx`)
- **หน้าที่:** หน้าแสดงผลลัพธ์สุดท้าย ยืนยันว่าคนไข้รหัส `System ID` นี้ ได้รับการจัดสรรเข้าสู่ Arm ใด พร้อมประวัติ SeLECT Score เพื่อให้แคปหน้าจอหรือจดบันทึกก่อนกดปุ่มกลับไปหน้า Home (และทำลาย Context)

---

## 5. Admin & Monitoring Portal

### Admin Login (`src/pages/AdminHome.jsx`)
- ทำหน้าที่เป็นประตูกั้น (Gateway) ให้แอดมินใส่รหัสผ่าน (ตอนนี้เป็นเพียง Mock UI รอกำหนด Authentication ทางฝั่ง Backend)

### Admin Dashboard (`src/pages/AdminDashboard.jsx`)
- **หน้าที่:** แสดงข้อมูลสรุปตัวเลขแบบ Real-time และตาราง Audit Trail ที่มีความซับซ้อนสูงมาก
- **Function/Logic:**
  - `generateMockData()`: สคริปต์สุดซับซ้อนที่จำลองข้อมูลคนไข้ 45 คนที่หลากหลาย สร้าง Timestamp สุ่มที่สมจริงเพื่อเป็นตัวแทนให้เห็นภาพก่อนว่า Backend จะส่งข้อมูลแบบไหนมา
  - **Global Statistics:** คำนวณตัวเลขและนับแขนง Intervention vs Placebo รวมถึงยอด Drop-off (คนที่ตกม้าตายหน้า 2 และ 3)
  - **SeLECT Score Analytics:** ใช้ Tailwind UI ในการทำ Bar Chart สรุปคะแนน (Frequency Breakdown 4-9) และเปอร์เซ็นต์ของ Component อัตโนมัติ
  - **Audit Trail & Anomaly Detection:** ตารางแสดงผลประวัติทุก session คอยเช็ก Timestamp `T_Start, T_Inc_Pass, T_Exc_Pass, T_Rand` และจำลอง Badge แจ้งเตือนพฤติกรรมผิดปกติอย่าง **"Fast Input ⚡"** หรือ **"Timeout ⏳"** ตามที่ Spec ร้องขอ

---

### 📝 สิ่งที่รอการพัฒนาในอนาคต (แยกให้ Backend ทำ)
1. การบันทึก Session ลจิกลง Database พร้อมจัดทำฐานข้อมูล Encryption เพื่อ Map HN ตัวจริง
2. เซิร์ฟเวอร์ API สำหรบ Admin Dashboard ดึงข้อมูล Production มาประมวลผล แทนที่ Mock Data
3. การสุ่ม (Real Allocation Algorithm) ด้วย Block Randomization ที่ฝั่งเซิร์ฟเวอร์
4. *[Frontend]* Anti-AFK Timeout 10 นาที (สามารถทำเพิ่มที่ React Hook รอบถัดไปได้) และการเช็คเปิด Tab ซ้อน (BroadcastChannel API)
