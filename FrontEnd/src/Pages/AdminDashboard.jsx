import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sun, Moon, LayoutGrid, Calendar, Mail, FileText, ChevronDown,
  Users, Layers, HelpCircle, LogOut, Search, Bell, Info, Shield, Activity, Sparkles,
  Settings, MessageSquare, Package, ShoppingCart, BarChart3, Mail as MailIcon, 
  Workflow, Zap as ZapIcon, Globe, Palette, UserPlus, SlidersHorizontal, Share2, MoreHorizontal
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { adminApi } from "../api/admin";

import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import UserManagementTable from "../components/admin/UserManagementTable";
import ActiveSessionList from "../components/admin/ActiveSessionList";
import ProblemManager from "../components/admin/ProblemManager";
import SystemHealthMonitor from "../components/admin/SystemHealthMonitor";
import QuestManager from "../components/admin/QuestManager";

// ─── Refined Sidebar Sections ────────────────────────────────────────────────
const SIDEBAR_SECTIONS = [
  {
    title: "MAIN MENU",
    items: [
      { id: "overview", label: "Dashboard",   icon: LayoutGrid },
      { id: "users",    label: "Account",     icon: Users },
      { id: "messages", label: "Message",     icon: MessageSquare, count: 12 } // mock
    ]
  },
  {
    title: "TOOLS",
    items: [
      { id: "sessions", label: "Activity",    icon: Activity },
      { id: "health",   label: "System",      icon: Sparkles }
    ]
  },
  {
    title: "WORKSPACE",
    items: [
      { id: "problems", label: "Library",     icon: FileText },
      { id: "quests",   label: "Program",     icon: Layers }
    ]
  }
];

