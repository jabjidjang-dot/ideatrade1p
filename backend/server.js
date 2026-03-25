import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ตั้งค่า CORS ให้รองรับการเรียกจาก Vercel
app.use(cors());
app.use(express.json());

// 1. Route เช็คสถานะเซิร์ฟเวอร์
app.get("/", (req, res) => {
  res.send("Backend Running on Render 🚀");
});

// 2. API สำหรับทดสอบระบบ
app.get("/api/test", (req, res) => {
  res.json({ message: "เชื่อมต่อหน้าบ้านกับหลังบ้านสำเร็จแล้ว! 🎉" });
});

// 3. API สำหรับขอ OTP (จุดที่หน้าบ้าน Welcome.jsx จะยิงมา)
app.post("/api/request-otp", (req, res) => {
  const { email } = req.body;
  console.log("📩 มีคนขอ OTP มาที่อีเมล:", email);

  // ในอนาคตคุณจะใส่โค้ดส่งอีเมล (Nodemailer) ตรงนี้
  // ตอนนี้ส่ง Success กลับไปก่อนเพื่อให้ Frontend ทำงานต่อได้
  res.json({ 
    success: true, 
    message: "ระบบได้รับคำขอ OTP แล้ว (จำลองการส่งอีเมลสำเร็จ)" 
  });
});

// 4. API สำหรับยืนยัน OTP (จุดที่หน้าบ้าน OtpModal.jsx จะยิงมา)
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  console.log("🔑 กำลังเช็ค OTP:", otp, "ของอีเมล:", email);

  // จำลองการตรวจสอบ: ถ้าใส่เลขอะไรมาก็ให้ผ่านไปก่อน หรือเช็คว่าเป็น 123456
  // ในระบบจริงคุณต้องดึง Token จาก Firebase Admin SDK มาส่งกลับไป
  res.json({ 
    success: true, 
    token: "mock-firebase-custom-token-for-" + email 
  });
});

// 5. API สำหรับหน้า Login (เดิมของคุณ)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("ข้อมูล Login ที่ส่งมา:", email, password);
  res.json({ success: true, message: "เข้าสู่ระบบสำเร็จ (จำลอง)" });
});

// 6. API สำหรับหน้า Register (เดิมของคุณ)
app.post("/api/register", (req, res) => {
  const userData = req.body;
  console.log("ข้อมูลสมัครสมาชิกใหม่:", userData);
  res.json({ success: true, message: "สมัครสมาชิกสำเร็จ (จำลอง)" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});