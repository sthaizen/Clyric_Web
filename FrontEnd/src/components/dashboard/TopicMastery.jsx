import React from 'react';
import { Network, Layers, Share2, Hash } from 'lucide-react';

const TOPIC_ICONS = {
  'Arrays & Strings': <span className="font-mono text-[18px] font-bold tracking-widest text-[#6366f1] leading-none">[ ]</span>,
  'Trees & Graphs': <Network size={20} className="text-[#fbbf24]" />,
  'Dynamic Programming': <Layers size={20} className="text-[#818cf8]" />,
  'Sorting & Searching': <Share2 size={20} className="text-[#fca5a5]" />,
};

const TOPIC_COLORS = [
  'bg-[#6366f1]',
  'bg-[#fbbf24]',
  'bg-[#818cf8]',
  'bg-[#fca5a5]',
];

const ICON_COLORS = [
  'text-[#6366f1]',
  'text-[#fbbf24]',
  'text-[#818cf8]',
  'text-[#fca5a5]',
];

const TopicMastery = ({ topics = [] }) => {
  // Take top 4 topics
  const topTopics = topics.slice(0, 4).map((topic, idx) => ({
    name: topic.name,
    icon: TOPIC_ICONS[topic.name] || <Hash size={20} className={ICON_COLORS[idx % ICON_COLORS.length]} />,
    percent: topic.percent || (topic.total > 0 ? Math.round((topic.solved / topic.total) * 100) : 0),
    color: TOPIC_COLORS[idx % TOPIC_COLORS.length],
    solved: topic.solved,
    total: topic.total,
  }));

  // If no data, show placeholder
  if (topTopics.length === 0) {
    return (
      <div className="flex flex-col h-full gap-4">
        <h2 className="text-[18px] font-bold text-gray-100">Topic Mastery</h2>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No topic data yet. Solve some problems!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <h2 className="text-[18px] font-bold text-gray-100">Topic Mastery</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        {topTopics.map((topic, idx) => (
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