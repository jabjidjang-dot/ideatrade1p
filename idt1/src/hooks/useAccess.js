import { useState, useEffect } from "react";
import { auth, db } from "@/firebase"; // ตรวจสอบ path ให้ตรงกับโปรเจกต์คุณ
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAccess(toolId) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // ฟังก์ชันเช็คว่าปลดล็อกเครื่องมือนี้หรือยัง
    const checkAccess = (unlockedItems, role) => {
      if (!toolId) return role === "member" || role === "membership";
      return role === "member" || role === "membership" || unlockedItems.includes(toolId);
    };

    // โหลดข้อมูล Demo (ไม่ได้ล็อกอิน)
    const loadDemoProfile = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        const userData = JSON.parse(saved);
        const subscriptions = userData.mySubscriptions || [];
        const unlockedFromSubs = subscriptions.map(sub => sub.id); 
        const explicitUnlocked = userData.unlockedItems || [];
        const combinedUnlocked = [...new Set([...explicitUnlocked, ...unlockedFromSubs])];
        
        setHasAccess(checkAccess(combinedUnlocked, userData.role));
      } else {
        setHasAccess(false);
      }
    };

    // ดักจับสถานะ Login และดึงข้อมูลจาก Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            const subscriptions = userData.mySubscriptions || [];
            const unlockedFromSubs = subscriptions.map(sub => sub.id); 
            const explicitUnlocked = userData.unlockedItems || [];
            const combinedUnlocked = [...new Set([...explicitUnlocked, ...unlockedFromSubs])];
            
            setHasAccess(checkAccess(combinedUnlocked, userData.role));
          }
        } catch (err) {
          console.error("Error fetching Firestore:", err);
        }
      } else {
        setIsLoggedIn(false);
        loadDemoProfile();
      }
    });

    window.addEventListener("storage", loadDemoProfile);
    
    return () => {
      unsubscribe();
      window.removeEventListener("storage", loadDemoProfile);
    };
  }, [toolId]); // ทำงานใหม่ทุกครั้งที่ toolId เปลี่ยน

  return { isLoggedIn, hasAccess };
}