import React from 'react';
import { Target, CheckCircle2, History, Flame } from "lucide-react";

export default function DashboardOverviewCards({ data }) {
  const overview = data?.overview || {};
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-[#1b1b1f] p-5 rounded-lg border border-[#2c2c2f] transition-colors hover:border-[#3e3e42]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Total Solved</span>
        </div>
        <div className="text-2xl font-bold text-white">{overview.totalSolved || 0}</div>
      </div>

      <div className="bg-[#1b1b1f] p-5 rounded-lg border border-[#2c2c2f] transition-colors hover:border-[#3e3e42]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Acceptance Rate</span>
        </div>
        <div className="text-2xl font-bold text-white">{overview.acceptanceRate || "0.0%"}</div>
      </div>

      <div className="bg-[#1b1b1f] p-5 rounded-lg border border-[#2c2c2f] transition-colors hover:border-[#3e3e42]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Submissions</span>
        </div>
        <div className="text-2xl font-bold text-white">{overview.totalSubmissions || 0}</div>
      </div>

      <div className="bg-[#1b1b1f] p-5 rounded-lg border border-[#2c2c2f] transition-colors hover:border-[#3e3e42]">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Current Streak</span>
        </div>
        <div className="text-2xl font-bold text-white">{overview.currentStreak || 0} <span className="text-sm font-normal text-gray-500">days</span></div>
      </div>
    </div>
  );
}
