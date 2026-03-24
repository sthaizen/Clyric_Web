import { CheckCircle2, Gift, Loader2, Target } from "lucide-react";
import React from 'react';

export default function QuestCard({ quest, onClaim, isClaiming }) {
  const { title, description, rewardExp } = quest.template;
  const { progress, target, isCompleted, isClaimed } = quest;

  const percent = Math.min((progress / target) * 100, 100);

  return (
    <div className={`group flex items-center gap-4 p-3 pr-4 rounded-xl border transition-all duration-300
      ${isClaimed ? 'bg-transparent border-[#2c2c35]/40 opacity-50' :
        isCompleted ? 'bg-[#1b1b1f] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:border-emerald-500/60' :
          'bg-[#1b1b1f] border-[#2c2c35] hover:border-blue-500/30 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-blue-500/5'}`}>

      {/* Icon Area */}
      <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-colors duration-300
        ${isClaimed ? 'bg-[#1b1b1f] border-[#2c2c35] text-gray-600' :
          isCompleted ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
            'bg-[#222228] border-[#3e3e42] text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/30'}`}>
        {isCompleted && !isClaimed ? <CheckCircle2 className="w-5 h-5" /> : <Target className="w-5 h-5" />}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex items-center gap-2">
          <h4 className={`text-[15px] font-semibold truncate transition-colors duration-200 ${isCompleted && !isClaimed ? 'text-gray-100' : 'text-gray-200 group-hover:text-white'}`}>
            {title}
          </h4>
          {quest.questType === 'milestone' && (
            <span className="shrink-0 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-amber-400 bg-amber-400/10 border border-amber-400/20">
              One-Time
            </span>
          )}
        </div>
        <p className="text-[13px] text-gray-500 truncate mt-0.5">{description}</p>
      </div>

      {/* Progress & XP Container */}
      <div className="shrink-0 w-48 flex flex-col justify-center px-4 border-l border-[#2c2c35]/50">
        <div className="flex justify-between items-end mb-2">
          <div className="text-[12px] font-medium flex gap-1">
            <span className={isCompleted ? "text-emerald-400 font-bold" : "text-gray-300 font-bold"}>{progress}</span>
            <span className="text-gray-600">/ {target}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md">
            <Gift className="w-3.5 h-3.5" /> {rewardExp} XP
          </div>
        </div>

        {/* Sleek Progress Bar */}
        <div className="h-2 w-full bg-[#111113] rounded-full overflow-hidden border border-[#2c2c35]/50 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out relative
              ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`}
            style={{ width: `${percent}%` }}
          >
            {/* Shimmer effect inside the progress bar */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full h-full transform -skew-x-12 animate-[shimmer_2s_infinite] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="shrink-0 w-28 flex justify-end">
        {isClaimed ? (
          <span className="text-[13px] font-medium text-gray-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Claimed
          </span>
        ) : isCompleted ? (
          <button
            onClick={() => onClaim(quest)}
            disabled={isClaiming}
            className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-gray-900 px-3 py-2 rounded-xl text-[13px] font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isClaiming ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Claim'}
          </button>
        ) : (
          <span className="text-[13px] font-medium text-gray-500 bg-[#222228] px-3 py-1.5 rounded-lg border border-[#2c2c35]">
            In Progress
          </span>
        )}
      </div>

    </div>
  );
}