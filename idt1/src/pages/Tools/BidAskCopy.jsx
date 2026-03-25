// src/pages/tools/BidAsk.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none'
};

export default function BidAsk() {
  const navigate = useNavigate();

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);
  const [timeframe, setTimeframe] = useState("Day");

  const scrollContainerRef = useRef(null);
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

        if (user.unlockedItems?.includes("bidask")) {
          setIsMember(true);

          const hasEntered = sessionStorage.getItem("BidAskToolEntered");
          if (hasEntered === "true") {
            setEnteredTool(true);
          }
        }
      }
    } catch (error) {
      console.error(error);
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

  // Resize Listener (รวมไว้ที่เดียว)
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const features = [
    {
      title: "Historical Market Replay",
      desc: "Replay market tick-by-tick to analyze order flow impact."
    },
    {
      title: "Supply & Demand Profiling",
      desc: "Analyze order density at every price level."
    },
    {
      title: "Comparative Liquidity View",
      desc: "Compare liquidity between assets side-by-side."
    },
    {
      title: "Momentum Visualization",
      desc: "Visualize bid/ask pressure over time."
    }
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
              BidAsk
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Deciphering "Big Money" through Order Flow Intelligence
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
                src="/src/assets/images/BidAsk.png"
                alt="Bid Ask Dashboard Preview"
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
                      w-[350px] md:w-[400px] flex-shrink-0
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
              BidAsk
            </span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-light">
            Deciphering "Big Money" through Order Flow Intelligence
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
                src="/src/assets/images/BidAsk.png"
                alt="Bid Ask Dashboard Preview"
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

            {/* 2. Scroll Container */}
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
                      w-[350px] md:w-[400px] flex-shrink-0
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
                localStorage.setItem("BidAskToolEntered", "true"); 
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

return (
  <div className="w-full min-h-screen bg-[#0b111a] text-white px-6 py-6">
    <div className="max-w-[1800px] mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span>📊</span>
          <span>BidAsk Replay</span>
        </div>

        <button className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded">
          Sync Panels
        </button>
      </div>

      {/* TWO PANELS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <ReplayPanel />
        <ReplayPanel />

      </div>

    </div>
  </div>
);
}

// Sub-components
function Badge({ label, value, color }) {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    red: "text-red-400",
  };

  return (
    <div className="flex items-center gap-2 bg-[#111827] border border-slate-700 px-4 py-2 rounded-full">
      <span className="text-xs text-slate-400">{label}</span>
      <span className={`text-sm font-semibold ${colors[color]}`}>
        {value}
      </span>
    </div>
  );
}

function ChartCard({ title }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-[#0f172a] border-b border-slate-700 text-sm text-slate-300">
        {title}
      </div>
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        Chart Area
      </div>
    </div>
  );
}

function ReplayPanel() {

const [startTime, setStartTime] = useState("00:00");
const [endTime, setEndTime] = useState("00:00");

  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);

  const [orderBook, setOrderBook] = useState([]);

  const totalBid = orderBook.reduce((sum, row) => sum + (row.bidVol || 0), 0);
  const totalAsk = orderBook.reduce((sum, row) => sum + (row.askVol || 0), 0);

  // ===== TIME HELPERS =====
  const toSeconds = (time) => {
    if (!time || !time.includes(":")) return 0;

    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return 0;

    return h * 3600 + m * 60;
  };

  useEffect(() => {
    const startSec = toSeconds(startTime);
    const endSec = toSeconds(endTime);

    if (endSec <= startSec) {
      setCurrentTime("00:00:00");
      return;
    }

    const total = endSec - startSec;
    const percent = Number(sliderValue) || 0;

    const current = startSec + (percent / 100) * total;

    setCurrentTime(toHHMMSS(Math.floor(current)));

  }, [sliderValue, startTime, endTime]);

  const toHHMMSS = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ===== Sync slider -> time =====
  useEffect(() => {
    const startSec = toSeconds(startTime);
    const endSec = toSeconds(endTime);

    if (endSec <= startSec) return; // กันช่วงเวลาไม่ถูกต้อง

    const total = endSec - startSec;

    const current = startSec + (percent / 100) * total;
    setCurrentTime(toHHMMSS(Math.floor(current)));

  }, [sliderValue, startTime, endTime]);

  // ===== Play system =====
  useEffect(() => {

    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSliderValue((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Number(prev) + 1;
      });
    }, 100);

    return () => clearInterval(interval);

  }, [isPlaying]);

  const generateOrderBook = (timePercent) => {

  const basePrice = 72 - (timePercent * 0.02); // ราคาค่อย ๆ ลดตามเวลา

  const rows = [];

  for (let i = 0; i < 10; i++) {

    const bidPrice = (basePrice - i * 0.25).toFixed(2);
    const askPrice = (parseFloat(bidPrice) + 0.25).toFixed(2);

    const bidVol = Math.floor(200000 + Math.random() * 400000);
    const askVol = Math.floor(200000 + Math.random() * 400000);

    rows.push({
      bidVol,
      bid: bidPrice,
      ask: askPrice,
      askVol
    });
  }

  return rows;
};

useEffect(() => {
  setOrderBook(generateOrderBook(0));
}, []);

  useEffect(() => {
  const newBook = generateOrderBook(sliderValue);
  setOrderBook(newBook);
}, [sliderValue]);

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="p-4 border-b border-slate-700 bg-[#0f172a]">

        <div className="grid grid-cols-3 gap-3 mb-3 text-xs text-slate-400">
          <div>
            <div>Symbol</div>
            <input className="w-full bg-[#111827] border border-slate-600 px-2 py-1 rounded" defaultValue="DELTA"/>
          </div>
          <div>
            <div>Date</div>
            <input type="date" className="w-full bg-[#111827] border border-slate-600 px-2 py-1 rounded"/>
          </div>
          <div>
            <div>Speed</div>
            <input className="w-full bg-[#111827] border border-slate-600 px-2 py-1 rounded" defaultValue="1"/>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-slate-400">
          <div>
            <div>Start</div>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              step="60"
              className="w-full bg-[#111827] border border-slate-600 px-2 py-1 rounded"
            />
          </div>
          <div>
            <div>End</div>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              step="60"
              className="w-full bg-[#111827] border border-slate-600 px-2 py-1 rounded"
            />
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 rounded text-sm font-semibold text-white">
            SEARCH
          </button>
        </div>

        <div className="mt-3 bg-black text-yellow-400 font-mono text-center py-2 rounded">
          {currentTime}
        </div>
      </div>

      {/* SLIDER */}
    <div className="px-4 py-3 bg-[#0f172a] border-t border-slate-700">

      <div className="flex items-center gap-4">

        {/* RANGE BAR */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={(e) => setSliderValue(e.target.value)}
          className="flex-1 h-[3px] appearance-none bg-slate-600 rounded-full 
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:bg-yellow-400
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer"
        />

        {/* PLAY BUTTON */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-7 h-7 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 rounded-full text-black text-xs font-bold transition"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

      </div>

    </div>

      {/* ORDER BOOK */}
      <div className="bg-[#0b111a]">

        {orderBook.map((row, i) => (
    <OrderRow
      key={i}
      bidVol={row.bidVol.toLocaleString()}
      bid={row.bid}
      ask={row.ask}
      askVol={row.askVol.toLocaleString()}
    />
  ))}

        {/* TOTAL ROW */}
         <div className="grid grid-cols-4 h-[36px] items-center border-t border-slate-700 bg-[#111827] text-[12px] font-semibold">

          {/* TOTAL BID */}
          <div className="text-right pr-3 text-blue-400">
            Total: {totalBid.toLocaleString()}
          </div>

          {/* EMPTY */}
          <div></div>

          {/* EMPTY */}
          <div></div>

          {/* TOTAL ASK */}
          <div className="text-left pl-3 text-red-400">
            Total: {totalAsk.toLocaleString()}
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 p-4 border-t border-slate-700 bg-[#0f172a]">
        <StatSection title="In Range" />
        <StatSection title="Actual" />
      </div>

    </div>
  );
}

function OrderRow({ bidVol, bid, ask, askVol }) {

  const maxVolume = 500000;
  const bidWidth = (parseInt(bidVol.replace(/,/g, "")) / maxVolume) * 100;
  const askWidth = (parseInt(askVol.replace(/,/g, "")) / maxVolume) * 100;

  return (
    <div className="grid grid-cols-4 items-center text-[12px] h-[32px] border-b border-slate-800 relative">

      {/* BID VOL */}
      <div className="relative text-right pr-3 text-slate-300 font-medium overflow-hidden">
        <div
          className="absolute right-0 top-0 h-full bg-blue-900/60"
          style={{ width: `${bidWidth}%` }}
        />
        <span className="relative z-10">{bidVol}</span>
      </div>

      {/* BID PRICE */}
      <div className="text-center text-green-400 font-semibold">
        {bid}
      </div>

      {/* ASK PRICE */}
      <div className="text-center text-red-400 font-semibold">
        {ask}
      </div>

      {/* ASK VOL */}
      <div className="relative text-left pl-3 text-slate-300 font-medium overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-red-900/60"
          style={{ width: `${askWidth}%` }}
        />
        <span className="relative z-10">{askVol}</span>
      </div>

    </div>
  );
}

function StatSection({ title }) {
  return (
    <div className="bg-[#111827] border border-slate-700 rounded">

      <div className="px-3 py-2 text-[11px] text-slate-400 border-b border-slate-700 bg-[#1e293b]">
        {title}
      </div>

      <div className="grid grid-cols-4 text-[10px] text-slate-500 px-3 pt-2">
        <span>OPEN</span>
        <span>HIGH</span>
        <span>LOW</span>
        <span>CLOSE</span>
      </div>

      <div className="grid grid-cols-4 px-3 pb-3 pt-1 text-[13px] font-semibold text-white">
        <span>71.00</span>
        <span>73.50</span>
        <span>70.75</span>
        <span>72.25</span>
      </div>

    </div>
  );
}

function StatBox({ title, value }) {
  return (
    <div className="bg-[#111827] border border-slate-700 p-2 rounded flex justify-between">
      <span className="text-slate-400">{title}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}