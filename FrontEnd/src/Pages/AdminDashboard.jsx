import React, { useState, useEffect } from "react";
// Forced rebuild to invalidate stale browser bundle 2026-04-02
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Sun, Moon, LayoutGrid, Calendar, Mail, FileText, ChevronDown, ChevronRight,
  Users, Layers, HelpCircle, LogOut, Search, Bell, Info, Shield, Activity, Sparkles,
  Settings, MessageSquare, Package, ShoppingCart, BarChart3, Mail as MailIcon,
  Workflow, Zap as ZapIcon, Globe, Palette, UserPlus, SlidersHorizontal, Share2, MoreHorizontal,
  BookOpen, FolderOpen, Image, Plus, LayoutDashboard
} from "lucide-react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { adminApi } from "../api/admin";
import { docsApi } from "../api/docsApi";

import AdminOverviewTab from "../components/admin/AdminOverviewTab";
import UserManagementTable from "../components/admin/UserManagementTable";
import ActiveSessionList from "../components/admin/ActiveSessionList";
import ProblemManager from "../components/admin/ProblemManager";
import SystemHealthMonitor from "../components/admin/SystemHealthMonitor";
import QuestManager from "../components/admin/QuestManager";
import NotificationManager from "../components/admin/NotificationManager";

// Docs module imports
import DocsDashboard from "../components/admin/docs/DocsDashboard";
import DocsListPage from "../components/admin/docs/DocsListPage";
import DocsCreatePage from "../components/admin/docs/DocsCreatePage";
import DocsCategoryManager from "../components/admin/docs/DocsCategoryManager";
import DocsMediaLibrary from "../components/admin/docs/DocsMediaLibrary";

// ─── Refined Sidebar Sections ────────────────────────────────────────────────
const SIDEBAR_SECTIONS = [
  {
    title: "MAIN MENU",
    items: [
      { id: "overview", label: "Dashboard", icon: LayoutGrid },
      { id: "users", label: "Account", icon: Users },
      { id: "messages", label: "Message", icon: MessageSquare, count: 12 } // mock
    ]
  },
  {
    title: "TOOLS",
    items: [
      { id: "sessions", label: "Activity", icon: Activity },
      { id: "health", label: "System", icon: Sparkles }
    ]
  },
  {
    title: "WORKSPACE",
    items: [
      { id: "problems", label: "Library", icon: FileText },
      { id: "quests", label: "Program", icon: Layers }
    ]
  },
  {
    title: "CONTENT",
    items: [
      { id: "docs", label: "Documentation", icon: BookOpen }
    ]
  }
];

