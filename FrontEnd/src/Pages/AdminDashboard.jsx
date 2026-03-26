import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Users,
  FileText,
  Video,
  Award,
  Activity,
  RefreshCw,
  LogOut,
  Shield,
  Bell,
  Search,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  Square,
  X,
  Calendar,
  Check
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";

import { adminApi } from "../api/admin";
import AdminStatsOverview from "../components/admin/AdminStatsOverview";
import RecentActivityFeed from "../components/admin/RecentActivityFeed";
import UserManagementTable from "../components/admin/UserManagementTable";
import ActiveSessionList from "../components/admin/ActiveSessionList";
import ProblemManager from "../components/admin/ProblemManager";
import SystemHealthMonitor from "../components/admin/SystemHealthMonitor";
import QuestManager from "../components/admin/QuestManager";
import AdminCharts from "../components/admin/AdminCharts";
import KravioOverview from "../components/admin/KravioOverview";

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const navGroups = [
  {
    title: "MAIN NAVIGATION",
    items: [
      { id: "overview", icon: BarChart3, label: "Overview" },
      { id: "users", icon: Users, label: "Users" },
      { id: "problems", icon: FileText, label: "Problems" },
    ]
  },
  {
    title: "ANALYTICS & INSIGHTS",
    items: [
      { id: "sessions", icon: Video, label: "Live Sessions" },
      { id: "quests", icon: Award, label: "Quests" },
      { id: "health", icon: Activity, label: "System Health" },
    ]
  }
];

// All tabs flattened for search
const allNavItems = navGroups.flatMap(g => g.items);

