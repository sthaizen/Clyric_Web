import React from 'react';
import { Activity } from "lucide-react";

export default function DashboardRecentActivity({ data }) {
  const recent = data?.recentSubmissions || [];

  const timeAgo = (dateStr) => {
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="bg-[#1b1b1f] p-6 rounded-lg font-sans border border-[#2c2c2f] h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-5 h-5 text-green-400" />
        <h2 className="text-[15px] font-semibold text-white tracking-wide">Recent Activity</h2>
      </div>
      
      {recent.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm border border-dashed border-[#2c2c2f] rounded-lg p-6 text-center">
          <Activity className="w-8 h-8 mb-2 opacity-20" />
          No recent tracking data found.
        </div>
      ) : (
        <div className="space-y-3 flex-1 pr-1">
          {recent.map((sub, i) => (
             <div key={i} className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3.5 bg-[#111113] rounded-lg border border-[#2c2c2f] hover:border-[#3e3e42] transition-colors group">
               <div className="flex items-center gap-3 min-w-0">
                 <div className={`w-2 h-2 shrink-0 rounded-full ${sub.verdict === 'Accepted' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></div>
                 <div className="min-w-0">
                   <div className="text-[13px] font-medium text-gray-200 truncate group-hover:text-blue-400 transition-colors">
                     {sub.title || sub.problemSlug}
                   </div>
                   <div className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                     {sub.language}
                   </div>
                 </div>
               </div>
               <div className="flex flex-row xl:flex-col items-center xl:items-end justify-between xl:justify-center shrink-0 pl-5 xl:pl-0">
                 <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${sub.verdict === 'Accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                   {sub.verdict}
                 </div>
                 <div className="text-[11px] text-gray-500 xl:mt-1">{timeAgo(sub.date)}</div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
