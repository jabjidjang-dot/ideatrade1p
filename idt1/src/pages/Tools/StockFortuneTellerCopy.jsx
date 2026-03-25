// src/pages/tools/StockFortuneTeller.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const scrollbarHideStyle = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

export default function StockFortuneTeller() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  const [isMember, setIsMember] = useState(false);
  const [enteredTool, setEnteredTool] = useState(false);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // --- [NEW] Refs สำหรับระบบเลื่อนอัตโนมัติ ---
  const scrollDirection = useRef(1); // 1 = ขวา, -1 = ซ้าย
  const isPaused = useRef(false);    // เก็บสถานะว่าเมาส์ชี้อยู่ไหม

  const [filters, setFilters] = useState({
    chart1: "Last",
    chart2: "%Short",
    chart3: "PredictTrend",
    chart4: "Peak",
    chart5: "Shareholder",
    chart6: "Manager",
  });

  // --- [NEW] Search Logic ---
  const [symbol, setSymbol] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const symbols = [
    "BANPU","BGRIM","EGCO","GPSC","GULF","OR","PTT","PTTEP",
    "PTTGC","RATCH","TOP","IVL","BBL","KBANK","KTB","SCB",
    "TISCO","TTB","KTC","SAWAD","MTC","TLI","ADVANC","DELTA",
    "COM7","CCET","TRUE","CPALL","CPF","CBG","OSP","GLOBAL",
    "HMPRO","BJC","CRC","ITC","TU","AOT","AWC","BDMS",
    "BH","BEM","BTS","CPN","LH","MINT","SCGP"
  ];

  const filteredSymbols = symbols.filter(s =>
    s.toLowerCase().includes(symbol.toLowerCase())
  );

  /* ===============================
      MEMBER CHECK
  ================================ */
  useEffect(() => {
    try {
      const userProfile = localStorage.getItem("userProfile");

      if (userProfile) {
        const user = JSON.parse(userProfile);

        if (user.unlockedItems && user.unlockedItems.includes("fortune")) {
          setIsMember(true);

          // 🔥 เช็คว่าเคยเข้า tool แล้วหรือยัง
          const hasEntered = sessionStorage.getItem("fortuneToolEntered");
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
      title: "Last",
      desc: "Stay updated with intuitive, real-time daily price action charts.",
    },
    {
      title: "PredictTrend",
      desc: "Visualizes the pulse of the market by tracking real-time capital inflows and outflows.",
    },
    {
      title: "Volume Analysis",
      desc: "Deep dive into volume patterns to confirm trend strength.",
    },
    {
      title: "Smart Signals",
      desc: "AI-driven entry and exit points.",
    },
    {
      title: "Sector Rotation",
      desc: "Identify which sectors are leading the market in real-time.",
    },
    {
      title: "Risk Management",
      desc: "Calculated risk metrics to help you protect your capital.",
    },
  ];

  /* ==========================================================
      CASE 1 : PREVIEW VERSION (Not Member)
  =========================================================== */
  if (!isMember) {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden animate-fade-in pb-20">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Stop guessing, start calculating
            </p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                <img
                  src="/src/assets/images/StockFortune.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* --- Features Section --- */}
          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-left border-l-4 border-cyan-500 pl-4">
              6 Main Features
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

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 rounded-full bg-slate-800 border border-slate-600"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/member-register")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 font-bold"
            >
              Join Membership
            </button>
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

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">

          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
                Stock Fortune Teller
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-light">
              Stop guessing, start calculating
            </p>
          </div>

          <div className="relative group w-full max-w-5xl mb-16">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-700"></div>
            <div className="relative bg-[#0B1221] border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
              </div>
              <div className="aspect-[16/9] w-full bg-[#0B1221]">
                <img
                  src="/src/assets/images/StockFortune.png"
                  alt="Dashboard Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-5xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 border-l-4 border-cyan-500 pl-4">
              6 Main Features
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

          <div className="flex gap-4">
            <button
              onClick={() => {
                setEnteredTool(true);
                localStorage.setItem("fortuneToolEntered", "true"); // 🔥 จำสถานะ
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
  =========================================================== */
  return (
    <div className="w-full min-h-screen bg-[#0B1221] text-white px-6 py-6">

        <div className="flex items-center justify-between mb-6">
          <div className="relative w-72">
            <input
              type="text"
              value={symbol}
              onChange={(e) => {
                setSymbol(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Type a Symbol..."
              className="w-full bg-[#111827] border border-slate-700 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
              🔍
            </span>

            {showDropdown && symbol !== "" && (
              <div className="absolute mt-2 w-full bg-[#111827] border border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
                {filteredSymbols.length > 0 ? (
                  filteredSymbols.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSymbol(item);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-cyan-500 hover:text-white cursor-pointer transition"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-slate-400">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
              🔔
            </button>
            <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
              ⟳
            </button>
            <button className="bg-[#111827] border border-slate-700 px-3 py-2 rounded-lg hover:border-cyan-500">
              ⬇
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">LAST PRICE</p>
            <p className="text-green-400 text-lg font-bold">5.30 (+1.92%)</p>
          </div>

          <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">VOLUME</p>
            <p className="text-yellow-400 text-lg font-bold">62.8M</p>
          </div>

          <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">HIGH / LOW</p>
            <p className="text-white text-lg font-bold">5.35 / 5.15</p>
          </div>

          <div className="bg-[#111827] p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-xs">MARKET STATUS</p>
            <p className="text-green-400 font-bold">● OPEN</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(filters).map(([key, value]) => (
            <ChartCard
              key={key}
              title={key}
              type={value}
              onChange={(newValue) =>
                setFilters({
                  ...filters,
                  [key]: newValue,
                })
              }
            />
          ))}
        </div>
    </div>
  );
}

// --- Helper Components ---

function ChartCard({ title, type, onChange }) {
  return (
    <div className="bg-[#111827] rounded-xl border border-slate-700 p-4 h-[320px]">
      
      {/* Header */}
      <div className="mb-3 flex justify-between items-center">
        <select
          value={type}
          onChange={(e) => onChange(e.target.value)}
          className="bg-[#1f2937] text-xs border border-slate-600 rounded-md px-2 py-1 focus:outline-none focus:border-cyan-500"
        >
          <option>Last</option>
          <option>%Short</option>
          <option>PredictTrend</option>
          <option>Peak</option>
          <option>Shareholder</option>
          <option>Manager</option>
        </select>

        <span className="text-xs text-slate-400">{title}</span>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[250px] bg-[#0f172a] rounded-lg p-4 relative overflow-hidden">
        <ChartRenderer type={type} />
      </div>
    </div>
  );
}

function ChartRenderer({ type }) {

  const width = 420;
  const height = 240;

  const paddingLeft = 20;
  const paddingRight = 40;
  const paddingTop = 20;
  const paddingBottom = 25;

  const rawData = {
    Last: [5.2,5.0,4.9,5.3,4.6,4.2,4.5],
    "%ShortA": [12,14,13,15,18,20,17],
    "%ShortB": [13,14,12,14,15,16,15],
    PredictTrend: [22,23,20,24,26,25],
    Peak: [5,6,5,18,9]
  };

  const data =
    type === "%Short"
      ? rawData["%ShortA"]
      : rawData[type] || rawData["Last"];

  const max = Math.max(...data);
  const min = Math.min(...data);

  const normalizeY = (value) => {
    return (
      height -
      paddingBottom -
      ((value - min) / (max - min)) *
        (height - paddingTop - paddingBottom)
    );
  };

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

  return (
    <div className="relative w-full h-full">

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">

        {/* Grid */}
        {[...Array(5)].map((_, i) => {
          const y =
            paddingTop +
            (i *
              (height - paddingTop - paddingBottom)) /
              4;
          return (
            <line
              key={i}
              x1={paddingLeft}
              y1={y}
              x2={width - paddingRight}
              y2={y}
              stroke="#1f2937"
              strokeOpacity="0.35"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Baseline */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - paddingRight}
          y2={height - paddingBottom}
          stroke="#374151"
          strokeWidth="1"
        />

        {/* %Short multi line */}
        {type === "%Short" && (
          <>
            <path
              d={buildPath(rawData["%ShortA"])}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.8"
            />
            <path
              d={buildPath(rawData["%ShortB"])}
              fill="none"
              stroke="#f97316"
              strokeWidth="1.8"
            />
          </>
        )}

        {/* Last Area */}
        {type === "Last" && (
          <>
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
              </linearGradient>
            </defs>

            <path
              d={`${buildPath(rawData["Last"])} 
                  L ${width - paddingRight},${height - paddingBottom} 
                  L ${paddingLeft},${height - paddingBottom} Z`}
              fill="url(#area)"
            />

            <path
              d={buildPath(rawData["Last"])}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.8"
            />
          </>
        )}

        {/* PredictTrend */}
        {type === "PredictTrend" && (
          <path
            d={buildPath(rawData["PredictTrend"])}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.8"
          />
        )}

        {/* Peak */}
        {type === "Peak" && (
          <>
            <defs>
              <linearGradient id="area2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#eab308" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#eab308" stopOpacity="0"/>
              </linearGradient>
            </defs>

            <path
              d={`${buildPath(rawData["Peak"])} 
                  L ${width - paddingRight},${height - paddingBottom} 
                  L ${paddingLeft},${height - paddingBottom} Z`}
              fill="url(#area2)"
            />

            <path
              d={buildPath(rawData["Peak"])}
              fill="none"
              stroke="#eab308"
              strokeWidth="1.8"
            />
          </>
        )}

      </svg>

      {/* bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

    </div>
  );
}