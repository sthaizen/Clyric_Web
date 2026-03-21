import React from 'react';
import { Network, Layers, Share2 } from 'lucide-react';

const TopicMastery = () => {
  const topics = [
    { 
      name: 'Arrays & Strings', 
      icon: <span className="font-mono text-[18px] font-bold tracking-widest text-[#6366f1] leading-none">[ ]</span>, 
      percent: 94, 
      color: 'bg-[#6366f1]' 
    },
    { 
      name: 'Trees & Graphs', 
      icon: <Network size={20} className="text-[#fbbf24]" />, 
      percent: 78, 
      color: 'bg-[#fbbf24]' 
    },
    { 
      name: 'Dynamic Programming', 
      icon: <Layers size={20} className="text-[#818cf8]" />, 
      percent: 62, 
      color: 'bg-[#818cf8]' 
    },
    { 
      name: 'Sorting & Searching', 
      icon: <Share2 size={20} className="text-[#fca5a5]" />, 
      percent: 45, 
      color: 'bg-[#fca5a5]' 
    },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-[18px] font-bold text-gray-100">Topic Mastery</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {topics.map((topic, idx) => (
          <div key={idx} className="bg-[#1b1b1f] rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-[#2a2a35]">
            
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center justify-center h-6">
                {topic.icon}
              </div>
              <span className="text-[14px] font-bold text-gray-200">{topic.percent}%</span>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[14px] font-bold text-gray-100 truncate">
                {topic.name}
              </span>
              
              <div className="w-full flex items-center gap-1.5">
                <div className="h-[5px] bg-[#111113] rounded-full overflow-hidden flex-1">
                  <div className={`h-full ${topic.color} rounded-full`} style={{ width: `${topic.percent}%` }} />
                </div>
                <div className="h-[5px] w-2 bg-[#111113] rounded-full shrink-0"></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicMastery;