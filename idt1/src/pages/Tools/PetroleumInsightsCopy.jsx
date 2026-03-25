// src/pages/tools/PetroleumInsights.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function PetroleumInsights() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [period, setPeriod] = useState("MAX");
  const [symbol, setSymbol] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // --- [NEW] Refs สำหรับระบบเลื่อนอัตโนมัติ ---
  const scrollDirection = useRef(1); // 1 = ขวา, -1 = ซ้าย
  const isPaused = useRef(false);    // เก็บสถานะว่าเมาส์ชี้อยู่ไหม

  /* ===============================
      MEMBER CHECK
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems?.includes("petroleum")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("petroleumToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (error) {
      console.error("Error checking member status:", error);
    }
  }, []);

  /* ===============================
      SCROLL LOGIC (Manual + Auto)
  ================================ */
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;

      setShowLeft(scrollLeft > 1);
      const isEnd =
        Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 2;
      setShowRight(!isEnd);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
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
    }
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

  /* ===============================
      FEATURES DATA
  ================================ */
  const features = [
    {
      title: "WTI & Brent Tracking",
      desc: "Monitor global crude oil benchmarks in real-time.",
    },
    {
      title: "Refinery Margin",
      desc: "Track GRM changes and refining profitability instantly.",
    },
    {
      title: "Oil Fund Analysis",
      desc: "Understand government oil stabilization mechanisms.",
    },
    {
      title: "Energy Macro Signals",
      desc: "Macro-driven energy market trend detection.",
    },
    {
      title: "Gas & LNG Insights",
      desc: "Natural gas movement and global supply chain flow.",
    },
    {
      title: "Institutional Flow",
      desc: "Follow capital rotation in energy sector.",
    },
  ];

  const [symbolQuery, setSymbolQuery] = useState("");
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);

  const symbolList = [
    "BBGI","BCP","BCPG","BANPU","BGRIM","EA","ESSO",
    "GULF","IRPC","IVL","PTT","PTTEP","TOP"
  ];

  const filteredSymbols = symbolList.filter(s =>
    s.toLowerCase().includes(symbolQuery.toLowerCase())
  );

  const symbolBounceClass = !symbol ? "symbol-bounce" : "";

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
              Petroleum Insights
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop relying on crude oil prices alone
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
                src="/src/assets/images/Petroleum.png"
                alt="Petroleum Dashboard"
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
              Petroleum Insights
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Stop relying on crude oil prices alone
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
                src="/src/assets/images/Petroleum.png"
                alt="Petroleum Dashboard"
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
                localStorage.setItem("petroleumToolEntered", "true"); // 🔥 จำสถานะ
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
<style>
{`
@keyframes symbolBounce {
  0% { transform: scale(1); }
  30% { transform: scale(1.04); }
  50% { transform: scale(0.98); }
  70% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.symbol-bounce {
  animation: symbolBounce 1.8s ease-in-out infinite;
}
`}
</style>

if (isMember && enteredTool) {

  const metrics = [
    { title: "WTI CRUDE", value: 78.45, change: 1.2 },
    { title: "BRENT CRUDE", value: 82.10, change: 0.8 },
    { title: "NATURAL GAS", value: 2.45, change: -0.5 },
    { title: "USD/THB", value: 35.80, change: 0.1 },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0c111b] text-white px-6 py-6">

      <div className="max-w-[1600px] mx-auto">

        {/* ================= TOP CONTROL BAR ================= */}
        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center gap-3">

            {/* Toggle */}
            <div
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer"
            >
              <div
                className={`w-4 h-4 bg-cyan-400 rounded-full absolute top-0.5 transition-all ${
                  darkMode ? "left-0.5" : "left-5"
                }`}
              />
            </div>

            {/* Symbol */}
            <div className="relative w-56">

              {/* INPUT FIELD */}
              <div
                className={`
                  relative
                  bg-[#111827]
                  border border-slate-700
                  rounded-md
                  px-4 py-3
                  flex items-center
                  ${!symbol && !symbolQuery ? "symbol-bounce" : ""}
                `}
              >
                <input
                  value={symbolQuery}
                  onChange={(e) => {
                    setSymbolQuery(e.target.value);
                    setShowSymbolDropdown(true);
                    setSymbol(""); // clear selected when typing
                  }}
                  onFocus={() => setShowSymbolDropdown(true)}
                  placeholder=""
                  className="w-full bg-transparent outline-none text-white text-sm"
                />

                <div className="flex items-center gap-2">

                  {/* CLEAR BUTTON */}
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
                      ? "-top-2 text-xs bg-[#0c111b]"
                      : "top-1/2 -translate-y-1/2 text-sm"
                  }
                `}
              >
                Symbol*
              </label>

              {/* DROPDOWN */}
              {showSymbolDropdown && (
                <div className="absolute mt-2 w-full bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto z-50">

                  {/* List */}
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

            {/* Oil Type */}
            <select
            className="bg-[#111827] border border-slate-700 px-4 py-3 rounded-md text-sm text-white outline-none focus:border-cyan-400 w-64"
          >
            <option value="">Select oil type</option>

            <option>GASOHOL95 E10</option>
            <option>GASOHOL91</option>
            <option>GASOHOL95 E20</option>
            <option>GASOHOL95 E85</option>

            <option>H-DIESEL</option>

            <option>FO 600 (1) 2%S</option>
            <option>FO 1500 (2) 2%S</option>

            <option>LPG</option>
            <option>ULG95</option>
          </select>
          </div>

          {/* Period Buttons */}
          <div className="flex gap-2">
            {["3M","6M","1Y","YTD","MAX"].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs rounded-md border
                  ${period === p
                    ? "bg-[#1f2937] border-cyan-400 text-cyan-400"
                    : "border-slate-700 text-slate-400 hover:border-cyan-400 hover:text-cyan-400"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ================= METRIC STRIP ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          {metrics.map(m => (
            <div
              key={m.title}
              className="bg-[#111827] border border-slate-700 px-4 py-3 rounded-md text-sm text-white outline-none focus:border-cyan-400 w-72"
            >
              <p className="text-xs text-slate-400">{m.title}</p>

              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-semibold">{m.value}</p>
                <p className={`text-xs ${m.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {m.change >= 0 ? "+" : ""}{m.change}%
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BIG NUMBER CARD */}
          <div className="bg-[#111827] border border-slate-700 rounded-xl p-8 flex items-center justify-center relative">

            <div className="text-center">
              <p className="text-5xl font-bold">0.45</p>
              <p className="text-green-400 text-sm mt-2">
                ▲ 0.02 (+4.65%)
              </p>
              <p className="text-xs text-slate-500 mt-6">
                Last Update 16:30:00
              </p>
            </div>

          </div>

          <PremiumChart title="EX-REFIN" />
          <PremiumChart title="Marketing Margin" />
          <PremiumChart title="Oil Fund" step />

        </div>

      </div>
    </div>
  );
}
return null;
}

