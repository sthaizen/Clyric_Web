import React from 'react';
import { RadioIcon, CheckSquare, MessageCircle, Star } from "lucide-react";

function StatsCards({ activeSessionsCount = "1.9B", recentSessionsCount = "2.6K" }) {
  return (
    <div className="w-full max-w-sm bg-[#1b1b1f] text-white p-5 rounded-lg font-sans">
      
      {/* --- Community Stats --- */}
      <div className="mb-6">
        <h2 className="text-[15px] font-semibold mb-4 tracking-wide">Community Stats</h2>
        <div className="space-y-4">
          
          {/* Active / Views Stat */}
          <div>
            <div className="flex items-center gap-2">
              <RadioIcon className="w-4 h-4 text-blue-500" />
              <span className="text-gray-300 text-sm">Active</span>
              <span className="text-white font-medium text-sm ml-1">{activeSessionsCount}</span>
            </div>
            <div className="text-[#5c5c5c] text-xs ml-6 mt-1">Last week <span className="text-blue-500">+17.1M</span></div>
          </div>

          {/* Solved / Solution Stat */}
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-300 text-sm">Solved</span>
              <span className="text-white font-medium text-sm ml-1">{recentSessionsCount}</span>
            </div>
            <div className="text-[#5c5c5c] text-xs ml-6 mt-1">Last week <span className="text-blue-500">+14</span></div>
          </div>

          {/* Discuss Stat */}
          <div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-teal-500 fill-teal-500/20" />
              <span className="text-gray-300 text-sm">Discuss</span>
              <span className="text-white font-medium text-sm ml-1">605</span>
            </div>
            <div className="text-[#5c5c5c] text-xs ml-6 mt-1">Last week <span className="text-blue-500">+1</span></div>
          </div>

          {/* Reputation Stat */}
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-gray-300 text-sm">Reputation</span>
              <span className="text-white font-medium text-sm ml-1">71K</span>
            </div>
            <div className="text-[#5c5c5c] text-xs ml-6 mt-1">Last week <span className="text-blue-500">+364</span></div>
          </div>

        </div>
      </div>

      <hr className="border-[#333] my-5" />

      {/* --- Languages --- */}
      <div className="mb-6">
        <h2 className="text-[15px] font-semibold mb-4 tracking-wide">Languages</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="bg-[#282828] text-gray-300 px-3 py-1 rounded-full text-xs">Java</span>
            <span className="text-gray-400 text-xs"><span className="text-white font-medium">22</span> problems solved</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="bg-[#282828] text-gray-300 px-3 py-1 rounded-full text-xs">C++</span>
            <span className="text-gray-400 text-xs"><span className="text-white font-medium">8</span> problems solved</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="bg-[#282828] text-gray-300 px-3 py-1 rounded-full text-xs">Python3</span>
            <span className="text-gray-400 text-xs"><span className="text-white font-medium">7</span> problems solved</span>
          </div>
        </div>
        <button className="w-full text-center text-gray-400 text-xs mt-4 hover:text-gray-300 transition-colors">
          Show more
        </button>
      </div>

      <hr className="border-[#333] my-5" />

      {/* --- Skills --- */}
      <div>
        <h2 className="text-[15px] font-semibold mb-4 tracking-wide">Skills</h2>
        
        {/* Advanced */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-sm font-semibold text-white">Advanced</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Dynamic Programming</span> <span className="text-gray-500">x9</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Union-Find</span> <span className="text-gray-500">x3</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Monotonic Stack</span> <span className="text-gray-500">x2</span>
            </span>
          </div>
          <button className="w-full text-center text-gray-400 text-xs mt-3 hover:text-gray-300 transition-colors">Show more</button>
        </div>

        {/* Intermediate */}
        <div className="mb-4 mt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-semibold text-white">Intermediate</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Hash Table</span> <span className="text-gray-500">x10</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Math</span> <span className="text-gray-500">x9</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Design</span> <span className="text-gray-500">x7</span>
            </span>
          </div>
          <button className="w-full text-center text-gray-400 text-xs mt-3 hover:text-gray-300 transition-colors">Show more</button>
        </div>

        {/* Fundamental */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-white">Fundamental</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Array</span> <span className="text-gray-500">x27</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">Sorting</span> <span className="text-gray-500">x8</span>
            </span>
            <span className="bg-[#282828] px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
              <span className="text-gray-300">String</span> <span className="text-gray-500">x7</span>
            </span>
          </div>
          <button className="w-full text-center text-gray-400 text-xs mt-3 hover:text-gray-300 transition-colors">Show more</button>
        </div>

      </div>
    </div>
  );
}

export default StatsCards;