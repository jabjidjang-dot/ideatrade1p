
import React, { useState } from 'react';
import { 
  AreaChart, Area, LineChart, Line, CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis 
} from 'recharts';
import { 
  Search, Bell, RefreshCw, FileText, ChevronDown, FolderOpen 
} from 'lucide-react';

// --- Mock Data ---
const xAxisTicks = ['ก.ค.', 'ต.ค.', 'พ.ย.', 'ธ.ค.', 'ม.ค. 2569'];

const dataLast = [
  { name: 'ก.ค.', value: 4.8 }, { name: 'ส.ค.', value: 4.7 }, { name: 'ก.ย.', value: 4.9 },
  { name: 'ต.ค.', value: 6.2 }, { name: 'พ.ย.', value: 4.5 }, { name: 'ธ.ค.', value: 6 },
  { name: 'ม.ค. 2569', value: 4.4 }
];

const dataShort = [
  { name: 'ก.ค.', short1: 12, short2: 13 }, { name: 'ส.ค.', short1: 14, short2: 13.5 },
  { name: 'ก.ย.', short1: 14.5, short2: 12.5 }, { name: 'ต.ค.', short1: 14, short2: 18 },
  { name: 'พ.ย.', short1: 17, short2: 15.5 }, { name: 'ธ.ค.', short1: 20, short2: 17 },
  { name: 'ม.ค. 2569', short1: 18, short2: 16 }
];

const dataPredict = [
  { name: 'ก.ค.', value: 18 }, { name: 'ส.ค.', value: 20 }, { name: 'ก.ย.', value: 21 },
  { name: 'ต.ค.', value: 22 }, { name: 'พ.ย.', value: 16 }, { name: 'ธ.ค.', value: 24 },
  { name: 'ม.ค. 2569', value: 23 }
];

const dataPeak = [
  { name: 'ก.ค.', value: 5 }, { name: 'ส.ค.', value: 5.2 }, { name: 'ก.ย.', value: 5.5 },
  { name: 'ต.ค.', value: 5 }, { name: 'พ.ย.', value: 5 }, { name: 'ธ.ค.', value: 22 },
  { name: 'ม.ค. 2569', value: 8 }
];

