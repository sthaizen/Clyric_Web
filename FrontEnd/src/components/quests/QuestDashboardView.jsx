import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserQuests, useClaimQuest } from './useQuests';
import { useAuth } from "@clerk/clerk-react";
import LevelProgressTracker from './LevelProgressTracker';
import {
  Loader2, Target, Trophy, Swords, ChevronRight,
  BookOpen, Activity, Gift, CheckCircle2, Zap, PlayCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export default function QuestDashboardView({ onNavigateToLibrary }) {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading, error } = useUserQuests(userId);
  const claimMutation = useClaimQuest();

  const [activeTab, setActiveTab] = useState('daily');
  const [selectedQuestId, setSelectedQuestId] = useState(null);

  const quests = data?.quests || [];
  const dailyQuests = quests.filter(q => q.questType === 'daily');
  const weeklyQuests = quests.filter(q => q.questType === 'weekly');
  const milestoneQuests = quests.filter(q => q.questType === 'milestone');

  const getActiveList = () => {
    switch (activeTab) {
      case 'daily': return dailyQuests;
      case 'weekly': return weeklyQuests;
      case 'milestone': return milestoneQuests;
      default: return [];
    }
  };

  const activeQuests = getActiveList();
  const selectedQuest = quests.find(q => q._id === selectedQuestId) || activeQuests[0];

  useEffect(() => {
    if (activeQuests.length > 0 && (!selectedQuestId || !activeQuests.find(q => q._id === selectedQuestId))) {
      setSelectedQuestId(activeQuests[0]._id);
    }
  }, [activeTab, activeQuests, selectedQuestId]);

  const handleClaim = () => {
    if (!selectedQuest) return;

    claimMutation.mutate({ userId, userQuestId: selectedQuest._id }, {
      onSuccess: (res) => {
        if (res.leveledUp) {
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#6366f1', '#10b981', '#fbbf24'] });
          toast.success(`Level Up! You are now Level ${res.stats.currentLevel} 🎉`, {
            style: { background: '#1b1b1f', color: '#fff', border: '1px solid #6366f1' },
            iconTheme: { primary: '#6366f1', secondary: '#fff' }
          });
        } else {
          toast.success(`Claimed ${res.xpAdded} XP!`, {
            style: { background: '#1b1b1f', color: '#fff', border: '1px solid #10b981' }
          });
        }
      },
      onError: () => toast.error("Failed to claim reward.")
    });
  };

  const tabs = [
    { id: 'daily', label: 'Daily', icon: Target },
    { id: 'weekly', label: 'Weekly', icon: Swords },
    { id: 'milestone', label: 'Milestones', icon: Trophy }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] text-indigo-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <span className="text-sm font-medium text-gray-400">Loading library...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-400 bg-red-400/10 rounded-xl border border-red-400/20">
        Failed to load quests. Try refreshing the page.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-5.5rem)] min-h-[650px] max-w-7xl mx-auto w-full border border-[#2c2c35] rounded-xl overflow-hidden bg-[#121216] shadow-2xl">

      {/* LEFT SIDEBAR: Master List */}
      <div className="w-full md:w-[320px] lg:w-[360px] flex flex-col bg-[#16161a] border-r border-[#2c2c35] shrink-0">

        {/* Header / Level Progress */}
        <div className="p-5 border-b border-[#2c2c35] bg-[#1a1a20]">
          <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Quest Library
          </h2>
          <LevelProgressTracker stats={data?.stats} />
        </div>

        {/* Tab Navigation */}
        <div className="flex p-3 gap-1 border-b border-[#2c2c35] bg-[#16161a]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-semibold transition-all ${activeTab === tab.id
                ? 'bg-[#2c2c35] text-gray-100 shadow-sm'
                : 'text-gray-500 hover:text-gray-300 hover:bg-[#1b1b1f]'
                }`}
            >
              <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-indigo-400' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quest List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {activeQuests.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">No quests found.</div>
          ) : (
            activeQuests.map((quest, index) => {
              const isSelected = selectedQuestId === quest._id;
              return (
                <button
                  key={quest._id}
                  onClick={() => setSelectedQuestId(quest._id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl flex items-center justify-between transition-all duration-200 group ${isSelected
                    ? 'bg-indigo-500/10 border border-indigo-500/30 shadow-[inset_0_0_15px_rgba(99,102,241,0.05)]'
                    : 'border border-transparent hover:bg-[#1f1f25] hover:border-[#2c2c35]'
                    }`}
                >
                  <div className="flex flex-col gap-1 pr-3 min-w-0">
                    <span className={`text-[14px] font-medium truncate ${isSelected ? 'text-indigo-100' : 'text-gray-300 group-hover:text-gray-200'}`}>
                      {index + 1}. {quest.template.title}
                    </span>
                    <span className={`text-[12px] font-medium mt-1 ml-4 ${quest.isClaimed || quest.isCompleted
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                      }`}>
                      {quest.isClaimed ? 'Claimed' : quest.isCompleted ? 'Ready to Claim' : 'In Progress'}
                    </span>
                  </div>
                  {isSelected && <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: Detail View */}
      <div className="flex-1 flex flex-col bg-[#0f0f13] relative overflow-hidden">
        {!selectedQuest ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <Target className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a quest to view details</p>
          </div>
        ) : (
          <>
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-48 custom-scrollbar">

              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  {selectedQuest.questType}
                </span>
                <span className="text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded bg-[#1b1b1f] text-gray-400 border border-[#2c2c35] flex items-center gap-1.5">
                  <Gift className="w-3 h-3" /> {selectedQuest.template.rewardExp} XP
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-100 tracking-tight mb-8">
                {selectedQuest.template.title}
              </h1>

              {/* Description Panel */}
              <div className="bg-[#15151a] border border-[#2c2c35] rounded-xl overflow-hidden mb-6">
                <div className="px-5 py-3 border-b border-[#2c2c35] flex items-center gap-2 text-[12px] font-semibold text-gray-400 tracking-wide uppercase">
                  <BookOpen className="w-4 h-4" /> Brief Overview
                </div>
                <div className="p-5 text-[14px] text-gray-300 leading-relaxed">
                  {selectedQuest.template.description}
                </div>
              </div>

              {/* Grid Split: Progress & Rewards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

                {/* Current Progress (Takes up 2/3 of the space on desktop) */}
                <div className="lg:col-span-2 bg-[#101012] border border-[#2c2c35] rounded-xl overflow-hidden flex flex-col">
                  <div className="px-5 py-3 border-b border-[#2c2c35] flex items-center gap-2 text-[12px] font-semibold text-gray-400 tracking-wide uppercase">
                    <Activity className="w-4 h-4" /> Current Progress
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-sm font-medium text-gray-400">Completion Status</span>
                      <span className="text-sm font-bold text-gray-200">
                        {selectedQuest.progress} <span className="text-gray-600">/ {selectedQuest.target}</span>
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#1b1b1f] rounded-full overflow-hidden border border-[#2c2c35]/50 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out relative
                          ${selectedQuest.isCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-blue-500'}`}
                        style={{ width: `${Math.min((selectedQuest.progress / selectedQuest.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Reward Card (Takes up 1/3 of the space on desktop) */}
                <div className="lg:col-span-1 bg-[#15151a] border border-[#2c2c35] rounded-xl overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <Gift className="w-7 h-7 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-100">
                    +{selectedQuest.template.rewardExp} <span className="text-amber-500 text-lg">XP</span>
                  </div>
                  <div className="text-[12px] font-medium text-gray-500 mt-1">Reward upon completion</div>
                </div>

              </div>

              {/* Suggested Action / Jump In Section */}
              {!selectedQuest.isCompleted && (
                <div className="border-t border-[#2c2c35]/50 pt-8 mt-4">
                  <h3 className="text-[13px] font-bold tracking-wide uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" /> Suggested Actions
                  </h3>

                  {/* More Prominent Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                    {/* Action Card 1 */}
                    <div
                      onClick={() => onNavigateToLibrary ? onNavigateToLibrary() : navigate('/problems')}
                      className="flex flex-col p-5 rounded-2xl border border-[#2c2c35] bg-gradient-to-b from-[#16161a] to-[#0f0f13] hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-3 text-indigo-400 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>

                      <h4 className="text-[15px] font-semibold text-gray-200 group-hover:text-white transition-colors mb-1">
                        Browse Library
                      </h4>
                      <p className="text-[13px] text-gray-500 mb-4 flex-1 leading-relaxed">
                        Find problems matching this quest's specific requirements in the main problem library.
                      </p>

                      <div className="flex items-center text-[13px] font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors mt-auto">
                        Go to problems <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Action Card 2 */}
                    <div
                      onClick={() => onNavigateToLibrary ? onNavigateToLibrary() : navigate('/problems')}
                      className="flex flex-col p-5 rounded-2xl border border-[#2c2c35] bg-gradient-to-b from-[#16161a] to-[#0f0f13] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>

                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-3 text-amber-500 group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-5 h-5" />
                      </div>

                      <h4 className="text-[15px] font-semibold text-gray-200 group-hover:text-white transition-colors mb-1">
                        Quick Start
                      </h4>
                      <p className="text-[13px] text-gray-500 mb-4 flex-1 leading-relaxed">
                        Jump straight into a random problem that counts towards completing this quest.
                      </p>

                      <div className="flex items-center text-[13px] font-semibold text-amber-500 group-hover:text-amber-400 transition-colors mt-auto">
                        Start solving <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Pinned Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#16161a]/95 backdrop-blur-md border-t border-[#2c2c35] p-5 flex items-center justify-between z-10">

              <div className="flex items-center gap-2 text-[13px] font-medium text-gray-400">
                Status:
                <span className={selectedQuest.isClaimed ? 'text-gray-500' : selectedQuest.isCompleted ? 'text-emerald-400' : 'text-indigo-400'}>
                  {selectedQuest.isClaimed ? 'Reward Claimed' : selectedQuest.isCompleted ? 'Ready to Claim' : 'In Progress'}
                </span>
              </div>

              {selectedQuest.isClaimed ? (
                <button disabled className="px-6 py-2.5 rounded-lg bg-[#1b1b1f] border border-[#2c2c35] text-gray-500 text-[14px] font-semibold flex items-center gap-2 cursor-not-allowed">
                  <CheckCircle2 className="w-4 h-4" /> Claimed
                </button>
              ) : selectedQuest.isCompleted ? (
                <button
                  onClick={handleClaim}
                  disabled={claimMutation.isPending}
                  className="px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[14px] font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70"
                >
                  {claimMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
                  Claim Reward
                </button>
              ) : (
                <button disabled className="px-6 py-2.5 rounded-lg bg-[#2c2c35] text-gray-400 text-[14px] font-semibold opacity-50 cursor-not-allowed">
                  Claim Reward
                </button>
              )}

            </div>
          </>
        )}
      </div>

    </div>
  );
}