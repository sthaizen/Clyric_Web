import React from "react";

export default function DashboardDifficultyStats({ data }) {
  const difficulty = data?.difficulty || {
    easy: { solved: 0, attempted: 0 },
    medium: { solved: 0, attempted: 0 },
    hard: { solved: 0, attempted: 0 }
  };
  const overview = data?.overview || { totalSolved: 0 };

  // Static totals approximating a typical competitive programming platform
  const stats = {
    totalSolved: overview.totalSolved,
    easy: { solved: difficulty.easy.solved, total: 800, color: "bg-[#00b8a3]", track: "bg-[#294d42]" },
    medium: { solved: difficulty.medium.solved, total: 1500, color: "bg-[#ffc01e]", track: "bg-[#5c4e25]" },
    hard: { solved: difficulty.hard.solved, total: 700, color: "bg-[#ef4743]", track: "bg-[#5a302f]" },
  };

  const totalQuestions = stats.easy.total + stats.medium.total + stats.hard.total;
  
  // SVG parameters for the ring chart
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  // Calculate the percentage of total solved questions to fill the yellow arc
  const progressPercentage = Math.min(stats.totalSolved / totalQuestions, 1);
  const strokeDashoffset = circumference - progressPercentage * circumference;

  return (
    <div className="bg-[#1b1b1f] p-6 rounded-lg font-sans w-full border border-[#2c2c2f] h-full">
      {/* Header */}
      <div className="text-[15px] font-semibold tracking-wide text-white mb-6">
        Difficulty Breakdown
      </div>
      
      <div className="flex items-center">
        {/* Left side: Donut Chart */}
        <div className="relative w-[110px] h-[110px] flex-shrink-0 mr-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle 
              cx="50" cy="50" r={radius} 
              fill="none" 
              stroke="#2c2c2f" 
              strokeWidth="4" 
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
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
            <span className="text-[26px] leading-none font-semibold text-white tracking-wide">
              {stats.totalSolved}
            </span>
            <span className="text-[13px] text-gray-400 mt-1.5">
              Solved
            </span>
          </div>
        </div>

        {/* Right side: Difficulty Stats */}
        <div className="flex-1 flex flex-col gap-[20px]">
          {/* Easy Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#00b8a3] w-[60px] font-medium">Easy</span>
                <span className="text-white text-[15px] font-semibold">{stats.easy.solved}</span>
                <span className="text-gray-500 text-[13px] ml-1 font-medium">/{stats.easy.total}</span>
              </div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.easy.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.easy.color} transition-all duration-1000 ease-out`} 
                style={{ width: `${Math.min((stats.easy.solved / stats.easy.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Medium Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#ffc01e] w-[60px] font-medium">Medium</span>
                <span className="text-white text-[15px] font-semibold">{stats.medium.solved}</span>
                <span className="text-gray-500 text-[13px] ml-1 font-medium">/{stats.medium.total}</span>
              </div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.medium.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.medium.color} transition-all duration-1000 ease-out`} 
                style={{ width: `${Math.min((stats.medium.solved / stats.medium.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Hard Row */}
          <div>
            <div className="flex items-end justify-between mb-1.5 text-[13px]">
              <div className="flex items-baseline">
                <span className="text-[#ef4743] w-[60px] font-medium">Hard</span>
                <span className="text-white text-[15px] font-semibold">{stats.hard.solved}</span>
                <span className="text-gray-500 text-[13px] ml-1 font-medium">/{stats.hard.total}</span>
              </div>
            </div>
            <div className={`w-full h-[6px] rounded-full ${stats.hard.track} overflow-hidden`}>
              <div 
                className={`h-full rounded-full ${stats.hard.color} transition-all duration-1000 ease-out`} 
                style={{ width: `${Math.min((stats.hard.solved / stats.hard.total) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