export default function StockDashboard() {
    const [isToggled, setIsToggled] = useState(true);
  return (
    <div className="w-full max-w-[1600px] h-full bg-[#0e1118] border border-blue-500/50 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.6)] flex flex-col p-4 md:p-5 overflow-hidden relative text-white">
      
      {/* 1. TOP BAR: Search & Icons (Compact Size) */}
      <div className="flex justify-between items-center mb-3 shrink-0">
        <div className="flex items-center gap-3">
          
          <div 
            onClick={() => setIsToggled(!isToggled)} 
            className={`w-8 h-5 rounded-full relative cursor-pointer flex items-center transition-all duration-300 
              ${isToggled ? 'bg-blue-600 shadow-sm shadow-blue-900/20' : 'bg-slate-700'}`}
          >
             <div className={`absolute left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm
               ${isToggled ? 'translate-x-3' : 'translate-x-0'}`}>
             </div>
          </div>

          <div className="flex items-center bg-[#151a25] border border-slate-700/50 rounded-full h-7 px-3 min-w-[160px] transition-all focus-within:border-blue-500 focus-within:shadow-[0_0_10px_rgba(59,130,246,0.15)] group">
             <Search size={12} className="text-slate-400 mr-2 group-focus-within:text-blue-500 transition-colors" />
             <input 
               type="text" 
               defaultValue="BANPU" 
               className="bg-transparent border-none outline-none text-xs text-white w-full font-bold uppercase placeholder:text-slate-600 placeholder:font-normal"
               placeholder="SEARCH..."
             />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <IconButton icon={<Bell size={14} />} />
          <IconButton icon={<RefreshCw size={14} />} />
          <IconButton icon={<FileText size={14} />} />
        </div>
      </div>

      {/* 2. SUMMARY BAR (Table Format - Compact Size) */}
      <div className="w-full mb-4 shrink-0 overflow-x-auto">
        <table className="w-full text-left border-collapse rounded-lg overflow-hidden border border-slate-800 bg-[#151a25]">
          <thead className="bg-[#1e2330]/80 border-b border-slate-800">
            <tr>
              <th className="px-4 py-2 text-slate-500 text-[9px] font-bold tracking-wider uppercase w-1/4 whitespace-nowrap">LAST PRICE</th>
              <th className="px-4 py-2 text-slate-500 text-[9px] font-bold tracking-wider uppercase w-1/4 whitespace-nowrap">VOLUME</th>
              <th className="px-4 py-2 text-slate-500 text-[9px] font-bold tracking-wider uppercase w-1/4 whitespace-nowrap">HIGH / LOW</th>
              <th className="px-4 py-2 text-slate-500 text-[9px] font-bold tracking-wider uppercase w-1/4 whitespace-nowrap">MARKET STATUS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-[#1e2330]/40 transition-colors">
              <td className="px-4 py-2.5 border-r border-slate-800/50">
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-[9px] font-bold text-white">5.30</span>
                  <span className="text-[9px] font-bold text-red-500">-0.10 (-1.92%)</span>
                </div>
              </td>
              <td className="px-4 py-2.5 border-r border-slate-800/50">
                <div className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className="text-[9px] font-bold text-white">62.8M</span>
                  <span className="text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">Avg: 58M</span>
                </div>
              </td>
              <td className="px-4 py-2.5 border-r border-slate-800/50">
                <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-[9px] font-bold text-white">
                    5.35 <span className="text-slate-500 font-normal mx-0.5 text-[9px]">/</span> 5.15
                  </span>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                  <span className="text-[9px] font-bold text-[#22c55e]">OPEN (II)</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. MAIN GRID */}
      {/* 🔴 2. เอา overflow-y-auto ออก และใส่ flex-1 min-h-0 เพื่อให้ Container แบ่งพื้นที่ที่เหลืออย่างพอดี */}
      <div className="flex-1 min-h-0 w-full pb-2"> 
        
        {/* 🔴 3. เปลี่ยนจาก auto-rows เป็น xl:grid-rows-3 (ให้แบ่ง 3 แถวเท่าๆ กันบนจอ Desktop) และใช้ h-full */}
        <div className="grid grid-cols-1 xl:grid-cols-2 grid-rows-[repeat(6,minmax(250px,auto))] xl:grid-rows-3 gap-4 h-full">

          {/* Row 1 */}
          <ChartPanel title="Last" watermark="BANPU">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataLast} margin={{ top: -10, right: -27, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorLast)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="%Short" watermark="BANPU">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataShort} margin={{ top: 5, right: -27, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="short1" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="short2" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          {/* Row 2 */}
          <ChartPanel title="PredictTrend" watermark="BANPU">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataPredict} margin={{ top: 11, right: -27, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#151a25', stroke: '#f97316', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartPanel>

          <ChartPanel title="Peak" watermark="BANPU">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataPeak} margin={{ top: 11, right: -27, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPeak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#232936" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} dy={10} />
                <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={3} fill="url(#colorPeak)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartPanel>

          {/* Row 3 */}
          <ChartPanel title="Shareholder">
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
              <FolderOpen size={48} className="mb-2 opacity-50" strokeWidth={1.5} />
              <p className="text-sm font-medium">Shareholder {'>'} 5% ไม่มีข้อมูล</p>
            </div>
          </ChartPanel>

          <ChartPanel title="manager" extraHeader={<span className="text-[10px] text-[#22c55e] cursor-pointer hover:underline">Show/Hide All</span>} watermark="BANPU">
            <div className="flex flex-col justify-center h-full w-full px-4 gap-3">
               <CustomBar label="" value="62.8M" width="90%" color="bg-[#22c55e]" />
               <CustomBar label="" value="2.06M" width="30%" color="bg-[#a855f7]" />
               <CustomBar label="" value="1.2M" width="20%" color="bg-[#f97316]" />
               <CustomBar label="" value="-334K" width="55%" color="bg-[#3b82f6]" />
               <CustomBar label="" value="-61.0M" width="25%" color="bg-[#ef4444]" />
            </div>
          </ChartPanel>

        </div>
      </div>
    </div>
  );
}

// --- Sub Components ---

function IconButton({ icon }) {
  return (
    <button className="w-7 h-7 flex items-center justify-center bg-[#151a25] border border-slate-700/50 rounded-md text-slate-400 hover:text-white hover:border-slate-500 transition focus:outline-none">
      {icon}
    </button>
  );
}

function StatBox({ label, value, subValue, isUp, subColor }) {
  return (
    <div className="flex flex-col justify-center">
       <span className="text-[10px] text-slate-500 font-bold uppercase mb-1 tracking-wider">{label}</span>
       <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-white">{value}</span>
          {subValue && (
            <span className={`text-xs font-bold ${subColor ? subColor : (isUp === false ? 'text-red-500' : 'text-[#22c55e]')}`}>
               {subValue}
            </span>
          )}
       </div>
    </div>
  );
}

function ChartPanel({ title, children, watermark, extraHeader }) {
  return (
    <div className="bg-[#151a25] border border-slate-800 rounded-xl relative overflow-hidden flex flex-col h-full w-full">
       
       <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-1 bg-[#1e2330] border border-slate-700 rounded px-2 py-1 pointer-events-auto cursor-pointer">
             <span className="text-xs font-medium text-slate-300">{title}</span>
             <ChevronDown size={14} className="text-slate-500"/>
          </div>
          {extraHeader && <div className="pointer-events-auto">{extraHeader}</div>}
       </div>

       {watermark && (
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
            <span className="text-7xl font-black text-white uppercase tracking-[0.2em]">{watermark}</span>
         </div>
       )}

       <div className="flex-1 w-full h-full pt-14 pb-4 px-0 z-10 relative">
         {children}
       </div>
    </div>
  );
}

function CustomBar({ label, value, width, color, isNegative }) {
  return (
    <div className="relative w-full flex items-center h-4">
      {label && <span className="absolute -left-2 -translate-x-full text-xs text-slate-400">{label}</span>}
      <div className="w-full h-1 bg-slate-800 rounded-full relative">
         <div className={`absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full ${color}`} style={{ width: width, left: 0 }}>
            <div className={`absolute top-1/2 -translate-y-1/2 -right-1 w-2.5 h-2.5 rounded-full ${color} border-2 border-[#151a25] shadow-sm`}></div>
         </div>
      </div>

      <div className="w-16 flex justify-end ml-3 shrink-0">
        <span className="text-[10px] font-bold text-white font-mono tracking-tighter bg-slate-800/30 px-1.5 py-0.5 rounded border border-slate-700/30">
          {value}
        </span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1118] border border-slate-700 p-2 rounded shadow-xl text-xs flex flex-col gap-1">
        <p className="text-slate-400 border-b border-slate-800 pb-1 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{backgroundColor: entry.color}}></div>
             <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}