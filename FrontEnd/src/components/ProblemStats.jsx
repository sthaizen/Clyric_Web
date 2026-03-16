import React from "react";

export default function ProblemStats() {
  const stats = {
    totalSolved: 0,
    easy: { solved: 0, total: 640, beats: "99.6%", color: "bg-[#00b8a3]", track: "bg-[#294d42]" },
    medium: { solved: 0, total: 1392, beats: "98.9%", color: "bg-[#ffc01e]", track: "bg-[#5c4e25]" },
    hard: { solved: 0, total: 585, beats: "98.2%", color: "bg-[#ef4743]", track: "bg-[#5a302f]" },
  };

  const totalQuestions = stats.easy.total + stats.medium.total + stats.hard.total;
  
  // SVG parameters for the ring chart
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  // Calculate the percentage of total solved questions to fill the yellow arc
  const progressPercentage = stats.totalSolved / totalQuestions;
  const strokeDashoffset = circumference - progressPercentage * circumference;

  return (
    <div className="bg-[#1b1b1f] p-5 rounded-lg font-sans w-[480px]">
      {/* Header */}
      <div className="text-[14px] font-medium text-[#9e9e9e] mb-5">
        Solved Problems
      </div>
      
      <div className="flex items-center">
        {/* Left side: Donut Chart */}
        <div className="relative w-[110px] h-[110px] flex-shrink-0 mr-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle 
              cx="50" cy="50" r={radius} 
              fill="none" 
              stroke="#4a4a4a" 
              strokeWidth="3.5" 
            />
            {/* Active Progress Arc */}
            <circle 
              cx="50" cy="50" r={radius} 
              fill="none" 
              stroke="#ffa116" 
              strokeWidth="4" 
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" 
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-[26px] leading-none font-semibold text-white tracking-wide">
              {stats.totalSolved}
            </span>
            <span className="text-[13px] text-[#9e9e9e] mt-1.5">
              Solved
            </span>
          </div>
        </div>

        {/* Right side: Difficulty Stats */}
        <div className="flex-1 flex flex-col gap-[18px]">
          {/* Easy Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#9e9e9e] w-[60px]">Easy</span>
                <span className="text-white text-[15px] font-semibold">{stats.easy.solved}</span>
                <span className="text-[#9e9e9e] text-[13px] ml-0.5 font-medium">/{stats.easy.total}</span>
              </div>
              <div className="text-[#9e9e9e] font-medium">Beats {stats.easy.beats}</div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.easy.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.easy.color}`} 
                style={{ width: `${(stats.easy.solved / stats.easy.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Medium Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#9e9e9e] w-[60px]">Medium</span>
                <span className="text-white text-[15px] font-semibold">{stats.medium.solved}</span>
                <span className="text-[#9e9e9e] text-[13px] ml-0.5 font-medium">/{stats.medium.total}</span>
              </div>
              <div className="text-[#9e9e9e] font-medium">Beats {stats.medium.beats}</div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.medium.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.medium.color}`} 
                style={{ width: `${(stats.medium.solved / stats.medium.total) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Hard Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#9e9e9e] w-[60px]">Hard</span>
                <span className="text-white text-[15px] font-semibold">{stats.hard.solved}</span>
                <span className="text-[#9e9e9e] text-[13px] ml-0.5 font-medium">/{stats.hard.total}</span>
              </div>
              <div className="text-[#9e9e9e] font-medium">Beats {stats.hard.beats}</div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.hard.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.hard.color}`} 
                style={{ width: `${(stats.hard.solved / stats.hard.total) * 100}%` }}
              ></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}