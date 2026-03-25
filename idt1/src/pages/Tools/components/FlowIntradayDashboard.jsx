import React, { useState } from "react";
import { LayoutGrid, Grid3X3, Columns, Bell, RefreshCw, ChevronDown, Heart } from "lucide-react";

export default function FlowIntradayDashboard() {
  const [layoutCount, setLayoutCount] = useState(12);
  
  // สร้าง State สำหรับเก็บค่า Flow ของแต่ละช่อง (เหมือน Symbol)
  const [flows, setFlows] = useState(Array(12).fill("Flow"));

  const handleFlowChange = (index, value) => {
    const updated = [...flows];
    updated[index] = value;
    setFlows(updated);
  };

  return (
    <div className="w-full h-full bg-[#0d0f14] flex flex-col text-slate-400 font-sans overflow-hidden">
      
      {/* --- Top Control Bar --- */}
      <div className="h-9 bg-[#1a1d23] border-b border-[#2d3139] flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase">Select Layout:</span>
          <div className="flex gap-0.5 bg-[#0d0f14] p-0.5 rounded border border-[#2d3139]">
            <LayoutBtn active={layoutCount === 4} onClick={() => setLayoutCount(4)} icon={<Columns size={11} />} />
            <LayoutBtn active={layoutCount === 8} onClick={() => setLayoutCount(8)} icon={<LayoutGrid size={11} />} />
            <LayoutBtn active={layoutCount === 12} onClick={() => setLayoutCount(12)} icon={<Grid3X3 size={11} />} />
          </div>
          <div className="flex items-center gap-3 ml-3 border-[#2d3139] border-l pl-3">
             <div className="flex items-center gap-1"><div className="w-3 h-[1px] bg-slate-400"></div><span className="text-[9px]">Price</span></div>
             <div className="flex items-center gap-1"><div className="w-3 h-[1px] bg-[#00ff88]"></div><span className="text-[9px]">Value</span></div>
          </div>
        </div>

        <div className="flex gap-1.5 items-center">
          <button className="bg-[#1a1d23] text-[9px] px-2 py-0.5 rounded border border-[#3a3f4b] flex items-center gap-1 hover:bg-[#252a33]">
            Favorites <ChevronDown size={8} />
          </button>
          <button className="bg-[#f23645] text-white text-[9px] px-2 py-0.5 rounded font-bold flex items-center gap-1 hover:bg-[#d9212f]">
            <Heart size={8} fill="currentColor" /> ADD
          </button>
        </div>
      </div>

      {/* --- Main Grid Area --- */}
      <div className="flex-1 p-1 overflow-hidden">
        <div className={`grid gap-1 h-full w-full
            ${layoutCount === 4 ? "grid-cols-2 grid-rows-2" : ""}
            ${layoutCount === 8 ? "grid-cols-4 grid-rows-2" : ""}
            ${layoutCount === 12 ? "grid-cols-4 grid-rows-3" : ""}
          `}
        >
          {Array.from({ length: layoutCount }).map((_, index) => (
            <div key={index} className="bg-[#1a1d23] border border-[#2d3139] rounded-[2px] flex flex-col group overflow-hidden">
              
              {/* Card Header (แก้ไขส่วน Flow ให้เลือกได้) */}
              <div className="px-1.5 py-0.5 flex justify-between items-center border-b border-[#2d3139] bg-[#1a1d23]">
                <button className="bg-[#0d0f14] border border-[#3a3f4b] text-[8px] px-1 py-0 rounded flex items-center gap-1 text-slate-300 hover:border-slate-500 transition-colors">
                  Symbol <ChevronDown size={7} />
                </button>
                
                <div className="flex items-center gap-1.5 scale-90 origin-right">
                  <span className="text-[8px] text-slate-500 uppercase font-medium">Notify</span>
                  
                  {/* ปุ่มเลือก Flow (Dropdown เหมือน Symbol) */}
                  <select 
                    value={flows[index]}
                    onChange={(e) => handleFlowChange(index, e.target.value)}
                    className="bg-[#0d0f14] border border-[#3a3f4b] text-[8px] px-1 py-0 rounded text-slate-300 outline-none cursor-pointer hover:border-slate-500 transition-colors"
                  >
                    <option value="Flow">Flow</option>
                    <option value="Price">Price</option>
                    <option value="Volume">Volume</option>
                  </select>

                  <Bell size={10} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                  <RefreshCw size={10} className="text-slate-500 hover:text-slate-300 cursor-pointer" />
                </div>
              </div>
              
              {/* Body Content */}
              <div className="flex-1 bg-[#0d0f14] relative">
                {/* พื้นที่สำหรับกราฟในอนาคต */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LayoutBtn({ active, onClick, icon }) {
  return (
    <button 
      onClick={onClick}
      className={`p-1 rounded-[1px] transition-colors
        ${active ? "bg-[#7856ff] text-white" : "text-slate-500 hover:text-slate-300"}
      `}
    >
      {icon}
    </button>
  );
}