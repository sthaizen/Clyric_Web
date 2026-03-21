import React, { useMemo } from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { FileText, Lightbulb, BrainCircuit } from 'lucide-react';

const GrowthTrajectory = ({ growth = {} }) => {
  const {
    notesCreated = 0,
    hintsUsed = 0,
    independentSolvePercent = 0,
    totalTimeSpentSeconds = 0,
    avgSolveTimeSeconds = 0,
    aiHelpUsed = 0,
    attemptTimeline = [],
  } = growth;

  const totalSolved = growth.totalSolved || 0;
  const aiAssistRatio = totalSolved > 0
    ? ((aiHelpUsed / totalSolved) * 100).toFixed(1)
    : '0.0';

  // Format total coding time
  const totalHours = Math.floor(totalTimeSpentSeconds / 3600);
  const totalCodingTimeDisplay = totalHours > 0 ? `${totalHours.toLocaleString()}h` : `${Math.floor(totalTimeSpentSeconds / 60)}m`;

  // Format avg solve time
  const avgMinutes = Math.floor(avgSolveTimeSeconds / 60);
  const avgSeconds = avgSolveTimeSeconds % 60;
  const avgSolveTimeDisplay = avgSolveTimeSeconds > 0
    ? `${avgMinutes}m ${avgSeconds}s`
    : '0m 0s';

  // Bar chart data from attempt timeline or generate placeholder
  const data = useMemo(() => {
    if (attemptTimeline.length > 0) {
      return attemptTimeline.map((attempt, i) => ({
        id: i,
        value: attempt.timeSpentSeconds || 0,
        color: i >= attemptTimeline.length - 10 ? '#6366f1' : '#2a2a35'
      }));
    }
    // Placeholder if no data
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      value: 5 + Math.random() * 10,
      color: '#2a2a35'
    }));
  }, [attemptTimeline]);

  const attemptCount = attemptTimeline.length;

  return (
    <div className="flex flex-col h-full gap-6">
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#16161a] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <FileText size={18} className="text-[#6366f1]" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">{notesCreated}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">NOTES CREATED</div>
          </div>
        </div>
        <div className="bg-[#16161a] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <Lightbulb size={18} className="text-yellow-400" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">{hintsUsed}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">HINTS USED</div>
          </div>
        </div>
        <div className="bg-[#16161a] border border-[#2a2a35] p-5 rounded-2xl flex flex-col gap-3 shadow-sm">
          <BrainCircuit size={18} className="text-[#6366f1]" />
          <div>
            <div className="text-[22px] font-bold text-gray-100">{independentSolvePercent}%</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">INDEPENDENT SOLVES</div>
          </div>
        </div>
      </div>

      <div className="bg-[#16161a] border border-[#2a2a35] rounded-2xl p-6 flex flex-col flex-1 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[17px] font-bold text-gray-100">
            Growth Trajectory <span className="text-gray-400 font-normal text-sm ml-1">(Last {attemptCount} Attempts)</span>
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1]">
            AVG. TIME: {avgMinutes}M
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
          <span>ATTEMPT {Math.floor(attemptCount / 2)}</span>
          <span>ATTEMPT {attemptCount}</span>
        </div>
      </div>

      <div className="bg-[#16161a] border border-[#2a2a35] rounded-2xl p-6 grid grid-cols-3 gap-4 shadow-sm">
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">TOTAL CODING TIME</span>
          <span className="text-[20px] font-bold text-gray-100">{totalCodingTimeDisplay}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">AVG. SOLVE TIME</span>
          <span className="text-[20px] font-bold text-gray-100">{avgSolveTimeDisplay}</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">AI ASSIST RATIO</span>
          <span className="text-[20px] font-bold text-gray-100">{aiAssistRatio}%</span>
        </div>
      </div>

    </div>
  );
};

export default GrowthTrajectory;