// ─── Query key factories ──────────────────────────────────────────────────────
const userQueryKey = (params) => ["admin-users", params];
const problemQueryKey = (params) => ["admin-problems", params];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");

  // Sidebar search
  const [sidebarSearch, setSidebarSearch] = useState("");

  // Header dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("Last week");

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Users state
  const [userParams, setUserParams] = useState({ page: 1, limit: 20, search: "", role: "", status: "" });

  // Problems state
  const [problemParams, setProblemParams] = useState({ page: 1, limit: 30, search: "", difficulty: "" });

  // ── Queries ────────────────────────────────────────────────────────────────
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminApi.getStats,
    refetchInterval: 30_000,
    retry: 1,
  });

  const activityQuery = useQuery({
    queryKey: ["admin-activity"],
    queryFn: adminApi.getRecentActivity,
    refetchInterval: 20_000,
    enabled: activeTab === "overview",
    retry: 1,
  });

  const usersQuery = useQuery({
    queryKey: userQueryKey(userParams),
    queryFn: () => adminApi.getUsers(userParams),
    enabled: activeTab === "users",
    keepPreviousData: true,
    retry: 1,
  });

  const problemsQuery = useQuery({
    queryKey: problemQueryKey(problemParams),
    queryFn: () => adminApi.getProblems(problemParams),
    enabled: activeTab === "problems",
    keepPreviousData: true,
    retry: 1,
  });

  const sessionsQuery = useQuery({
    queryKey: ["admin-sessions"],
    queryFn: adminApi.getActiveSessions,
    enabled: activeTab === "sessions",
    refetchInterval: 15_000,
    retry: 1,
  });

  const questsQuery = useQuery({
    queryKey: ["admin-quests"],
    queryFn: adminApi.getQuests,
    enabled: activeTab === "quests",
    retry: 1,
  });

  // ── Sidebar search filtering ──────────────────────────────────────────────
  const filteredNavGroups = useMemo(() => {
    if (!sidebarSearch.trim()) return navGroups;
    const q = sidebarSearch.toLowerCase();
    return navGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => item.label.toLowerCase().includes(q))
      }))
      .filter(group => group.items.length > 0);
  }, [sidebarSearch]);

  // ── Notifications from real activity data ─────────────────────────────────
  const notifications = useMemo(() => {
    const items = [];
    const stats = statsQuery.data;
    if (stats?.users?.newToday > 0) {
      items.push({ id: "new-users", label: `${stats.users.newToday} new user${stats.users.newToday > 1 ? "s" : ""} registered today`, type: "info", time: "Today" });
    }
    if (stats?.submissions?.failedToday > 3) {
      items.push({ id: "failed-subs", label: `${stats.submissions.failedToday} failed submissions today`, type: "warning", time: "Today" });
    }
    if (stats?.sessions?.active > 0) {
      items.push({ id: "live-sessions", label: `${stats.sessions.active} live coding session${stats.sessions.active > 1 ? "s" : ""} active`, type: "info", time: "Now" });
    }
    if (stats?.quests?.completedToday > 0) {
      items.push({ id: "quests-done", label: `${stats.quests.completedToday} quest${stats.quests.completedToday > 1 ? "s" : ""} completed today`, type: "success", time: "Today" });
    }
    if (items.length === 0) {
      items.push({ id: "no-notif", label: "No new notifications", type: "muted", time: "" });
    }
    return items;
  }, [statsQuery.data]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateUserParams = (patch) => setUserParams((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  const updateProblemParams = (patch) => setProblemParams((prev) => ({ ...prev, ...patch, page: patch.page ?? 1 }));
  const getActiveTabLabel = () => {
    const item = allNavItems.find(i => i.id === activeTab);
    return item?.label || "Dashboard";
  };

  const handleNavClick = (id) => {
    setActiveTab(id);
    setSidebarSearch("");
    setSidebarOpen(false);
  };

  // Close dropdowns when clicking elsewhere
  const handleMainClick = () => {
    setShowNotifications(false);
    setShowDatePicker(false);
    setShowSettings(false);
  };

  // ── Render active section ─────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="flex flex-col gap-10">
            <KravioOverview
               stats={statsQuery.data}
               activities={activityQuery.data?.activity}
               isLoading={statsQuery.isLoading || activityQuery.isLoading}
               onRefreshActivity={() => activityQuery.refetch()}
               isFetchingActivity={activityQuery.isFetching}
               userName={user?.firstName || user?.fullName || "Admin"}
            />

            <div>
               <div className="flex items-center gap-2 mb-6">
                 <h2 className="text-[18px] font-semibold text-slate-900">Platform Analytics & Telemetry</h2>
                 <div className="h-px flex-1 bg-slate-200 ml-4"></div>
               </div>
               <div className="flex flex-col gap-6">
                 <AdminStatsOverview stats={statsQuery.data} isLoading={statsQuery.isLoading} />
                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                   <div className="xl:col-span-2 space-y-6">
                      <AdminCharts trends={statsQuery.data?.trends} />
                   </div>
                   <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                     <div className="flex items-center justify-between mb-5">
                       <h3 className="text-[15px] font-semibold text-slate-900">Recent Activity</h3>
                       <button
                         onClick={() => activityQuery.refetch()}
                         className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                       >
                         <RefreshCw className={`w-3.5 h-3.5 ${activityQuery.isFetching ? "animate-spin" : ""}`} />
                       </button>
                     </div>
                     <RecentActivityFeed
                       activity={activityQuery.data?.activity}
                       isLoading={activityQuery.isLoading}
                       onViewAll={() => {/* Already on overview, scroll is implicit */}}
                     />
                   </div>
                 </div>
               </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <div className="flex items-center justify-between mb-5">
               <h3 className="text-[15px] font-semibold text-slate-900">User Management</h3>
               {usersQuery.data?.pagination && (
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                   {usersQuery.data.pagination.total.toLocaleString()} total
                 </span>
               )}
             </div>
             <UserManagementTable
               users={usersQuery.data?.users}
               pagination={usersQuery.data?.pagination}
               isLoading={usersQuery.isLoading || usersQuery.isFetching}
               onPageChange={(page) => updateUserParams({ page })}
               onSearch={(search) => updateUserParams({ search })}
               onFilterChange={(patch) => updateUserParams(patch)}
             />
          </div>
        );

      case "problems":
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
               <h3 className="text-[15px] font-semibold text-slate-900">Problem Library</h3>
               {problemsQuery.data?.pagination && (
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                   {problemsQuery.data.pagination.total} problems
                 </span>
               )}
             </div>
             <ProblemManager
               problems={problemsQuery.data?.problems}
               pagination={problemsQuery.data?.pagination}
               isLoading={problemsQuery.isLoading || problemsQuery.isFetching}
               onPageChange={(page) => updateProblemParams({ page })}
               onSearch={(search) => updateProblemParams({ search })}
               onFilterChange={(patch) => updateProblemParams(patch)}
             />
          </div>
        );

      case "sessions":
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Live Collaborative Sessions</h3>
             <ActiveSessionList
               sessions={sessionsQuery.data?.sessions}
               isLoading={sessionsQuery.isLoading}
               onRefresh={() => sessionsQuery.refetch()}
             />
          </div>
        );

      case "quests":
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <h3 className="text-[15px] font-semibold text-slate-900 mb-5">Quest Templates</h3>
             <QuestManager quests={questsQuery.data?.quests} isLoading={questsQuery.isLoading} />
          </div>
        );

      case "health":
        return (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
             <h3 className="text-[15px] font-semibold text-slate-900 mb-5">System Health</h3>
             <SystemHealthMonitor statsError={statsQuery.isError} isFetching={statsQuery.isFetching} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* ── Mobile Overlay ──────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`fixed left-0 top-0 h-full w-[260px] bg-white border-r border-slate-200 flex flex-col z-50 shadow-sm transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        {/* Brand */}
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-slate-100">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
              <Shield className="w-4 h-4" />
           </div>
           <span className="font-semibold text-[17px] tracking-tight text-slate-900">Tanvi</span>
           <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-slate-200 ml-auto">OS</span>
        </div>

        {/* Search — FUNCTIONAL: filters sidebar nav items */}
        <div className="p-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                 placeholder="Search pages..."
                 value={sidebarSearch}
                 onChange={(e) => setSidebarSearch(e.target.value)}
                 className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
              {sidebarSearch ? (
                <button
                  onClick={() => setSidebarSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                   <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-sm">⌘</kbd>
                   <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-sm">K</kbd>
                </div>
              )}
           </div>
        </div>

        {/* Navigation — FUNCTIONAL: filters by search */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 pb-6">
           {filteredNavGroups.length === 0 ? (
             <div className="px-3 py-8 text-center">
               <Search className="w-5 h-5 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-400 text-[13px]">No pages match "{sidebarSearch}"</p>
             </div>
           ) : (
             filteredNavGroups.map((group, gIdx) => (
               <div key={gIdx}>
                  <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                     {group.title}
                  </h4>
                  <div className="space-y-0.5">
                     {group.items.map(({ id, icon: Icon, label }) => {
                        const isActive = activeTab === id;
                        return (
                           <button
                             key={id}
                             onClick={() => handleNavClick(id)}
                             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all
                               ${isActive
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                               }`}
                           >
                              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                              {label}
                           </button>
                        );
                     })}
                  </div>
               </div>
             ))
           )}
        </nav>

        {/* Footer: User Profile + Sign Out */}
        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer">
              {user?.imageUrl ? (
                 <img src={user.imageUrl} alt="admin" className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm" />
              ) : (
                 <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700 shadow-sm">
                   {user?.firstName?.[0] ?? "A"}
                 </div>
              )}
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold text-slate-900 truncate">{user?.fullName ?? "Administrator"}</p>
                 <p className="text-[11px] text-slate-500 truncate">{user?.primaryEmailAddress?.emailAddress ?? "admin@tanvihost.com"}</p>
              </div>
              <button
                 onClick={() => signOut()}
                 className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                 title="Sign Out"
              >
                 <LogOut className="w-4 h-4" />
              </button>
           </div>
        </div>

      </aside>

      {/* ── Main Content Area ───────────────────────────────────────────────── */}
      <main className="lg:ml-[260px] flex-1 flex flex-col min-h-screen" onClick={handleMainClick}>

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">

           {/* Left: Mobile menu + Breadcrumbs */}
           <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-[14px]">
                 <div className="flex items-center gap-2 text-slate-400 font-medium tracking-tight">
                    <Square className="w-4 h-4" />
                    Admin
                 </div>
                 <span className="text-slate-300">/</span>
                 <span className="font-semibold text-slate-900 truncate">{getActiveTabLabel()}</span>
              </div>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-2">

              {/* Date Range Picker — FUNCTIONAL dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowDatePicker(!showDatePicker); setShowNotifications(false); setShowSettings(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none"
                >
                   <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                   {selectedDateRange}
                   <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {showDatePicker && (
                  <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-[170px] z-50 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
                    {["Today", "Yesterday", "Last week", "Last month", "Last 90 days"].map((range) => (
                      <button
                        key={range}
                        onClick={() => { setSelectedDateRange(range); setShowDatePicker(false); }}
                        className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition-colors flex items-center justify-between ${
                          selectedDateRange === range ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {range}
                        {selectedDateRange === range && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-slate-200 hidden sm:block" />

              {/* Notifications — FUNCTIONAL dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowNotifications(!showNotifications); setShowDatePicker(false); setShowSettings(false); }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition relative"
                >
                   <Bell className="w-4.5 h-4.5" />
                   {notifications.length > 0 && notifications[0].type !== "muted" && (
                     <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
                   )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-xl shadow-xl w-[320px] z-50 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-slate-900">Notifications</span>
                      <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{notifications.filter(n=>n.type!=="muted").length}</span>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${n.type === "muted" ? "opacity-60" : ""}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              n.type === "warning" ? "bg-amber-500" : n.type === "success" ? "bg-emerald-500" : n.type === "info" ? "bg-indigo-500" : "bg-slate-300"
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] text-slate-700 font-medium">{n.label}</p>
                              {n.time && <p className="text-[11px] text-slate-400 mt-0.5">{n.time}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings — FUNCTIONAL dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowDatePicker(false); setShowNotifications(false); }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
                >
                   <Settings className="w-4.5 h-4.5" />
                </button>
                {showSettings && (
                  <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-[180px] z-50 animate-in fade-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { statsQuery.refetch(); activityQuery.refetch(); setShowSettings(false); }}
                      className="w-full text-left px-3 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      Refresh All Data
                    </button>
                    <button
                      onClick={() => { handleNavClick("health"); setShowSettings(false); }}
                      className="w-full text-left px-3 py-2.5 text-[13px] text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      System Health
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { signOut(); }}
                        className="w-full text-left px-3 py-2.5 text-[13px] text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {statsQuery.isFetching && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 ml-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing
                </div>
              )}
           </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 max-w-[1400px] w-full mx-auto">

           {/* Error banner */}
           {statsQuery.isError && (
             <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-2 shadow-sm">
               <Shield className="w-4 h-4 text-rose-500" />
               <p>
                 <span className="font-semibold text-rose-700">Connection Error:</span> Could not reach the backend telemetry.
                 {statsQuery.error?.response?.status === 403 && (
                   <span className="ml-1">Admin access denied.</span>
                 )}
               </p>
               <button
                 onClick={() => statsQuery.refetch()}
                 className="ml-auto px-3 py-1 text-[12px] font-medium bg-rose-100 hover:bg-rose-200 rounded-lg text-rose-700 transition-colors"
               >
                 Retry
               </button>
             </div>
           )}

           {/* Active Tab Content */}
           <div className="animate-in fade-in duration-500">
              {renderContent()}
           </div>
        </div>

      </main>
    </div>
  );
}