import React from 'react';
import { Target, Lock, ArrowLeft, ArrowUpCircle } from 'lucide-react';

const QuestLockedView = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] p-8 animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="relative bg-[#1e1e24] p-6 rounded-2xl border border-white/5 shadow-2xl">
          <Target className="w-16 h-16 text-blue-400 opacity-80" />
          <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-lg border-2 border-[#111113]">
            <Lock className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Quest Library Locked
        </h2>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Gamify your interview prep with daily challenges and rewards. 
          Available on <span className="text-blue-400 font-semibold">Code Rooms</span> and higher.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#1e1e24] hover:bg-[#2c2c35] text-white rounded-xl font-medium transition-all group border border-white/5"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Library
          </button>
          
          <button
            onClick={() => window.location.href = '/priceoverview'}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowUpCircle className="w-5 h-5" />
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        {[
          { title: 'Daily Quests', desc: 'New challenges every 24 hours' },
          { title: 'XP Rewards', desc: 'Level up your profile' },
          { title: 'Milestones', desc: 'Track long-term consistency' }
        ].map((feat, i) => (
          <div key={feat.title} className="bg-[#16161a] p-5 rounded-xl border border-white/[0.03] text-center">
            <h4 className="text-white font-medium mb-1">{feat.title}</h4>
            <p className="text-gray-500 text-xs">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestLockedView;
