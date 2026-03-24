import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioIcon, CheckSquare, MessageCircle, Star } from "lucide-react";
import QuestWidget from './quests/QuestWidget';

function StatsCards({ activeSessionsCount = "1.9B", recentSessionsCount = "2.6K" }) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-5">
      
      {/* --- Quest Progression --- */}
      <QuestWidget onClick={() => navigate('/problems')} />

      <div className="w-full bg-[#16161a] border border-[#231c2f] text-white p-6 rounded-xl font-sans shadow-sm">
        
        {/* --- Community Stats --- */}
      <div>
        <h2 className="text-lg font-medium text-white mb-6 tracking-wide">Community Stats</h2>
        <div className="flex flex-col gap-5">
          
          {/* Active / Views Stat */}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <RadioIcon className="w-5 h-5 text-blue-500" />
                <span className="text-gray-200 text-[15px] font-medium">Views</span>
              </div>
              <div className="text-white font-medium text-[15px]">{activeSessionsCount}</div>
            </div>
            <div className="text-gray-500 text-[13px] mt-1 pl-8">
              Last week <span className="text-blue-400 font-medium">+17.1M</span>
            </div>
          </div>

          {/* Solved / Solution Stat */}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-200 text-[15px] font-medium">Solution</span>
              </div>
              <div className="text-white font-medium text-[15px]">{recentSessionsCount}</div>
            </div>
            <div className="text-gray-500 text-[13px] mt-1 pl-8">
              Last week <span className="text-blue-400 font-medium">+14</span>
            </div>
          </div>

          {/* Discuss Stat */}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <span className="text-gray-200 text-[15px] font-medium">Discuss</span>
              </div>
              <div className="text-white font-medium text-[15px]">605</div>
            </div>
            <div className="text-gray-500 text-[13px] mt-1 pl-8">
              Last week <span className="text-blue-400 font-medium">+1</span>
            </div>
          </div>

          {/* Reputation Stat */}
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-200 text-[15px] font-medium">Reputation</span>
              </div>
              <div className="text-white font-medium text-[15px]">71K</div>
            </div>
            <div className="text-gray-500 text-[13px] mt-1 pl-8">
              Last week <span className="text-blue-400 font-medium">+364</span>
            </div>
          </div>

        </div>
      </div>

      <hr className="border-[#302642] my-6" />

      {/* --- Languages --- */}
      <div>
        <h2 className="text-lg font-medium text-white mb-5 tracking-wide">Languages</h2>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="bg-[#232329] text-gray-200 px-3.5 py-1.5 rounded-full text-[13px]">Java</span>
            <span className="text-gray-500 text-[13px]"><span className="text-gray-200 font-medium mr-1">22</span> problems solved</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="bg-[#232329] text-gray-200 px-3.5 py-1.5 rounded-full text-[13px]">C++</span>
            <span className="text-gray-500 text-[13px]"><span className="text-gray-200 font-medium mr-1">8</span> problems solved</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="bg-[#232329] text-gray-200 px-3.5 py-1.5 rounded-full text-[13px]">Python3</span>
            <span className="text-gray-500 text-[13px]"><span className="text-gray-200 font-medium mr-1">7</span> problems solved</span>
          </div>
        </div>
        <button className="w-full text-center text-gray-500 text-[13px] mt-5 hover:text-gray-300 transition-colors">
          Show more
        </button>
      </div>

      <hr className="border-[#302642] my-6" />

      {/* --- Skills --- */}
      <div>
        <h2 className="text-lg font-medium text-white mb-5 tracking-wide">Skills</h2>
        
        {/* Advanced */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-white">Advanced</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Dynamic Programming</span> <span className="text-gray-500">x9</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Union-Find</span> <span className="text-gray-500">x3</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Monotonic Stack</span> <span className="text-gray-500">x2</span>
            </span>
          </div>
        </div>

        {/* Intermediate */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-white">Intermediate</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Hash Table</span> <span className="text-gray-500">x10</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Math</span> <span className="text-gray-500">x9</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Design</span> <span className="text-gray-500">x7</span>
            </span>
          </div>
        </div>

        {/* Fundamental */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span className="text-sm font-medium text-white">Fundamental</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Array</span> <span className="text-gray-500">x27</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">Sorting</span> <span className="text-gray-500">x8</span>
            </span>
            <span className="bg-[#232329] px-3 py-1.5 rounded-full text-[12px] flex items-center gap-1.5">
              <span className="text-gray-300">String</span> <span className="text-gray-500">x7</span>
            </span>
          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
}

export default StatsCards;