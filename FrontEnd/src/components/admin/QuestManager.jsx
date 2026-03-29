import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import {
  Plus, X, Loader2, Zap, Sparkles, ShieldAlert, MoreHorizontal,
  Edit2, Trash2, Check, Target, Activity, TrendingUp, Award
} from "lucide-react";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// ─── Config ───────────────────────────────────────────────────────────────────
const typeColor = {
  daily:     "bg-indigo-50 text-indigo-500 border-indigo-100",
  weekly:    "bg-orange-50 text-orange-400 border-orange-100",
  milestone: "bg-rose-50 text-rose-500 border-rose-100",
};

const PIE_COLORS = { daily: "#18181B", weekly: "#f97316", milestone: "#f43f5e" };

const defaultForm = {
  questId: "",
  title: "",
  description: "",
  type: "daily",
  rewardExp: 100,
  isActive: true,
  targetCriteria: { action: "solve", count: 1, difficulty: "any" },
};

const ITEMS_PER_PAGE = 10;

// ─── Component ────────────────────────────────────────────────────────────────
export default function QuestManager({ globalStats, quests, isLoading }) {
  const queryClient = useQueryClient();

  const [showForm, setShowForm]       = useState(false);
  const [editingQuest, setEditingQuest] = useState(null); // null = creating, obj = editing
  const [form, setForm]               = useState(defaultForm);
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuOpen, setMenuOpen]       = useState(null); // questId with open context menu
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm]   = useState("");
  const [typeFilter, setTypeFilter]   = useState("all");

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: adminApi.createQuest,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-quests"]);
      toast.success("Quest created successfully!");
      closeForm();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create quest"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ questId, data }) => adminApi.updateQuest(questId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-quests"]);
      toast.success("Quest updated successfully!");
      closeForm();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update quest"),
  });

  const deleteMutation = useMutation({
    mutationFn: (questId) => adminApi.deleteQuest(questId),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-quests"]);
      toast.success("Quest deleted.");
      setMenuOpen(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete quest"),
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingQuest(null);
    setForm(defaultForm);
    setShowForm(true);
    setMenuOpen(null);
  };

  const openEdit = (quest) => {
    setEditingQuest(quest);
    setForm({
      questId:    quest.questId,
      title:      quest.title,
      description: quest.description,
      type:       quest.type,
      rewardExp:  quest.rewardExp,
      isActive:   quest.isActive,
      targetCriteria: quest.targetCriteria || { action: "solve", count: 1, difficulty: "any" },
    });
    setShowForm(true);
    setMenuOpen(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingQuest(null);
    setForm(defaultForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingQuest) {
      updateMutation.mutate({ questId: editingQuest.questId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (quest) => {
    if (window.confirm(`Delete "${quest.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(quest.questId);
    }
  };

  const handleToggleStatus = (quest) => {
    updateMutation.mutate({
      questId: quest.questId,
      data: { ...quest, isActive: !quest.isActive },
    });
    setMenuOpen(null);
  };

  // ─── Derived Data ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = quests || [];
    if (typeFilter !== "all") list = list.filter(q => q.type === typeFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(q2 => q2.title?.toLowerCase().includes(q) || q2.questId?.toLowerCase().includes(q));
    }
    return list;
  }, [quests, typeFilter, searchTerm]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated    = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const activeCount  = (quests || []).filter(q => q.isActive).length;
  const milestoneCount = (quests || []).filter(q => q.type === "milestone").length;
  const totalXP      = (quests || []).reduce((s, q) => s + (q.rewardExp || 0), 0);
  const completionsToday = (quests || []).reduce((s, q) => s + (q.completionsToday || 0), 0);

  // Charts
  const typeBreakdown = useMemo(() => {
    const map = {};
    (quests || []).forEach(q => { map[q.type] = (map[q.type] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [quests]);

  const xpDistribution = useMemo(() => {
    const buckets = { "0–200": 0, "201–500": 0, "501–1k": 0, "1k+": 0 };
    (quests || []).forEach(q => {
      const xp = q.rewardExp || 0;
      if (xp <= 200) buckets["0–200"]++;
      else if (xp <= 500) buckets["201–500"]++;
      else if (xp <= 1000) buckets["501–1k"]++;
      else buckets["1k+"]++;
    });
    return Object.entries(buckets).map(([name, count]) => ({ name, count }));
  }, [quests]);

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6" onClick={() => setMenuOpen(null)}>

      {/* ── KPI Cards Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-1">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">Active Templates</span>
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
          <span className="text-[32px] font-black text-slate-900 leading-tight block">{activeCount}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">of {quests?.length || 0} total</span>
            <span className="text-[11px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md ml-1">
              {quests?.length ? Math.round((activeCount / quests.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">Completions Today</span>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Check className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <span className="text-[32px] font-black text-slate-900 leading-tight block">{completionsToday}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">vs yesterday</span>
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md ml-1">+5%</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">Milestone Quests</span>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <Award className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <span className="text-[32px] font-black text-slate-900 leading-tight block">{milestoneCount}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">achievement type</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight">Total XP Pool</span>
            <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
          </div>
          <span className="text-[32px] font-black text-slate-900 leading-tight block">{totalXP.toLocaleString()}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">platform-wide XP</span>
          </div>
        </div>
      </div>

      {/* ── Two Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-1">
        {/* Chart 1: Quest Type Donut */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm h-[280px] flex flex-col">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Quest Type Distribution</h4>
          <p className="text-[11px] text-slate-400 mb-4">Breakdown by category</p>
          <div className="flex-1 min-h-0 relative flex items-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeBreakdown}
                    cx="40%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {typeBreakdown.map((entry, i) => (
                      <Cell key={i} fill={PIE_COLORS[entry.name] || "#e2e8f0"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3 pr-2">
              {typeBreakdown.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[entry.name] || "#e2e8f0" }} />
                  <div>
                    <span className="text-[10px] font-black text-slate-700 uppercase block">{entry.name}</span>
                    <span className="text-[10px] font-bold text-slate-400">{entry.value} quests</span>
                  </div>
                </div>
              ))}
              {typeBreakdown.length === 0 && (
                <span className="text-[11px] font-bold text-slate-300 uppercase">No data</span>
              )}
            </div>
          </div>
        </div>

        {/* Chart 2: XP Distribution Bar */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm h-[280px] flex flex-col">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">XP Reward Distribution</h4>
          <p className="text-[11px] text-slate-400 mb-4">Quest count by reward tier</p>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={xpDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#18181B" radius={[4, 4, 0, 0]} barSize={32} name="Quests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Action Bar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search quests..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-4 pr-10 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 shadow-sm w-52"
            />
          </div>
          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>

        <button
          onClick={showForm ? closeForm : openCreate}
          className={`px-5 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2 shadow-sm ${
            showForm ? "bg-white border border-slate-200 text-slate-600 hover:text-slate-900" : "bg-slate-900 text-white hover:bg-black"
          }`}
        >
          {showForm ? <X strokeWidth={2.5} className="w-4 h-4" /> : <Plus strokeWidth={2.5} className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Quest"}
        </button>
      </div>

      {/* ── Create / Edit Form ─────────────────────────────────────────────── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300 relative z-20"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <Sparkles strokeWidth={2.5} className="w-4 h-4 text-slate-900" />
              </div>
              <h3 className="text-[16px] font-bold text-slate-900">
                {editingQuest ? `Editing: ${editingQuest.title}` : "Quest Architect"}
              </h3>
            </div>
            <button type="button" onClick={closeForm} className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quest ID</label>
              <input
                required
                placeholder="solve-3-hards"
                value={form.questId}
                disabled={!!editingQuest}
                onChange={(e) => setForm({ ...form, questId: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none focus:border-slate-400 font-mono disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
              <input
                required
                placeholder="Master of Algorithms"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none focus:border-slate-400"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
              <textarea
                required
                placeholder="Brief description of the objective..."
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">XP Reward</label>
              <input
                type="number"
                min={1}
                required
                value={form.rewardExp}
                onChange={(e) => setForm({ ...form, rewardExp: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none"
              />
            </div>

            {/* Target Criteria */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Action</label>
              <select
                value={form.targetCriteria.action}
                onChange={(e) => setForm({ ...form, targetCriteria: { ...form.targetCriteria, action: e.target.value } })}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="solve">Solve</option>
                <option value="run">Run</option>
                <option value="streak">Streak</option>
                <option value="collaborate">Collaborate</option>
                <option value="polyglot">Polyglot</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Count Target</label>
              <input
                type="number"
                min={1}
                value={form.targetCriteria.count}
                onChange={(e) => setForm({ ...form, targetCriteria: { ...form.targetCriteria, count: parseInt(e.target.value) || 1 } })}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] font-bold focus:outline-none"
              />
            </div>

            {/* Active Toggle */}
            <div className="space-y-1.5 md:col-span-2 flex items-center gap-4">
              <label className="text-[13px] font-bold text-slate-700">Active</label>
              <div
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`w-10 h-5.5 rounded-full relative cursor-pointer transition-all flex items-center ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                style={{ height: '22px', width: '42px' }}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.isActive ? 'right-0.5' : 'left-0.5'}`} />
              </div>
              <span className="text-[12px] font-bold text-slate-400">{form.isActive ? "Enabled" : "Disabled"}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              type="submit"
              disabled={isMutating}
              className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[14px] font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-60"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {editingQuest ? "Save Changes" : "Deploy Quest"}
            </button>
          </div>
        </form>
      )}

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border border-slate-200/60 bg-white rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-left whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-slate-400 font-bold text-[12px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    checked={paginated.length > 0 && selectedIds.length === paginated.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(paginated.map(q => q.questId));
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="px-4 py-4">Quest Blueprint</th>
                <th className="px-4 py-4">Criteria</th>
                <th className="px-4 py-4">Completions</th>
                <th className="px-4 py-4">Reward</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-md" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-md" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-6 w-8 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <ShieldAlert className="w-8 h-8 mx-auto mb-3 text-slate-200" />
                    <p className="font-bold text-slate-700">No quests found.</p>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {searchTerm || typeFilter !== "all" ? "Try adjusting filters." : "Use 'New Quest' to add one."}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((quest) => {
                  const isSelected = selectedIds.includes(quest.questId);
                  const isDeleting = deleteMutation.isPending && deleteMutation.variables === quest.questId;

                  return (
                    <tr
                      key={quest._id}
                      className={`group border-b border-slate-50 transition-all ${isSelected ? 'bg-orange-50/30' : 'hover:bg-slate-50/40'} ${isDeleting ? "opacity-30 pointer-events-none" : ""}`}
                    >
                      <td className="px-6 py-4 relative">
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r" />}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                          onChange={() => setSelectedIds(prev =>
                            prev.includes(quest.questId) ? prev.filter(i => i !== quest.questId) : [...prev, quest.questId]
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 leading-tight">{quest.title}</span>
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{quest.questId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle text-slate-500 font-bold text-[13px]">
                        {quest.targetCriteria?.count}× {quest.targetCriteria?.action}
                      </td>
                      <td className="px-4 py-3 align-middle font-black text-slate-900">
                        {quest.completionsToday || 0}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-orange-400 fill-orange-400" />
                          <span className="font-bold text-slate-900">{quest.rewardExp} XP</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${typeColor[quest.type] || typeColor.daily}`}>
                          {quest.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${
                          quest.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}>
                          {quest.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-3 align-middle text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setMenuOpen(menuOpen === quest.questId ? null : quest.questId)}
                          className="p-1.5 text-slate-300 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Context Menu */}
                        {menuOpen === quest.questId && (
                          <div className="absolute right-6 top-full mt-1 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-50 w-40 text-left">
                            <button
                              onClick={() => openEdit(quest)}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Edit
                            </button>
                            <button
                              onClick={() => handleToggleStatus(quest)}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Activity className="w-3.5 h-3.5 text-slate-400" />
                              {quest.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <div className="border-t border-slate-100 my-1" />
                            <button
                              onClick={() => handleDelete(quest)}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
            <span className="text-[13px] text-slate-400 font-bold">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold"
              >«</button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-bold ${currentPage === page ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                  >{page}</button>
                );
              })}
              {totalPages > 5 && <span className="text-slate-300 px-1">…</span>}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold"
              >»</button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5 flex items-center gap-1 z-[100]">
          <div className="px-5 border-r border-slate-100 text-[13px] font-bold text-slate-900 pr-6">
            {selectedIds.length} <span className="text-slate-400 font-medium ml-1">Selected</span>
          </div>
          <button
            onClick={() => setSelectedIds([])}
            className="px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-full transition-all flex items-center gap-2"
          >
            <X className="w-4 h-4 text-slate-400" /> Clear
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Delete ${selectedIds.length} quests? This cannot be undone.`)) {
                Promise.allSettled(selectedIds.map(id => adminApi.deleteQuest(id))).then(() => {
                  queryClient.invalidateQueries(["admin-quests"]);
                  toast.success(`Deleted ${selectedIds.length} quests.`);
                  setSelectedIds([]);
                });
              }
            }}
            className="px-6 py-2 hover:bg-rose-50 text-rose-600 text-[13px] font-bold rounded-full transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Bulk Delete
          </button>
        </div>
      )}
    </div>
  );
}
