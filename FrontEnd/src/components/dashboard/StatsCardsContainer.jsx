import React from 'react';

const StatsCardsContainer = () => {
  const stats = [
    {
      title: "TOTAL SOLVED",
      value: "1,284",
      bottomElement: <span className="text-[#6366f1] text-[11px] font-bold tracking-wide">+12 this week</span>
    },
    {
      title: "SUBMISSIONS",
      value: "4,912",
      bottomElement: <span className="text-gray-500 text-[11px] font-medium leading-tight">Across all<br/>platforms</span>
    },
    {
      title: "ACCEPTED",
      value: "82.4%",
      bottomElement: (
        <div className="w-full flex items-center gap-1.5 mt-1">
          {/* Updated track to #111113 and fill to #6366f1 */}
          <div className="h-[5px] w-full bg-[#111113] rounded-full overflow-hidden">
            <div className="h-full bg-[#6366f1] rounded-full" style={{ width: '82.4%' }} />
          </div>
          <div className="h-[5px] w-4 bg-[#111113] rounded-full shrink-0"></div>
        </div>
      )
    },
    {
      title: "LONGEST STREAK",
      value: "156",
      bottomElement: <span className="text-yellow-400 text-[11px] font-bold tracking-wide">New Record!</span>
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-full">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-[#1b1b1f] border border-[#2a2a35] rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[200px]"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-snug w-2/3">
            {stat.title}
          </h3>
          
          <div className="text-[32px] font-bold text-gray-100 my-auto">
            {stat.value}
          </div>
          
          <div className="mt-auto">
            {stat.bottomElement}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCardsContainer;