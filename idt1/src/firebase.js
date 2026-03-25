// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  // ⚠️ เอาค่าของจริงจาก Firebase Console มาใส่ในช่องที่มีคำว่า "ใส่_..." นะครับ
  apiKey: "AIzaSyCBUZescPs_vvKwLy_lK_YvMilDPgQUYh4",
  authDomain: "ideatrade-9548f.firebaseapp.com",
  projectId: "ideatrade-9548f",
  storageBucket: "ideatrade-9548f.firebasestorage.app",
  messagingSenderId: "85469723841",
  appId: "1:85469723841:web:48e10083ce04af49fa6840",
  measurementId: "G-17CV8CYLXE"
};

// 🌟🌟 1. บรรทัดนี้สำคัญมาก! ต้องสร้าง app ก่อน
const app = initializeApp(firebaseConfig);



// 🌟🌟 2. ค่อยเอา app ไปใช้งานในคำสั่งอื่นๆ ด้านล่างนี้
export const auth = getAuth(app);
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();
export const functions = getFunctions(app);

// 🌟🌟 3. ตั้งค่าเชื่อมต่อ Emulator (สำหรับส่ง OTP)
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
  try {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    console.log("🚀 Connected to Firebase Functions Emulator");
  } catch (error) {
    console.log("⚡ Firebase Emulators already connected.");
  }
}