export default function AdminDashboard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await toast.promise(signOut(), {
        loading: 'Signing out...',
        success: 'You have been logged out.',
        error: 'Error signing out.',
      });
      // Clerk handles the redirect automatically
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [activeTab, setActiveTab] = useState("overview");
  const [docsSubTab, setDocsSubTab] = useState("docs-dashboard"); // docs sub-navigation
  const [editingDoc, setEditingDoc] = useState(null);

  // ── Backend Documentation CMS State ──────────────────────────────
  const docsCategoriesQuery = useQuery({ queryKey: ["docs-categories"], queryFn: docsApi.getCategories });
  const docsPagesQuery = useQuery({ queryKey: ["docs-pages"], queryFn: () => docsApi.getPages() });

  const docsCategories = docsCategoriesQuery.data || [];
  const docsPages = docsPagesQuery.data || [];

  // Mutations
  const updateCategoryMutation = useMutation({
    mutationFn: docsApi.upsertCategory,
    onSuccess: () => { queryClient.invalidateQueries(["docs-categories"]); toast.success("Category saved!"); }
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: docsApi.deleteCategory,
    onSuccess: () => { queryClient.invalidateQueries(["docs-categories"]); toast.success("Category deleted!"); }
  });
  const updatePageMutation = useMutation({
    mutationFn: docsApi.upsertPage,
    onSuccess: () => { queryClient.invalidateQueries(["docs-pages"]); queryClient.invalidateQueries(["docs-categories"]); toast.success("Document saved!"); }
  });
  const deletePageMutation = useMutation({
    mutationFn: docsApi.deletePage,
    onSuccess: () => { queryClient.invalidateQueries(["docs-pages"]); toast.success("Document deleted!"); }
  });
  const bulkDeletePagesMutation = useMutation({
    mutationFn: docsApi.bulkDeletePages,
    onSuccess: (data) => { 
      queryClient.invalidateQueries(["docs-pages"]); 
      toast.success(`${data.count} documents deleted!`); 
    }
  });
  const duplicatePageMutation = useMutation({
    mutationFn: (id) => docsApi.duplicatePage(id),
    onSuccess: () => { 
      queryClient.invalidateQueries(["docs-pages"]); 
      toast.success("Document duplicated!"); 
    }
  });

  const handleSaveCategory = (cat) => updateCategoryMutation.mutate({ ...cat, id: cat.slug || cat.id });
  const handleDeleteCategory = (id) => deleteCategoryMutation.mutate(id);

  const handleSaveDoc = (doc) => {
    updatePageMutation.mutate(doc);
    setDocsSubTab("docs-dashboard");
  };

  const handleDeleteDoc = (id) => deletePageMutation.mutate(id);
  const handleToggleDocStatus = (id) => {
    const doc = docsPages.find(p => p.id === id || p._id === id);
    if (!doc) return;
    // Use lowercase to match the backend enum: "draft" | "published"
    const next = (doc.status || "draft").toLowerCase() === "published" ? "draft" : "published";
    updatePageMutation.mutate({ ...doc, slug: doc.slug, status: next });
  };
  const handleBulkDeleteDocs = (ids) => {
    if (confirm(`Are you sure you want to delete ${ids.length} documents?`)) {
      bulkDeletePagesMutation.mutate(ids);
    }
  };
  const handleDuplicateDoc = (id) => duplicatePageMutation.mutate(id);


  // Media is still local for now unles requested
  const [docsMedia, setDocsMedia] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clyric_docsMedia') || '[]'); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem('clyric_docsMedia', JSON.stringify(docsMedia)); }, [docsMedia]);

  const [userParams, setUserParams] = useState({ page: 1, limit: 20, search: "", role: "", status: "" });
  const [problemParams, setProblemParams] = useState({ page: 1, limit: 30, search: "", difficulty: "" });

  const statsQuery = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.getStats, refetchInterval: 30_000 });
  const activityQuery = useQuery({ queryKey: ["admin-activity"], queryFn: adminApi.getRecentActivity, refetchInterval: 20_000, enabled: activeTab === "overview" });
  const breakdownQuery = useQuery({ queryKey: ["admin-sub-breakdown"], queryFn: adminApi.getSubscriptionBreakdown, refetchInterval: 60_000, enabled: activeTab === "overview" });
  const usersQuery = useQuery({ queryKey: ["admin-users", userParams], queryFn: () => adminApi.getUsers(userParams), enabled: activeTab === "users", keepPreviousData: true });
  const problemsQuery = useQuery({ queryKey: ["admin-problems", problemParams], queryFn: () => adminApi.getProblems(problemParams), enabled: activeTab === "problems", keepPreviousData: true });
  const sessionsQuery = useQuery({ queryKey: ["admin-sessions"], queryFn: adminApi.getActiveSessions, enabled: activeTab === "sessions", refetchInterval: 15_000 });
  const questsQuery = useQuery({ queryKey: ["admin-quests"], queryFn: adminApi.getQuests, enabled: activeTab === "quests" });
  const healthQuery = useQuery({ queryKey: ["admin-health"], queryFn: adminApi.getHealth, refetchInterval: 15_000, enabled: activeTab === "health" || activeTab === "overview" });

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
            onSwitchTab={setActiveTab}
          />
        );
      case "messages":
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">Global Broadcast Center</h3>
            <div className="relative">
              <NotificationManager />
            </div>
          </div>
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
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">System Health</h3>
            <div className="relative">
              <SystemHealthMonitor healthData={healthQuery.data} statsError={statsQuery.isError} isFetching={healthQuery.isFetching} />
            </div>
          </div>
        );

      case "docs":
        return (
          <div className={containerClass}>
            {/* Docs Sub-Tab Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-1">
                {[
                  { id: "docs-dashboard", label: "Overview", icon: LayoutDashboard },
                  { id: "docs-list",      label: "All Pages",  icon: FileText },
                  { id: "docs-create",   label: "New Page",    icon: Plus },
                  { id: "docs-categories", label: "Categories", icon: FolderOpen },
                  { id: "docs-media",    label: "Media",       icon: Image },
                ].map(sub => {
                  const SubIcon = sub.icon;
                  const isActive = docsSubTab === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setDocsSubTab(sub.id);
                        if (sub.id !== "docs-create") setEditingDoc(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm border border-slate-200/60"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <SubIcon strokeWidth={2} className="w-3.5 h-3.5" />
                      {sub.label}
                    </button>
                  );
                })}
              </div>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Globe strokeWidth={2} className="w-3.5 h-3.5 text-slate-400" />
                View Live Docs
              </a>
            </div>

            {/* Docs Sub-Tab Content */}
            <div className="relative">
              {docsSubTab === "docs-dashboard" && (
                <DocsDashboard
                  pages={docsPages}
                  categories={docsCategories}
                  media={docsMedia}
                  onNavigate={(tab) => setDocsSubTab(tab)}
                />
              )}
              {docsSubTab === "docs-list" && (
                <DocsListPage
                  pages={docsPages}
                  categories={docsCategories}
                  onNavigate={(tab) => setDocsSubTab(tab)}
                  onEdit={(doc) => { setEditingDoc(doc); setDocsSubTab("docs-create"); }}
                  onDelete={handleDeleteDoc}
                  onBulkDelete={handleBulkDeleteDocs}
                  onDuplicate={handleDuplicateDoc}
                  onToggleStatus={(id) => handleToggleDocStatus(id)}
                />
              )}
              {docsSubTab === "docs-create" && (
                <DocsCreatePage
                  categories={docsCategories}
                  editDoc={editingDoc}
                  onSave={handleSaveDoc}
                  onNavigate={(tab) => { setEditingDoc(null); setDocsSubTab(tab); }}
                />
              )}
              {docsSubTab === "docs-categories" && (
                <DocsCategoryManager
                  categories={docsCategories}
                  onAdd={handleSaveCategory}
                  onUpdate={handleSaveCategory}
                  onDelete={handleDeleteCategory}
                />
              )}
              {docsSubTab === "docs-media" && (
                <DocsMediaLibrary
                  media={docsMedia}
                  onAdd={(items) => setDocsMedia(prev => [...items, ...prev])}
                  onDelete={(id) => setDocsMedia(prev => prev.filter(m => m.id !== id))}
                />
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className={containerClass}>
            <h3 className="text-[22px] font-semibold text-[#18181B] mb-6">Dashboard</h3>
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
          <div className="flex flex-col gap-[3px] group-hover:scale-105 transition-transform">
            <div className="w-[21px] h-[6px] rounded-[2px] rounded-tl-md bg-slate-900"></div>
            <div className="flex gap-[3px]">
              <div className="w-[6px] h-[6px] rounded-[2px] bg-orange-500 shadow-sm bg-slate-900"></div>
              <div className="w-[16px] h-[6px] rounded-[2px] bg-orange-500 shadow-sm shadow-orange-100"></div>
            </div>
            <div className="flex gap-[3px]">
              <div className="w-[13px] h-[6px] bg-transparent"></div>
              <div className="w-[9px] h-[9px] rounded-[2px] rounded-br-md bg-slate-900"></div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] text-slate-900 leading-none">CLYRIC</span>
            <span className="text-[11px] text-slate-400 font-bold mt-1">Admin Portal</span>
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${isActive ? "text-slate-900 bg-slate-50" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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

        {/* Platform Pulse Card */}
        <div className="mt-auto px-1">
          <div className="bg-orange-600 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group border border-white/10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -mr-12 -mt-12 blur-3xl opacity-20 transition-opacity group-hover:opacity-40" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                  <span className="text-[11px] font-black text-orange-100 uppercase tracking-wider">Platform Pulse</span>
                </div>
                <Activity strokeWidth={2.5} className="w-3.5 h-3.5 text-orange-200" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[20px] font-black leading-none">{statsQuery.data?.activeSessionsCount || 0}</span>
                    <span className="text-[10px] font-bold text-orange-100 mt-1 uppercase tracking-tight">Active Sessions</span>
                  </div>
                  <div className="w-12 h-6 flex items-end gap-0.5">
                    {[40, 70, 45, 90, 65].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/40 rounded-t-[1px] group-hover:bg-white transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                  <div className="flex flex-col">
                     <span className="text-[11px] font-bold text-white">API Latency</span>
                     <span className="text-[9px] font-medium text-orange-100">Normal (24ms)</span>
                  </div>
                  <div className="px-2 py-0.5 bg-white/10 border border-white/20 rounded-md text-[9px] font-black text-white uppercase tracking-wider font-sans">Stable</div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('overview')}
                className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-[11px] font-bold transition-all border border-white/20 flex items-center justify-center gap-2 group/btn"
              >
                Detailed Reports
                <ChevronDown className="w-3 h-3 text-orange-100 group-hover/btn:translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex flex-col pt-6 pr-8 pb-6 pl-8 min-w-0 min-h-0 z-10 relative">

        {/* Exact Match Top Navigation Row */}
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">
            {activeTab === "docs"
              ? (() => {
                  const labels = {
                    "docs-dashboard":  "Documentation",
                    "docs-list":       "All Pages",
                    "docs-create":     editingDoc ? "Edit Document" : "New Document",
                    "docs-categories": "Categories",
                    "docs-media":      "Media Library",
                  };
                  return (
                    <span className="flex items-center gap-2">
                      <span className="text-slate-400 font-semibold text-[22px]">Documentation</span>
                      {docsSubTab !== "docs-dashboard" && (
                        <>
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                          <span>{labels[docsSubTab]}</span>
                        </>
                      )}
                    </span>
                  );
                })()
              : SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)?.label || "Dashboard"
            }
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

            <div className="flex items-center p-1 bg-white border border-slate-200/60 rounded-full shadow-sm">
              <img src={user?.imageUrl} className="w-8 h-8 rounded-full  flex-shrink-0" />
            </div>

            <button
              onClick={handleLogout}
              className="w-9 h-9 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all shadow-sm"
              title="Logout"
            >
              <LogOut strokeWidth={2.5} className="w-4 h-4" />
            </button>

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