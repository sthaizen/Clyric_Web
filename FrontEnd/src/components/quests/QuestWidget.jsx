import React from 'react';
import { Trophy } from 'lucide-react';
import { useUserQuests } from './useQuests';
import { useAuth } from "@clerk/clerk-react";

export default function QuestWidget({ onClick }) {
  const { userId } = useAuth();
  const { data } = useUserQuests(userId);

  const quests = data?.quests || [];
  const unclaimedCount = quests.filter(q => q.isCompleted && !q.isClaimed).length;

  const currentLevel = data?.stats?.currentLevel ?? 1;
  const currentExp = data?.stats?.totalExp ?? 0;

  // Level Logic
  const expForCurrentLevel = currentLevel > 1 ? Math.pow(currentLevel - 1, 2) * 100 : 0;
  const expForNextLevel = Math.pow(currentLevel, 2) * 100;
  const expEarnedThisLevel = currentExp - expForCurrentLevel;
  const expNeededThisLevel = expForNextLevel - expForCurrentLevel;
  const progressPercent = Math.min((expEarnedThisLevel / expNeededThisLevel) * 100, 100) || 0;

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-[#201a2b] bg-[#16161a] p-4 transition-all hover:border-indigo-500/50 hover:bg-[#18181f]"
    >
      {/* Top Row: Level & XP */}
      <div className="flex items-end justify-between mb-5">
        <div className="flex flex-col items-start text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Level</span>
            {unclaimedCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-500">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                {unclaimedCount} REWARDS
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{currentLevel}</span>
            <span className="text-sm font-medium text-gray-500">Rank Member</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
            <Trophy className="h-3 w-3" /> Total XP
          </span>
          <span className="text-lg font-semibold text-gray-200 tabular-nums leading-none">
            {currentExp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Integrated Progress */}
      <div className="space-y-2">
        <div className="h-2 w-full bg-[#111113] rounded-full overflow-hidden border border-[#2c2c35]/50 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out relative"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect inside the progress bar */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 w-full h-full transform -skew-x-12 animate-shimmer" />
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-medium tracking-tight">
          <span className="text-gray-400">
            <span className="text-gray-200">{expEarnedThisLevel.toLocaleString()}</span>
            <span className="mx-1 text-gray-600">/</span>
            {expNeededThisLevel.toLocaleString()} XP
          </span>
          <span className="text-gray-500 group-hover:text-indigo-400 transition-colors">
            {Math.round(100 - progressPercent)}% to Level {currentLevel + 1}
          </span>
        </div>
      </div>
    </button>
  );
}