# 📌 Idea Trade 1 Project

เว็บแอปพลิเคชันฝั่ง **Frontend** สำหรับแพลตฟอร์ม Idea Trade
พัฒนาด้วย **React + Vite** โดยใช้ **Tailwind CSS ควบคู่กับ Material UI (MUI)**
ออกแบบให้เป็นโครงสร้างแบบ Component-based รองรับ Responsive และต่อยอดฟีเจอร์ได้ง่าย

---

## 🎯 Project Objective

* สร้าง Landing Page และ Dashboard สำหรับแพลตฟอร์ม Idea Trade
* รองรับผู้ใช้ทั่วไป (Guest) และสมาชิก (Membership)
* แยก Layout ตามสถานะผู้ใช้ (ก่อน / หลัง Login)
* รองรับการพัฒนาเป็น SaaS / Trading Platform ในอนาคต

---

## 🛠 Tech Stack

* **React.js** – Frontend Library
* **Vite** – Development Server & Build Tool
* **Tailwind CSS** – Utility-first CSS Framework
* **Material UI (MUI)** – UI Component Framework
* **Emotion** – Styling Engine สำหรับ MUI
* **JavaScript (ES6+)**

> 🔎 แนวคิดหลักของโปรเจค
>
> * **Tailwind CSS** → layout, spacing, responsive, utility styles
> * **MUI** → component ที่มี logic (Button, Dialog, Layout, Form ฯลฯ)

---

## 📁 โครงสร้างโปรเจค (Project Structure)

```txt
src/
├─ assets/
│  ├─ images/                  # รูปภาพ (logo, icon, banner)
│  └─ styles/
│     └─ index.css             # Tailwind base / components / utilities
│
├─ components/                 # Reusable Components
│  ├─ buttons/
│  │  └─ PrimaryButton.jsx
│  │
│  ├─ cards/
│  │  └─ ProjectCard.jsx
│  │
│  └─ common/
│     └─ Logo.jsx              # Component กลาง เช่น Logo
│
├─ layouts/                    # Layout หลักของแต่ละกลุ่มหน้า
│  ├─ PublicLayout.jsx         # Landing / Welcome / Register
│  └─ DashboardLayout.jsx      # Layout หลัง Login
│
├─ pages/                      # Page ตาม Route
│  ├─ Landing/
│  │  └─ Landing.jsx           # หน้า Landing Page
│  │
│  ├─ Welcome/
│  │  └─ Welcome.jsx           # หน้า Welcome
│  │
│  ├─ Register/
│  │  └─ Register.jsx          # สมัครผู้ใช้ทั่วไป
│  │
│  ├─ MemberRegister/
│  │  └─ MemberRegister.jsx    # สมัครสมาชิก (Membership)
│  │
│  └─ Dashboard/
│     └─ Dashboard.jsx         # หน้า Dashboard
│
├─ routes/
│  └─ AppRoutes.jsx            # กำหนด Routing ของระบบ
│
├─ theme/
│  ├─ theme.js                 # Theme กลาง (สี / config)
│  └─ muiTheme.js              # MUI Theme
│
├─ App.jsx                     # Root Component
└─ main.jsx                    # Entry Point + Provider ต่าง ๆ
```

---

## 🎨 Tailwind CSS Configuration

### 📦 Packages ที่ใช้

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### ⚙️ tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

### 🧩 การใช้งาน Tailwind ในโปรเจค

**src/assets/styles/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

และ import ใน `main.jsx`

```jsx
import "@/assets/styles/index.css";
```

---

## 🤝 การใช้ Tailwind CSS ร่วมกับ MUI

โปรเจคนี้ใช้ **Tailwind + MUI ร่วมกัน** โดยมีแนวทางดังนี้

### ✅ แนวทางที่แนะนำ

* Tailwind → layout, spacing, responsive
* MUI → component ที่มี interaction / logic
* ใช้ theme กลางร่วมกัน (สีเดียวกันทั้งระบบ)

### 🧪 ตัวอย่างการใช้งานร่วมกัน

```jsx
import { Button } from "@mui/material";

<Button
  variant="contained"
  className="!rounded-xl !px-6 !py-3"
>
  Submit
</Button>
```

> ℹ️ ใช้ `!` (important) เพื่อ override style ของ MUI เมื่อจำเป็น

---

🔥 Firebase Integration

โปรเจคนี้ใช้ Firebase สำหรับระบบ Authentication และสามารถต่อยอดไปใช้ Firestore / Storage ได้ในอนาคต

📦 Firebase Packages

ติดตั้ง Firebase SDK

npm install firebase

⚙️ Firebase Project Setup

ไปที่ Firebase Console

สร้าง Project ใหม่

เพิ่ม Web App (</>)

คัดลอก Firebase Config

🔐 Firebase Configuration

สร้างไฟล์

src/firebase.js

📄 ตัวอย่าง firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config (ใช้ env เพื่อความปลอดภัย)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

🌱 Environment Variables (.env)

สร้างไฟล์ .env ที่ root ของโปรเจค

VITE_FIREBASE_API_KEY=xxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxx
VITE_FIREBASE_PROJECT_ID=xxxxxxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxxxxxx


⚠️ ห้าม commit .env ขึ้น GitHub
ควรเพิ่มใน .gitignore

.env

🔑 Firebase Authentication
✅ เปิดใช้งาน Google Sign-In

Firebase Console → Authentication

ไปที่แท็บ Sign-in method

เปิด Google

Save

🧪 ตัวอย่างการใช้งาน Google Login
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google User:", user);
  } catch (error) {
    console.error(error);
  }
};

---

## 🚀 การรันโปรเจค

```bash
npm install
npm run dev
```

เปิดเว็บที่:

```
http://localhost:5173
```
