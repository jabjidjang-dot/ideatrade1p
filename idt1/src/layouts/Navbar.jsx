import React from "react";

export default function Navbar({ activePage, setActivePage }) {
  // ใช้ shortcuts เป็นปุ่มแทนหน้า preview-projects
  const tabs = [
    { label: "Shortcuts", id: "shortcuts" },
    { label: "หมอดูหุ้น", id: "fortune" },
    { label: "Petroleum", id: "petroleum" },
    { label: "Rubber Thai", id: "rubber" },
    { label: "Flow Intraday", id: "flow" },
    { label: "S50", id: "s50" },
    { label: "Gold", id: "gold" },
    { label: "BidAsk", id: "bidask" },
    { label: "TickMatch", id: "tickmatch" },
    { label: "DR", id: "dr" },
  ];

  return (
    <div className="mb-8">
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => {
          // 🔥 mapping logic
          const isActive =
            tab.id === "shortcuts"
              ? activePage === "preview-projects" ||
                activePage === "whatsnew"
              : activePage === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                // 🔥 ถ้ากด Shortcuts → ไปหน้า preview-projects
                if (tab.id === "shortcuts") {
                  setActivePage("preview-projects");
                } else {
                  setActivePage(tab.id);
                }
              }}
              className={`
                px-5 py-2 rounded-full text-sm font-medium
                transition-all duration-200 border
                ${
                  isActive
                    ? "bg-[#3B341B] text-[#FFCC00] border-[#B6A700]/50 shadow-[0_0_10px_rgba(255,204,0,0.2)]"
                    : "bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