function PremiumChart({ title, step }) {

  const width = 420;
  const height = 240;

  const paddingLeft = 25;
  const paddingRight = 45;
  const paddingTop = 20;
  const paddingBottom = 30;

  const data = step
    ? [28,28,28,20,20,20,15]
    : [16.5,17.2,16.6,17.8,17.4,16.8,17.9];

  const max = Math.max(...data);
  const min = Math.min(...data);

  const normalizeY = (value) =>
    height -
    paddingBottom -
    ((value - min) / (max - min)) *
      (height - paddingTop - paddingBottom);

  const buildPath = (dataset) => {
    return dataset.reduce((path, value, i, arr) => {
      const x =
        paddingLeft +
        (i * (width - paddingLeft - paddingRight)) /
          (arr.length - 1);
      const y = normalizeY(value);

      if (i === 0) return `M ${x},${y}`;

      const prevX =
        paddingLeft +
        ((i - 1) *
          (width - paddingLeft - paddingRight)) /
          (arr.length - 1);
      const prevY = normalizeY(arr[i - 1]);

      const cp1x = prevX + (x - prevX) / 3;
      const cp2x = prevX + (x - prevX) * 2 / 3;

      return `${path} C ${cp1x},${prevY} ${cp2x},${y} ${x},${y}`;
    }, "");
  };

  const gradientId = `area-${title.replace(/\s/g, "")}`;

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-5">

      <p className="text-xs text-slate-400 mb-4">{title}</p>

      <div className="relative w-full h-[240px] bg-[#0f172a] rounded-xl overflow-hidden">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/5 select-none">
          {title}
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">

          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35"/>
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
            </linearGradient>
          </defs>

          {/* GRID */}
          {[...Array(6)].map((_, i) => {
            const y =
              paddingTop +
              (i * (height - paddingTop - paddingBottom)) /
                5;
            return (
              <line
                key={i}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1f2937"
                strokeOpacity="0.4"
                strokeWidth="0.8"
              />
            );
          })}

          {/* BASELINE */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="#374151"
            strokeWidth="1"
          />

          {/* STEP STYLE */}
          {step ? (
            <>
              <path
                d={`M ${paddingLeft},${normalizeY(data[0])}
                   H ${paddingLeft + (width - paddingLeft - paddingRight)/3}
                   V ${normalizeY(data[3])}
                   H ${paddingLeft + (width - paddingLeft - paddingRight)*0.75}
                   V ${normalizeY(data[6])}
                   H ${width - paddingRight}`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.8"
              />
            </>
          ) : (
            <>
              {/* AREA */}
              <path
                d={`${buildPath(data)}
                   L ${width - paddingRight},${height - paddingBottom}
                   L ${paddingLeft},${height - paddingBottom} Z`}
                fill={`url(#${gradientId})`}
              />

              {/* LINE */}
              <path
                d={buildPath(data)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.8"
              />
            </>
          )}

          {/* Y AXIS */}
          {[...Array(5)].map((_, i) => {
            const value =
              max - ((max - min) / 4) * i;
            const y =
              paddingTop +
              (i * (height - paddingTop - paddingBottom)) /
                4;

            return (
              <text
                key={i}
                x={width - 5}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#6b7280"
              >
                {value.toFixed(1)}
              </text>
            );
          })}

        </svg>

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      </div>
    </div>
  );
}