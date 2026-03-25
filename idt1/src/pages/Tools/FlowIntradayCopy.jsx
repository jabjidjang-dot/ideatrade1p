// src/pages/tools/FlowIntraday.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function FlowIntraday() {

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [layout, setLayout] = useState("4");
  const [symbols, setSymbols] = useState(Array(12).fill(""));

  const boxes = Array.from({ length: 12 });

  // ===== Deterministic Mock Chart Generator =====
  const generateSeededData = (symbol, points = 40) => {
    let seed = 0;

    // สร้าง seed จากตัวอักษรในชื่อ symbol
    for (let i = 0; i < symbol.length; i++) {
      seed += symbol.charCodeAt(i);
    }

    const data = [];
    let value = 100 + (seed % 20);

    for (let i = 0; i < points; i++) {
      const random = Math.sin(seed + i) * 10000;
      const change = (random - Math.floor(random)) * 4 - 2;
      value += change;
      data.push(value);
    }

    return data;
  };

  const chartData = useMemo(() => {
    return symbols.map((symbol) =>
      symbol ? generateSeededData(symbol) : null
    );
  }, [symbols]);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // --- [NEW] Refs สำหรับระบบเลื่อนอัตโนมัติ ---
  const scrollDirection = useRef(1); // 1 = ขวา, -1 = ซ้าย
  const isPaused = useRef(false);    // เก็บสถานะว่าเมาส์ชี้อยู่ไหม

  /* ================= MEMBER CHECK ================= */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems?.includes("flow")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("flowToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* ================= SCROLL LOGIC (Manual + Auto) ================= */
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } =
      scrollContainerRef.current;

    setShowLeft(scrollLeft > 1);
    setShowRight(
      Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2
    );
  };

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;

    // [NEW] หยุด Auto ชั่วคราวเมื่อกดปุ่ม
    isPaused.current = true;

    const { current } = scrollContainerRef;
    const scrollAmount = 350;

    if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        scrollDirection.current = -1; // อัปเดตทิศทาง Auto เป็นซ้าย
    } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        scrollDirection.current = 1;  // อัปเดตทิศทาง Auto เป็นขวา
    }

    setTimeout(checkScroll, 300);
    
    // [NEW] ให้ Auto ทำงานต่อหลังจากกดปุ่มไปสักพัก (0.5 วิ)
    setTimeout(() => { isPaused.current = false }, 500);
  };

  // [NEW] Auto Scroll Effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    
    // ถ้าหา container ไม่เจอ (เช่น อยู่หน้า Dashboard) ให้จบ
    if (!container) return;

    const speed = 1;         // ความเร็ว (pixel)
    const intervalTime = 15; // ความถี่ (ms)

    const autoScrollInterval = setInterval(() => {
      // ถ้าเมาส์ชี้อยู่ (Pause) หรือ Container หายไป ให้ข้ามรอบนี้
      if (isPaused.current || !container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      // ตรวจสอบการชนขอบ เพื่อกลับทิศ
      if (scrollDirection.current === 1 && Math.ceil(scrollLeft) >= maxScroll - 2) {
        scrollDirection.current = -1; // ชนขวา -> เด้งกลับซ้าย
      } else if (scrollDirection.current === -1 && scrollLeft <= 2) {
        scrollDirection.current = 1;  // ชนซ้าย -> เด้งกลับขวา
      }

      // สั่งเลื่อน
      container.scrollLeft += (scrollDirection.current * speed);
      
      // อัปเดตปุ่มลูกศร
      checkScroll();
    }, intervalTime);

    return () => clearInterval(autoScrollInterval);
  }, [isMember, enteredTool]); // รันใหม่เมื่อเปลี่ยนหน้า View

  // Resize Listener
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const features = [
    {
      title: "Multi-Asset Flow Monitor",
      desc: "Monitor up to 12 stocks at once in a powerful grid layout.",
    },
    {
      title: "Smart Flow Alerts",
      desc: "Set custom triggers and receive instant notifications.",
    },
    {
      title: "Customizable Layout",
      desc: "Switch layouts and adapt to your trading style.",
    },
  ];

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  ========================================================== */
  if (!isMember) {
     return (
    <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Style ซ่อน Scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              Flow Intraday
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Turn your trading screen into an elite surveillance system
          </p>
        </div>

        {/* --- Dashboard Image --- */}
        <div className="relative group w-full max-w-5xl mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>

            <div className="aspect-[16/9] w-full bg-[#0B1221] relative overflow-hidden group">
              <img
                src="/src/assets/images/Flow.png"
                alt="Flow Intraday Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section (Scroll Layout) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            3 Main Features
          </h2>

          {/* [NEW] Wrapper for Pause on Hover */}
          <div 
            className="relative group"
            onMouseEnter={() => isPaused.current = true}
            onMouseLeave={() => isPaused.current = false}
          >
            
            {/* 1. ปุ่มซ้าย */}
            <button 
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 
                          w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                          hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                          hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                          flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                          active:scale-95
                          ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              aria-label="Scroll Left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 2. Scroll Container (Removed snap-x, scroll-smooth for Auto Scroll) */}
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll} 
              className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar"
              style={scrollbarHideStyle}
            >
              {features.map((item, index) => (
                <div
                  key={index}
                  className="
                      w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300
                  "
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 3. ปุ่มขวา */}
            <button 
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 
                          w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                          hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                          hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                          flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                          active:scale-95
                          ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              aria-label="Scroll Right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

        {/* --- CTA Buttons --- */}
        <div className="text-center w-full max-w-md mx-auto mt-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full md:w-auto px-8 py-3 rounded-full bg-slate-800 text-white font-semibold border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all duration-300"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/member-register")}
              className="w-full md:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:brightness-110 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Join Membership
            </button>
          </div>
        </div>

      </div>
    </div>
  );
  }

  /* ==========================================================
      CASE 2 : START SCREEN (MEMBER BUT NOT ENTERED)
  ========================================================== */
  if (isMember && !enteredTool) {
     return (
    <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Style ซ่อน Scrollbar */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
              Flow Intraday
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Turn your trading screen into an elite surveillance system
          </p>
        </div>

        {/* --- Dashboard Image --- */}
        <div className="relative group w-full max-w-5xl mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
          
          <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#0f172a] px-4 py-3 flex items-center justify-between border-b border-slate-700/50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
            </div>

            <div className="aspect-[16/9] w-full bg-[#0B1221] relative overflow-hidden group">
              <img
                src="/src/assets/images/Flow.png"
                alt="Flow Intraday Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section (Scroll Layout) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            3 Main Features
          </h2>

          {/* [NEW] Wrapper for Pause on Hover */}
          <div 
            className="relative group"
            onMouseEnter={() => isPaused.current = true}
            onMouseLeave={() => isPaused.current = false}
          >
            
            {/* 1. ปุ่มซ้าย */}
            <button 
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-20 z-20 
                          w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                          hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                          hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                          flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                          active:scale-95
                          ${showLeft ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
              aria-label="Scroll Left"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 2. Scroll Container (Removed snap-x, scroll-smooth for Auto Scroll) */}
            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll} 
              className="flex overflow-x-auto gap-6 py-4 px-1 hide-scrollbar"
              style={scrollbarHideStyle}
            >
              {features.map((item, index) => (
                <div
                  key={index}
                  className="
                      w-[350px] md:w-[400px] flex-shrink-0 snap-center
                      group/card bg-[#0f172a]/60 border border-slate-700/50 p-8 rounded-xl 
                      hover:bg-[#1e293b]/60 hover:border-cyan-500/30 transition duration-300
                  "
                >
                  <h3 className="text-xl font-bold text-white mb-3 group-hover/card:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* 3. ปุ่มขวา */}
            <button 
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-20 z-20 
                          w-12 h-12 rounded-2xl bg-[#0f172a]/90 border border-slate-600 text-white 
                          hover:bg-cyan-500 hover:border-cyan-400 hover:text-white 
                          hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] 
                          flex items-center justify-center transition-all duration-300 backdrop-blur-sm
                          active:scale-95
                          ${showRight ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
              aria-label="Scroll Right"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

          </div>
        </div>

        {/* --- CTA Buttons --- */}
       <div className="flex gap-4">
           <button
             onClick={() => {
               setEnteredTool(true);
               localStorage.setItem("flowToolEntered", "true"); // 🔥 จำสถานะ
             }}
             className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-105 transition-all duration-300"
           >
             <span className="mr-2">Start Using Tool</span>
             <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
             </svg>
           </button>
         </div>

      </div>
    </div>
  );
  }

  /* ==========================================================
      CASE 3 : FULL PRODUCTION PETROLEUM DASHBOARD
  ========================================================== */

  const normalizeData = (data, height = 150) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  const handleSymbolChange = (index, value) => {
  const updated = [...symbols];
  updated[index] = value;
  setSymbols(updated);
};

  return (
    <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">

      <div className="max-w-[1600px] mx-auto">

        {/* ================= TOP CONTROL BAR ================= */}
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-6">

            {/* Select Layout */}
            <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 px-4 py-2 rounded-lg">
              <span className="text-sm text-slate-400">
                Select Layout :
              </span>

              <div className="flex gap-2">
                {["4", "3", "2"].map((col) => (
                  <button
                    key={col}
                    onClick={() => setLayout(col)}
                    className={`w-7 h-7 rounded text-xs flex items-center justify-center transition
                      ${
                        layout === col
                          ? "bg-purple-600 text-white"
                          : "bg-[#1f2937] text-slate-400 hover:text-white"
                      }`}
                  >
                    {col === "4" ? "▦" : col === "3" ? "▤" : "☰"}
                  </button>
                ))}
              </div>
            </div>

            {/* Price / Value */}
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>Price</span>
              <div className="w-8 h-[2px] bg-white"></div>
              <span>Value</span>
              <div className="flex gap-1">
                <div className="w-3 h-[2px] bg-green-400"></div>
                <div className="w-3 h-[2px] bg-red-400"></div>
              </div>
            </div>

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <select className="bg-[#111827] border border-slate-700 px-4 py-2 rounded-lg text-sm">
              <option>Favorites</option>
              <option>SET50</option>
              <option>Energy</option>
            </select>

            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold">
              ♥ ADD
            </button>
          </div>
        </div>

        {/* ================= GRID ================= */}
        <div
          className={`
            grid gap-5 transition-all duration-300
            ${
              layout === "4"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : layout === "3"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2"
            }
          `}
        >
          {boxes.map((_, index) => (
            <div
              key={index}
              className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden hover:border-slate-500 transition"
            >

              <div className="flex items-center justify-between px-3 py-2 bg-[#0f172a] border-b border-slate-700">

                <select
                  value={symbols[index]}
                  onChange={(e) => handleSymbolChange(index, e.target.value)}
                  className="bg-transparent text-xs text-slate-400 outline-none"
                >
                  <option value="">Symbol...</option>
                  <option value="PTT">PTT</option>
                  <option value="TOP">TOP</option>
                  <option value="DELTA">DELTA</option>
                </select>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Notify</span>

                  <select className="bg-[#1f2937] px-2 py-0.5 rounded text-xs">
                    <option>Flow</option>
                    <option>Price</option>
                  </select>

                  <span className="cursor-pointer hover:text-white">🔔</span>
                  <span className="cursor-pointer hover:text-white">🔄</span>
                </div>

              </div>

              <div className="h-[180px] bg-[#0b1220] relative flex items-center justify-center">

              {!symbols[index] ? (
                <div className="text-slate-600 text-sm">
                  Select Symbol to View Chart
                </div>
              ) : (
                (() => {
                  const data = chartData[index];
                  const points = normalizeData(data);
                  const isUp = data[data.length - 1] >= data[0];

                  return (
                    <svg
                      viewBox="0 0 100 150"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={isUp ? "#22c55e" : "#ef4444"} stopOpacity="0.4"/>
                          <stop offset="100%" stopColor="transparent"/>
                        </linearGradient>
                      </defs>

                      <polygon
                        fill={`url(#grad-${index})`}
                        points={`0,150 ${points} 100,150`}
                      />

                      <polyline
                        fill="none"
                        stroke={isUp ? "#22c55e" : "#ef4444"}
                        strokeWidth="2"
                        points={points}
                      />
                    </svg>
                  );
                })()
              )}

            </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}