import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const DifficultyDistribution = ({ difficulty = {}, totalSolved = 0 }) => {
  const easy = difficulty.easy || { solved: 0, attempted: 0, total: 0 };
  const medium = difficulty.medium || { solved: 0, attempted: 0, total: 0 };
  const hard = difficulty.hard || { solved: 0, attempted: 0, total: 0 };

  const totalAvailable = easy.total + medium.total + hard.total;
  const solvedCount = easy.solved + medium.solved + hard.solved;
  const unsolved = Math.max(0, totalAvailable - solvedCount);

  const data = [
    { name: 'Easy', value: easy.solved, total: easy.total, color: '#6366f1' },
    { name: 'Medium', value: medium.solved, total: medium.total, color: '#facc15' },
    { name: 'Hard', value: hard.solved, total: hard.total, color: '#fca5a5' },
    { name: 'Unsolved', value: unsolved || 1, total: 0, color: '#111113' },
  ];

  return (
    <div className="bg-[#1b1b1f] border border-[#2a2a35] rounded-2xl p-6 h-full flex flex-col shadow-sm min-h-[200px]">
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-[15px] font-bold text-gray-100">
          Difficulty Distribution
        </h3>
        <PieChartIcon size={22} className="text-gray-400/80" fill="#111113" />
      </div>
      
      <div className="flex-1 flex items-center justify-between gap-2">
        
        <div className="relative w-[130px] h-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={65}
                paddingAngle={0}
                stroke="none"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
            <span className="text-[22px] font-bold text-gray-100 leading-none">{solvedCount.toLocaleString()}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1">
              TOTAL SOLVED
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1 ml-4 justify-center">
          {data.slice(0, 3).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[12px] font-semibold text-gray-300">{item.name}</span>
              </div>
              <span className="text-[12px] font-bold text-gray-100">
                {item.value} <span className="text-gray-500 font-medium">/ {item.total}</span>
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DifficultyDistribution;