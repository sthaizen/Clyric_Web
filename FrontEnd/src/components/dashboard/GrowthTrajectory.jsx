import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { FileText, Lightbulb, BrainCircuit } from 'lucide-react';

const GrowthTrajectory = () => {
  const data = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => {
      const isRecent = i >= 35; 
      let value = isRecent ? 50 + Math.random() * 50 : 20 + Math.random() * 40;
      return {
        id: i,
        value,
        color: isRecent ? '#6366f1' : '#2a2a35' // Indigo for recent, subtle grey for old
      };
    });
  }, []);

  return (
    <div className="flex flex-col h-full gap-6">
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#1b1b1f] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <FileText size={18} className="text-[#6366f1]" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">142</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">NOTES CREATED</div>
          </div>
        </div>
        <div className="bg-[#1b1b1f] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <Lightbulb size={18} className="text-yellow-400" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">28</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">HINTS USED</div>
          </div>
        </div>
        <div className="bg-[#1b1b1f] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <BrainCircuit size={18} className="text-[#6366f1]" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">92%</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">INDEPENDENT SOLVES</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1b1b1f] border border-[#2a2a35] rounded-2xl p-6 flex flex-col flex-1 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[17px] font-bold text-gray-100">
            Growth Trajectory <span className="text-gray-400 font-normal text-sm ml-1">(Last 100 Attempts)</span>
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]">
            AVG. TIME: 24M
          </span>
        </div>

        <div className="h-44 w-full mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Bar dataKey="value" radius={[2, 2, 2, 2]} barSize={6}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-auto">
          <span>ATTEMPT 0</span>
          <span>ATTEMPT 50</span>
          <span>ATTEMPT 100</span>
        </div>
      </div>

      <div className="bg-[#1b1b1f] border border-[#2a2a35] rounded-2xl p-6 grid grid-cols-3 gap-4 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">TOTAL CODING TIME</span>
          <span className="text-[20px] font-bold text-gray-100">1,420h</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">AVG. SOLVE TIME</span>
          <span className="text-[20px] font-bold text-gray-100">24m 12s</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">AI ASSIST RATIO</span>
          <span className="text-[20px] font-bold text-gray-100">1.4%</span>
        </div>
      </div>

    </div>
  );
};

export default GrowthTrajectory;