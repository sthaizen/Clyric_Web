import React from 'react';
import { Award } from "lucide-react";

export default function DashboardTopicStats({ data }) {
  const topics = data?.topics || [];
  
  return (
    <div className="bg-[#1b1b1f] p-6 rounded-lg font-sans h-full border border-[#2c2c2f]">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-indigo-400" />
        <h2 className="text-[15px] font-semibold text-white tracking-wide">Strongest Topics</h2>
      </div>
      
      {topics.length === 0 ? (
        <div className="flex items-center justify-center h-24 text-gray-500 text-sm border border-dashed border-[#2c2c2f] rounded-lg">
          Not enough data yet.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {topics.slice(0, 12).map((topic, i) => (
             <span key={i} className="bg-[#2c2c2f] hover:bg-[#3e3e42] transition-colors cursor-default px-3 py-1.5 rounded-full text-xs flex items-center gap-2 border border-[#333]">
                <span className="text-gray-300 font-medium">{topic.name}</span> 
                <span className="text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded">x{topic.solved}</span>
             </span>
          ))}
        </div>
      )}
    </div>
  );
}
