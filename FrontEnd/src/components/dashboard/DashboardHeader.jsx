import React from 'react';
import { Flame } from 'lucide-react';

const DashboardHeader = ({ currentStreak = 0 }) => {
  return (
    <div className="flex justify-between items-center w-full mb-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold text-white tracking-tight">
          Architect's Dashboard
        </h1>
        <p className="text-[14px] text-gray-400">
          System Performance & Cognitive Mastery Analytics
        </p>
      </div>
      
      {/* Updated bg to #111113 and border for deeper contrast */}
     <div className="bg-[#111113] border border-[#2a2a35] rounded-xl px-5 py-3 flex items-center gap-4 shadow-sm">
  <div className="flex flex-col items-end">
    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-[0.1em] leading-none mb-1.5">
      CURRENT STREAK
    </span>
    <span className="text-[22px] font-bold text-[#FACC15] leading-none">
      {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
    </span>
  </div>
  <Flame 
    size={24} 
    className="text-[#FACC15]" 
    fill="currentColor" 
    strokeWidth={2.5} 
  />
</div>
    </div>
  );
};

export default DashboardHeader;