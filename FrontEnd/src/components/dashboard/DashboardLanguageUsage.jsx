import React from 'react';
import { Terminal } from "lucide-react";

export default function DashboardLanguageUsage({ data }) {
  const languages = data?.languages || [];
  const totalSubmissions = languages.reduce((sum, l) => sum + l.count, 0);

  return (
    <div className="bg-[#1b1b1f] p-6 rounded-lg font-sans border border-[#2c2c2f] mt-6">
      <div className="flex items-center gap-2 mb-5">
        <Terminal className="w-5 h-5 text-gray-400" />
        <h2 className="text-[15px] font-semibold text-white tracking-wide">Language Usage</h2>
      </div>
      
      {languages.length === 0 ? (
        <div className="text-gray-500 text-sm py-4 text-center border border-dashed border-[#2c2c2f] rounded-lg">No language data.</div>
      ) : (
        <div className="space-y-4">
          {languages.slice(0, 4).map((lang, i) => {
             const percentage = totalSubmissions > 0 ? (lang.count / totalSubmissions * 100).toFixed(1) : 0;
             return (
               <div key={i}>
                 <div className="flex justify-between items-center mb-1.5">
                   <span className="text-gray-300 text-sm bg-[#2c2c2f] px-2.5 py-1 rounded-md">{lang.name}</span>
                   <span className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">{lang.count} SUB <span className="text-gray-500 ml-1">({percentage}%)</span></span>
                 </div>
                 <div className="w-full h-[6px] rounded-full bg-[#2c2c2f] overflow-hidden">
                   <div className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
}