export default function AdminDashboard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");

  const [userParams, setUserParams] = useState({ page: 1, limit: 20, search: "", role: "", status: "" });
  const [problemParams, setProblemParams] = useState({ page: 1, limit: 30, search: "", difficulty: "" });

  const statsQuery = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.getStats, refetchInterval: 30_000 });
  const activityQuery = useQuery({ queryKey: ["admin-activity"], queryFn: adminApi.getRecentActivity, refetchInterval: 20_000, enabled: activeTab === "overview" });
  const breakdownQuery = useQuery({ queryKey: ["admin-sub-breakdown"], queryFn: adminApi.getSubscriptionBreakdown, refetchInterval: 60_000, enabled: activeTab === "overview" });
  const usersQuery = useQuery({ queryKey: ["admin-users", userParams], queryFn: () => adminApi.getUsers(userParams), enabled: activeTab === "users", keepPreviousData: true });
  const problemsQuery = useQuery({ queryKey: ["admin-problems", problemParams], queryFn: () => adminApi.getProblems(problemParams), enabled: activeTab === "problems", keepPreviousData: true });
  const sessionsQuery = useQuery({ queryKey: ["admin-sessions"], queryFn: adminApi.getActiveSessions, enabled: activeTab === "sessions", refetchInterval: 15_000 });
  const questsQuery = useQuery({ queryKey: ["admin-quests"], queryFn: adminApi.getQuests, enabled: activeTab === "quests" });

  const updateUserParams = (p) => setUserParams((prev) => ({ ...prev, ...p, page: p.page ?? 1 }));
  const updateProblemParams = (p) => setProblemParams((prev) => ({ ...prev, ...p, page: p.page ?? 1 }));

  const containerClass = "bg-white rounded-[24px] p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[500px] flex-1";

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AdminOverviewTab
            stats={statsQuery.data}
            activities={activityQuery.data?.activity}
            breakdown={breakdownQuery.data}
            isLoading={statsQuery.isLoading || activityQuery.isLoading}
            userName={user?.firstName || user?.fullName || "Admin"}
            subTab="Overview"
          />
        );
      case "users":
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">User Management</h3>
            <div className="relative">
              <UserManagementTable globalStats={statsQuery.data} users={usersQuery.data?.users} pagination={usersQuery.data?.pagination} isLoading={usersQuery.isFetching} onPageChange={(page) => updateUserParams({ page })} onSearch={(search) => updateUserParams({ search })} onFilterChange={(patch) => updateUserParams(patch)} />
            </div>
          </div>
        );
      case "problems":
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">Problem Library</h3>
            <div className="relative">
              <ProblemManager globalStats={statsQuery.data} problems={problemsQuery.data?.problems} pagination={problemsQuery.data?.pagination} isLoading={problemsQuery.isFetching} onPageChange={(page) => updateProblemParams({ page })} onSearch={(search) => updateProblemParams({ search })} onFilterChange={(patch) => updateProblemParams(patch)} />
            </div>
          </div>
        );
      case "sessions":
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">Live Sessions</h3>
            <div className="relative">
              <ActiveSessionList globalStats={statsQuery.data} sessions={sessionsQuery.data?.sessions} isLoading={sessionsQuery.isLoading} onRefresh={() => sessionsQuery.refetch()} />
            </div>
          </div>
        );
      case "quests":
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">Quest Templates</h3>
            <div className="relative">
              <QuestManager globalStats={statsQuery.data} quests={questsQuery.data?.quests} isLoading={questsQuery.isLoading} />
            </div>
          </div>
        );
      case "health":
      default:
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">System Health</h3>
            <div className="relative">
              <SystemHealthMonitor statsError={statsQuery.isError} isFetching={statsQuery.isFetching} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white flex font-sans text-slate-900 relative selection:bg-orange-100">

      {/* ── LEFT SIDEBAR (Refined Blending) ────────────────────────────────────────────── */}
      <aside data-lenis-prevent className="w-[280px] h-full bg-slate-50/50 flex flex-col px-6 py-8 shrink-0 border-r border-slate-200/40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10">
        
        {/* Brand */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-slate-200 group-hover:scale-105 transition-transform">W.</div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] text-slate-900 leading-none">Uxerflow Inc.</span>
            <span className="text-[11px] text-slate-400 font-bold mt-1">Free Plan</span>
          </div>
          <div className="ml-auto w-6 h-6 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 cursor-pointer hover:bg-white hover:text-slate-900 shadow-sm transition-all">«</div>
        </div>

        {/* Improved Search Bar */}
        <div className="relative mb-10 group px-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="Search widget"
            className="w-full pl-10 pr-6 py-2.5 bg-white border border-slate-200/50 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 shadow-sm transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none opacity-40">
            <span className="text-[11px] font-black">⌘</span>
            <span className="text-[11px] font-black">K</span>
          </div>
        </div>

        {/* Grouped Sidebar Navigation */}
        <div className="space-y-10 mb-10">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-4">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                        isActive ? "text-slate-900 bg-slate-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-orange-500 rounded-r-full" />
                      )}
                      <item.icon strokeWidth={2} className={`w-4 h-4 transition-colors ${isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`} />
                      <span className="text-[14px] font-bold tracking-tight">{item.label}</span>
                      {item.count && (
                        <span className="ml-auto bg-slate-100 text-slate-400 text-[10px] font-bold py-0.5 px-1.5 rounded-lg border border-slate-200/50">
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Utils Group */}
        <div className="space-y-1 mb-10 pt-4 border-t border-slate-200/40">
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
              <HelpCircle strokeWidth={2} className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold tracking-tight">Help center</span>
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
              <MessageSquare strokeWidth={2} className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold tracking-tight">Feedback</span>
           </button>
           <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 group">
              <Settings strokeWidth={2} className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] font-bold tracking-tight">Settings</span>
           </button>
        </div>

        {/* Upgrade CTA Card */}
        <div className="mt-auto px-1">
           <div className="bg-orange-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-125 transition-transform" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                   <ZapIcon strokeWidth={2} className="w-5 h-5 text-white fill-white" />
                 </div>
                 <p className="text-[13px] font-bold text-center leading-snug mb-4">Upgrade & unlock <br /> all features</p>
                 <button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[12px] font-bold transition-all border border-white/20">Upgrade Now</button>
              </div>
           </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col pt-6 pr-8 pb-6 pl-8 min-w-0 min-h-0 z-10 relative">
        
        {/* Exact Match Top Navigation Row */}
        <div className="flex justify-between items-center mb-8 px-2">
           <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">
             {SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || "Dashboard"}
           </h2>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <button className="w-9 h-9 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                    <SlidersHorizontal strokeWidth={2} className="w-4 h-4" />
                 </button>
                 <button className="w-9 h-9 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                    <Bell strokeWidth={2} className="w-4 h-4" />
                 </button>
              </div>

              <div className="flex items-center gap-2 px-1.5 py-1 bg-white border border-slate-200/60 rounded-full shadow-sm">
                 <div className="flex -space-x-2">
                    <img src={user?.imageUrl} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500">+3</div>
                 </div>
                 <div className="w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-all">
                    <UserPlus strokeWidth={2} className="w-3.5 h-3.5" />
                 </div>
              </div>

              <button className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm border-dashed">
                 <Palette strokeWidth={2} className="w-4 h-4 text-slate-500" />
                 <span>Customize Widget</span>
              </button>
           </div>
        </div>

        <div data-lenis-prevent className="flex-1 w-full overflow-y-auto transparent-scrollbar min-h-0 rounded-3xl border border-transparent">
          <div className="min-h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}