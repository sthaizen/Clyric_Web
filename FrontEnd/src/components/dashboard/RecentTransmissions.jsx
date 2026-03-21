import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Search, Plus } from 'lucide-react';

const RecentTransmissions = () => {
  const transmissions = [
    { 
      id: 1, 
      name: 'Median of Two Sorted Arrays', 
      status: 'HARD • 14MS • 42.1MB', 
      time: '2m ago', 
      icon: <CheckCircle2 size={20} fill="#a78bfa" className="text-[#1A1C23]" /> 
    },
    { 
      id: 2, 
      name: 'Longest Valid Parentheses', 
      status: 'HARD • TLE • 48/52 PASSED', 
      time: '45m ago', 
      icon: <AlertCircle size={20} fill="#fca5a5" className="text-[#1A1C23]" /> 
    },
    { 
      id: 3, 
      name: 'Two Sum II - Input Array Is Sorted', 
      status: 'EASY • 1MS • 39.4MB', 
      time: '1h ago', 
      icon: <CheckCircle2 size={20} fill="#a78bfa" className="text-[#1A1C23]" /> 
    },
    { 
      id: 4, 
      name: 'Sudoku Solver', 
      status: 'HARD • RUNTIME ERROR • INDEXOUTOFBOUNDS', 
      time: '5h ago', 
      icon: <AlertTriangle size={20} fill="#fbbf24" className="text-[#1A1C23]" /> 
    },
  ];

  return (
    <div className="bg-[#1b1b1f] rounded-2xl p-6 h-full relative shadow-sm border border-[#2A2B32]/30">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[18px] font-bold text-gray-100">
          Recent Submission
        </h3>
        <button className="text-[12px] font-bold uppercase tracking-widest text-[#a78bfa] hover:text-[#c084fc] transition-colors pr-4">
          VIEW ALL
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1 pr-10"> {/* pr-10 prevents text from hitting the FABs */}
        {transmissions.map((t) => (
          <div key={t.id} className="flex items-center gap-4 hover:bg-[#1F2028] p-3 rounded-xl transition-colors cursor-pointer group">
            
            {/* Icon Box */}
            <div className="bg-[#2A2B32]/60 group-hover:bg-[#2A2B32] p-2.5 rounded-xl transition-colors">
              {t.icon}
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[15px] font-bold text-gray-100 truncate">
                {t.name}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase truncate mt-0.5">
                {t.status}
              </span>
            </div>
            
            {/* Time */}
            <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
              {t.time}
            </span>
          </div>
        ))}
      </div>

     

    </div>
  );
};

export default RecentTransmissions;