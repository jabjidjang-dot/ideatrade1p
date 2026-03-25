import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [accessData, setAccessData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isFreeAccess, setIsFreeAccess] = useState(false);
  
  // 🟢 1. เพิ่ม State สำหรับเก็บข้อมูล User ที่ล็อกอินแล้ว
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    let unsubscribeDoc = null; 

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      
      // 🟢 2. เซ็ตค่า User ลง State เพื่อให้หน้าอื่นดึงไปใช้ได้
      setCurrentUser(user); 

      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (user) {
        setIsFreeAccess(false);
        setLoading(true);
        
        const handleFallbackLocalData = () => {
          const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
          if (savedProfile.role === "member") {
            const futureDate = Date.now() + (30 * 24 * 60 * 60 * 1000); 
            setAccessData({ fortune: futureDate }); 
          } else {
            setAccessData({});
          }
        };

        try {
          const docRef = doc(db, 'users', user.uid);
          
          unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              setAccessData(docSnap.data().subscriptions || {});
            } else {
              handleFallbackLocalData();
            }
            setLoading(false);
          }, (error) => {
            console.error("Error fetching subscriptions realtime:", error);
            handleFallbackLocalData();
            setLoading(false);
          });

        } catch (error) {
          console.error("Catch error setting up snapshot:", error);
          handleFallbackLocalData();
          setLoading(false);
        }
      } else {
        setIsFreeAccess(true);
        setAccessData({});
        
        const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        if (savedProfile.role === "free") {
          setIsFreeAccess(true);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc(); 
    };
  }, []);

  return (
    // 🟢 3. เพิ่ม currentUser เข้าไปใน value เพื่อแจกจ่ายให้ Component อื่น
    <SubscriptionContext.Provider value={{ accessData, loading, isFreeAccess, currentUser }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);