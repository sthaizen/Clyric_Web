import React from 'react';
import { Flame } from 'lucide-react';

const DashboardHeader = ({ currentStreak = 0 }) => {
  return (
    <div className="flex justify-between items-center w-full mb-2 relative">
      
      {/* --- INVISIBLE SVG DEFINITION FOR THE FLAME GRADIENT --- */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient 
            id="flame-gradient" 
            x1="0%" y1="100%" 
            x2="0%" y2="0%"
          >
            <stop offset="0%" stopColor="#fde047" />   {/* Bright Yellow */}
            <stop offset="50%" stopColor="#f97316" />  {/* Vibrant Orange */}
            <stop offset="100%" stopColor="#dc2626" /> {/* Deep Red */}
          </linearGradient>
        </defs>
      </svg>
      {/* ------------------------------------------------------- */}

      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold text-white tracking-tight">
          Architect's Dashboard
        </h1>
        <p className="text-[14px] text-gray-400">
          System Performance & Cognitive Mastery Analytics
        </p>
      </div>
      
      {/* Streak Container */}
      <div className="bg-[#16161a] border border-[#2a2a35] rounded-xl px-5 py-3 flex items-center gap-4 shadow-sm">
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] leading-none mb-1.5">
            CURRENT STREAK
          </span>
          <span className="text-[22px] font-bold leading-none bg-gradient-to-t from-[#fde047] via-[#f97316] to-[#dc2626] bg-clip-text text-transparent">
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        
        <Flame
          size={38}
          strokeWidth={2.5}
          style={{
            fill: "url(#flame-gradient)",
            stroke: "url(#flame-gradient)",
          }}
          className="drop-shadow-[0_2px_10px_rgba(249,115,22,0.4)]" 
        />
      </div>
    </div>
  );
};

export default DashboardHeader;