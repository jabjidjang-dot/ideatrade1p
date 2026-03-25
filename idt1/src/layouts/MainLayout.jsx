// idt1/src/layouts/MainLayout.jsx
import React, { useEffect } from 'react';
// ✅ นำเข้า Firebase functions ที่จำเป็น
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // ตรวจสอบ path ให้ตรงกับไฟล์ firebase.js ของคุณ

export default function MainLayout({ children }) {
  
  useEffect(() => {
    // ดักจับการเปลี่ยนแปลงสถานะเมื่อมีการ Login หรือ Logout
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. ถ้ามีคนล็อกอินอยู่ ให้ไปดึงข้อมูล Profile ล่าสุดจาก Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            
            // 2. เซฟข้อมูลลง localStorage เพื่อให้ Sidebar และ Dashboard ดึงไปแสดงสถานะได้ถูกต้อง
            localStorage.setItem("userProfile", JSON.stringify({
              uid: user.uid,
              ...userData
            }));
            
            // (Optional) หากต้องการให้หน้าเว็บอัปเดต UI ทันที อาจจะใช้การ dispatch event เพื่อบอก component อื่นๆ
            window.dispatchEvent(new Event("storage"));
          }
        } catch (error) {
          console.error("Error fetching user data in MainLayout:", error);
        }
      } else {
        // 3. ถ้าไม่มีคนล็อกอิน (Sign out) ให้ล้างข้อมูลทิ้ง เพื่อป้องกันข้อมูลค้าง
        localStorage.removeItem("userProfile");
        window.dispatchEvent(new Event("storage"));
      }
    });

    // Cleanup listener 
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-bg-main text-text-main flex overflow-hidden">
      <main className="flex-1 w-full relative">
        {children}
      </main>
    </div>
  );
}