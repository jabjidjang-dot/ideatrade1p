// src/pages/tools/RubberThai.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function RubberThai() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [period, setPeriod] = useState("MAX");
  const [symbol, setSymbol] = useState("");
  const [symbolQuery, setSymbolQuery] = useState("");
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const symbolList = [
    "STA",
    "NER",
    "TRUBB",
    "STGT",
    "24CS",
    "CMAN",
    "TEGH"
  ];

  const filteredSymbols = symbolList.filter(s =>
    s.toLowerCase().includes(symbolQuery.toLowerCase())
  );

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

        if (user.unlockedItems?.includes("rubber")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("rubberToolEntered");
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
      title: "Stock vs Commodity Correlation",
      desc: "Compare stock performance against global rubber prices.",
    },
    {
      title: "Cycle Identification",
      desc: "Map rubber supercycle stages clearly.",
    },
    {
      title: "Leading Indicator Analysis",
      desc: "Forecast earnings using commodity trends.",
    },
    {
      title: "Divergence Detection",
      desc: "Detect mispricing before correction.",
    },
  ];

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  =========================================================== */
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
              Rubber Thai
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop trading in the dark
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
                src="/src/assets/images/Rubber.png"
                alt="Rubber Thai Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section (Scroll Layout) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            4 Main Features
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
  =========================================================== */
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
              Rubber Thai
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop trading in the dark
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
                src="/src/assets/images/Rubber.png"
                alt="Rubber Thai Dashboard"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.01] transition duration-500 ease-out"
              />
            </div>
          </div>
        </div>

        {/* --- Features Section (Scroll Layout) --- */}
        <div className="w-full max-w-5xl mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
            4 Main Features
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
          <button
            onClick={() => {
              setEnteredTool(true);
              localStorage.setItem("rubberToolEntered", "true"); // 🔥 จำสถานะ
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

  const metrics = [
    { title: "RSS3 (BKK)", value: 78.50, change: 1.2 },
    { title: "TSR20 (SGX)", value: 162.4, change: -0.5 },
    { title: "CUP LUMP", value: 45.20, change: 0.5 },
    { title: "EXCHANGE RATE", value: 35.85, change: 0.0 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">
      <div className="max-w-[1500px] mx-auto">

        {/* ================= TOP SEARCH BAR ================= */}
        <div className="relative flex items-center justify-between mb-6">

          {/* Left */}
          <div className="flex items-center gap-4">

            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white transition"
            >
              ←
            </button>

           {/* CENTER SYMBOL */}
            <div className="absolute left-1/2 -translate-x-1/2">

              <div className="relative w-64">

                {/* INPUT BOX */}
                <div
                  className="
                    relative
                    bg-[#111827]
                    border border-slate-700
                    rounded-md
                    px-4 py-3
                    flex items-center
                  "
                >
                  <input
                    value={symbolQuery}
                    onChange={(e) => {
                      setSymbolQuery(e.target.value);
                      setShowSymbolDropdown(true);
                      setSymbol("");
                    }}
                    onFocus={() => setShowSymbolDropdown(true)}
                    className="w-full bg-transparent outline-none text-white text-sm"
                  />

                  <div className="flex items-center gap-2">

                    {(symbol || symbolQuery) && (
                      <button
                        onClick={() => {
                          setSymbol("");
                          setSymbolQuery("");
                        }}
                        className="text-slate-400 hover:text-white text-xs ml-2"
                      >
                        ✕
                      </button>
                    )}

                    <span
                      onClick={() => setShowSymbolDropdown(!showSymbolDropdown)}
                      className="text-slate-400 text-xs ml-2 cursor-pointer"
                    >
                      ▾
                    </span>
                  </div>
                </div>

                {/* FLOATING LABEL */}
                <label
                  className={`
                    absolute left-4 px-2 transition-all duration-200 pointer-events-none
                    ${
                      symbol || symbolQuery || showSymbolDropdown
                        ? "-top-2 text-xs bg-[#0b111a]"
                        : "top-1/2 -translate-y-1/2 text-sm"
                    }
                  `}
                >
                </label>

                {/* DROPDOWN */}
                {showSymbolDropdown && (
                  <div className="absolute mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50">
                    {filteredSymbols.length > 0 ? (
                      filteredSymbols.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSymbol(item);
                            setSymbolQuery(item);
                            setShowSymbolDropdown(false);
                          }}
                          className="px-4 py-2 text-sm text-slate-300 hover:bg-cyan-500 hover:text-white cursor-pointer transition"
                        >
                          {item}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-slate-500">
                        No results
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Toggle */}
          <div
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-5 bg-yellow-400 rounded-full relative cursor-pointer"
          >
            <div className="w-4 h-4 bg-black rounded-full absolute top-0.5 right-0.5"></div>
          </div>
        </div>

        {/* ================= METRIC STRIP ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="bg-[#111827] border border-slate-700 rounded-lg p-4"
            >
              <p className="text-xs text-slate-400">{m.title}</p>

              <div className="flex justify-between mt-2">
                <p className="text-sm font-semibold">{m.value}</p>
                <p
                  className={`text-xs ${
                    m.change > 0
                      ? "text-green-400"
                      : m.change < 0
                      ? "text-red-400"
                      : "text-slate-400"
                  }`}
                >
                  {m.change > 0 ? "+" : ""}
                  {m.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CHART SECTION ================= */}

        {/* TOP LARGE CHART */}
        <div className="bg-[#111827] border border-slate-700 rounded-xl p-6 mb-6">

          <p className="text-xs text-slate-400 mb-4">
            CLOSE (24CS)
          </p>

          <div className="relative w-full h-[350px] bg-[#0f172a] rounded-lg overflow-hidden">

            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full">

              <defs>
                <linearGradient id="greenArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                </linearGradient>
              </defs>

              <path
                d="M0 28 Q15 20 25 30 T45 18 T60 25 T80 15 T100 20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.5"
                className="drop-shadow-[0_0_8px_#22c55e]"
              />

              <path
                d="M0 28 Q15 20 25 30 T45 18 T60 25 T80 15 T100 20 V40 H0 Z"
                fill="url(#greenArea)"
              />
            </svg>

          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="bg-[#111827] border border-slate-700 rounded-xl p-6">

          <p className="text-xs text-slate-400 mb-4">
            Rubber Thai Price
          </p>

          <div className="relative w-full h-[300px] bg-[#0f172a] rounded-lg overflow-hidden">

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <svg viewBox="0 0 100 40" className="absolute inset-0 w-full h-full">

              <defs>
                <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#facc15" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0"/>
                </linearGradient>
              </defs>

              <path
                d="M0 30 Q20 28 35 18 T55 26 T75 20 T100 29"
                fill="none"
                stroke="#facc15"
                strokeWidth="1.5"
              />

              <path
                d="M0 30 Q20 28 35 18 T55 26 T75 20 T100 29 V40 H0 Z"
                fill="url(#yellowArea)"
              />
            </svg>

          </div>
        </div>

      </div>
    </div>
  );
}

/* ==========================================================
   REUSABLE PREVIEW SECTION
========================================================== */

function PreviewSection({
  title,
  subtitle,
  image,
  features,
  scrollContainerRef,
  scroll,
  checkScroll,
  showLeft,
  showRight,
  navigate,
  isMember,
  onStart
}) {
  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden pb-20">

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-slate-400">{subtitle}</p>
        </div>

        <div className="w-full max-w-5xl mb-12">
          <div className="relative">
            <button
              onClick={() => scroll("left")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 ${
                showLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >◀</button>

            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex overflow-x-auto gap-6 py-4"
              style={scrollbarHideStyle}
            >
              {features.map((item, index) => (
                <div
                  key={index}
                  className="w-[350px] flex-shrink-0 bg-[#0f172a] border border-slate-700 p-6 rounded-xl"
                >
                  <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll("right")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 ${
                showRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >▶</button>
          </div>
        </div>

        <div>
          {isMember ? (
            <button
              onClick={onStart}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold"
            >
              Start Using Tool
            </button>
          ) : (
            <button
              onClick={() => navigate("/member-register")}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold"
            >
              Join Membership
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   PREMIUM CHART
========================================================== */

function PremiumChart({ title, step }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl p-5">
      <p className="text-xs text-slate-400 mb-4">{title}</p>

      <div className="h-[230px] bg-[#0f172a] rounded-xl flex items-center justify-center text-slate-500">
        Chart Placeholder
      </div>
    </div>
  );
}