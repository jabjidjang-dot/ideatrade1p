// src/components/ToolCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star as StarIcon } from '@mui/icons-material';
import { RocketLaunch as RocketLaunchIcon } from '@mui/icons-material';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';

export default function ToolsCard({
  project,
  isMember = false,
  unlockedList = [],
}) {
  const navigate = useNavigate();

  if (!project) return null;

  const isUnlocked =
    !project.premium || isMember || unlockedList.includes(project.id);

  /* ===== Card Background ===== */
  const cardBackground =
    project.premium && isUnlocked
      ? "bg-[#403000]"
      : "bg-[#666666]";

  /* ===== Icon Style ===== */
  const iconStyle = project.external
    ? "bg-sky-600 border-sky-500"
    : project.premium
      ? "bg-[#cca300] border-[#b38f00]"
      : "bg-gray-500 border-gray-400";

  const handleClick = () => {
    if (project.external && project.url) {
      window.open(project.url, "_blank");
      return;
    }

    if (isUnlocked) {
      navigate(`/${project.id}`);
    } else {
      navigate("/member-register");
    }
  };

  return (
    <div
      className={`
        ${cardBackground}
        rounded-xl p-5
        flex flex-col gap-3
        border border-transparent
        hover:border-gray-500
        hover:-translate-y-1
        transition-all duration-200
        h-full
      `}
    >
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 rounded-full shrink-0
            flex items-center justify-center
            text-white
            shadow-sm
            border-2
            ${iconStyle}
          `}
        >
          {project.icon ? (
            project.icon
          ) : project.external ? (
            <RocketLaunchIcon sx={{ width: 20, height: 20, color: 'white' }} />
          ) : project.premium ? (
            <StarIcon sx={{ width: 20, height: 20, color: 'white' }} />
          ) : (
            <RocketLaunchIcon sx={{ width: 20, height: 20, color: 'white' }} />
          )}
        </div>

        <h3 className="text-lg font-bold text-white text-left m-0">
          {project.name}
          {project.premium && (
            <span className="text-[#cca300] text-sm ml-2"></span>
          )}
        </h3>
      </div>

      {/* ===== Description ===== */}
      <p className="text-[#a0a0a0] text-sm leading-relaxed text-left flex-grow">
        {project.desc}
      </p>

      {/* ===== Action Button ===== */}
      <button
        onClick={handleClick}
        className={`
          w-full py-2.5 rounded-lg
          font-semibold text-sm tracking-wide
          transition shadow-md mt-2
          flex items-center justify-center gap-2
          ${
            project.external
              ? "bg-sky-600 hover:bg-sky-500 text-white"
              : project.premium
                ? "bg-[#cca300] hover:bg-[#b38f00] text-white"
                : "bg-gray-600 hover:bg-gray-500 text-white"
          }
        `}
      >
        {project.external ? (
          <>
            OPEN EXTERNAL
            <OpenInNewIcon sx={{ width: 16, height: 16 }} />
          </>
        ) : isUnlocked ? (
          "OPEN TOOL"
        ) : (
          "JOIN MEMBERSHIP"
        )}
      </button>
    </div>
  );
}