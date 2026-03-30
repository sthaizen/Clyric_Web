import React, { useState } from "react";
import { 
  Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Loader2, AlertTriangle, 
  BarChart2, Activity, PieChart as PieChartIcon, CheckCircle, CheckCircle2, 
  MoreHorizontal, Star, X, Layout, BarChart3, AlertCircle 
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import ProblemFormModal from "./ProblemFormModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { parseISO, format } from "date-fns";

const difficultyConfig = {
  easy: { label: "EASY", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  medium: { label: "MEDIUM", class: "bg-orange-50 text-orange-500 border-orange-100" },
  hard: { label: "HARD", class: "bg-rose-50 text-rose-500 border-rose-100" },
};

export default function ProblemManager({ globalStats, problems, pagination, isLoading, onPageChange, onSearch, onFilterChange }) {
  const queryClient = useQueryClient();
  const [searchVal, setSearchVal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const createMutation = useMutation({
    mutationFn: adminApi.createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-problems"]);
      toast.success("Problem created successfully!");
      setIsModalOpen(false);
      setEditingProblem(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create problem");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, data }) => adminApi.updateProblem(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-problems"]);
      toast.success("Problem updated successfully!");
      setIsModalOpen(false);
      setEditingProblem(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update problem");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProblem,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-problems"]);
      toast.success("Problem deleted successfully!");
      setDeletingSlug(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete problem");
      setDeletingSlug(null);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchVal);
  };

  const handleOpenCreate = () => {
    setEditingProblem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (problem) => {
    setEditingProblem(problem);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingProblem) {
      updateMutation.mutate({ slug: editingProblem.slug || editingProblem.problemId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (slug) => {
    if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
      setDeletingSlug(slug);
      deleteMutation.mutate(slug);
    }
  };

  // Format charts
  const submissionTrends = globalStats?.trends?.submissions?.map(item => ({
    date: format(parseISO(item._id), "dd MMM"),
    Total: item.total,
    Passed: item.accepted,
    Failed: item.total - item.accepted
  })) || [];

  const pieColors = { "Easy": "#10b981", "Medium": "#f59e0b", "Hard": "#ef4444" };
  const difficultyData = globalStats?.trends?.difficulties?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  return (
    <div className="space-y-6">

       {/* Analytics Header Section (4-Column KPI row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 px-1">
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[13px] font-bold text-slate-400 block tracking-tight">Total Problems</span>
             <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
                <Layout className="w-4 h-4 text-slate-400" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-black text-slate-900 leading-tight">{globalStats?.problems?.total || 0}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">vs last month</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" /> 8 items
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[13px] font-bold text-slate-400 block tracking-tight">Solved Today</span>
             <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-black text-slate-900 leading-tight">{globalStats?.submissions?.today || 0}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">Daily average</span>
              <span className="text-[11px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-md">
                +14.2%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[13px] font-bold text-slate-400 block tracking-tight">Global Pass Rate</span>
             <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-black text-slate-900 leading-tight">{globalStats?.submissions?.acceptanceRateToday || 0}%</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">Overall health</span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  (globalStats?.submissions?.acceptanceRateToday || 0) > 60 ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'
                }`}>
                Stable
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
             <span className="text-[13px] font-bold text-slate-400 block tracking-tight">Critical Issues</span>
             <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                <AlertCircle className="w-4 h-4 text-rose-500" />
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-black text-slate-900 leading-tight">{globalStats?.problems?.highPriorityIssues || 0}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">Needs attention</span>
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                  (globalStats?.problems?.highPriorityIssues || 0) === 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'
                }`}>
                { (globalStats?.problems?.highPriorityIssues || 0) === 0 ? 'None' : 'Urgent' }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Analytics Row (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 px-1">
        {/* Attempt Performance (Main Trend) */}
        <div className="lg:col-span-2 border border-slate-200/40 bg-white rounded-2xl p-6 shadow-sm h-[340px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Attempt Performance</h4>
               <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Last 7 Days Trend</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Passed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Failed</span>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionTrends} margin={{ top: 0, right: 10, left: -20, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="Passed" fill="#4f46e5" radius={[3, 3, 0, 0]} barSize={12} />
                <Bar dataKey="Failed" fill="#e2e8f0" radius={[3, 3, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Difficulty Breakdown (Donut) */}
        <div className="lg:col-span-1 border border-slate-200/40 bg-white rounded-2xl p-6 shadow-sm h-[340px] flex flex-col relative">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Problem Difficulty</h4>
          <div className="flex-1 min-h-0 relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie
                      data={globalStats?.trends?.difficulties?.map(d => ({ name: d._id, value: d.count })) || []}
                      cx="50%" cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                   >
                      { (globalStats?.trends?.difficulties || []).map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={
                            entry._id?.toLowerCase() === 'easy' ? '#10b981' : 
                            entry._id?.toLowerCase() === 'medium' ? '#f59e0b' : '#ef4444'
                         } />
                      ))}
                   </Pie>
                   <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <span className="block text-[22px] font-black text-slate-900 leading-none">{globalStats?.problems?.total || 0}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Total</span>
             </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
             {['Easy', 'Medium', 'Hard'].map(level => {
                const count = globalStats?.trends?.difficulties?.find(d => d._id?.toLowerCase() === level.toLowerCase())?.count || 0;
                return (
                   <div key={level} className="flex flex-col items-center">
                      <span className={`text-[10px] font-bold mb-1 uppercase ${
                         level === 'Easy' ? 'text-emerald-500' : level === 'Medium' ? 'text-orange-500' : 'text-rose-500'
                      }`}>{level}</span>
                      <span className="text-[12px] font-black text-slate-900">{count}</span>
                   </div>
                );
             })}
          </div>
        </div>

        {/* Language Usage (Horizontal Bar) */}
        <div className="lg:col-span-1 border border-slate-200/40 bg-white rounded-2xl p-6 shadow-sm h-[340px] flex flex-col relative overflow-hidden">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Language Popularity</h4>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
             { (globalStats?.trends?.languages || []).slice(0, 5).map((lang, idx) => {
                const totalSubs = globalStats?.trends?.languages?.reduce((acc, l) => acc + l.count, 0) || 1;
                const percentage = Math.round((lang.count / totalSubs) * 100);
                return (
                   <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center px-0.5">
                         <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{lang._id || 'Unknown'}</span>
                         <span className="text-[10px] font-bold text-slate-400">{percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-200/20">
                         <div 
                           className="h-full bg-indigo-500 rounded-full transition-all duration-1000" 
                           style={{ width: `${percentage}%` }}
                         />
                      </div>
                   </div>
                );
             })}
             { (!globalStats?.trends?.languages || globalStats.trends.languages.length === 0) && (
                <div className="h-full flex flex-col items-center justify-center opacity-40">
                   <Activity className="w-8 h-8 text-slate-300 mb-2" />
                   <span className="text-[11px] font-bold text-slate-400 uppercase">No usage data</span>
                </div>
             )}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-50">
             <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Top Engine</span>
                <span className="text-indigo-600">V8 Runtime</span>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-1 gap-2 max-w-2xl min-w-0">
          <form onSubmit={handleSearch} className="flex-1 min-w-0 flex">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search library..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[14px] text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-all shadow-sm"
              />
            </div>
          </form>
          <select
            onChange={(e) => onFilterChange({ difficulty: e.target.value })}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[14px] font-bold text-slate-900 hover:bg-slate-50 focus:outline-none focus:border-slate-300 shadow-sm transition-colors cursor-pointer appearance-none min-w-[110px]"
          >
            <option value="">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-[14px] font-bold transition-all shadow-sm group"
        >
          <Plus strokeWidth={2.5} className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          <span>Add New Problem</span>
        </button>
      </div>

      {/* Redesigned Table */}
      <div className="overflow-hidden border border-slate-200/60 bg-white rounded-2xl shadow-sm pb-1 mb-6">
        <div className="overflow-x-auto transparent-scrollbar">
          <table className="w-full text-[14px] text-left whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-slate-400 font-bold text-[13px]">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(problems?.map(p => p.problemId) || []);
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Problem Detail</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Metics</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Submissions</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right pr-8"><Plus className="w-4 h-4 ml-auto text-slate-500" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-2 w-32 bg-gray-100 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-gray-100 rounded-md" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-28 bg-gray-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-gray-100 rounded-md" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-gray-100 rounded-lg inline-block" /></td>
                  </tr>
                ))
              ) : !problems?.length ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-gray-500 font-bold">
                    No problems matching criteria found.
                  </td>
                </tr>
              ) : (
                problems.map((problem) => {
                  const diff = difficultyConfig[problem.difficulty] || difficultyConfig.easy;
                  const isDeleting = deletingSlug === problem.problemId;
                  const isSelected = selectedIds.includes(problem.problemId);

                  return (
                    <tr key={problem._id} className={`group border-b border-slate-50 transition-all ${isSelected ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'} ${isDeleting ? "opacity-30" : ""}`}>
                      <td className="px-6 py-4 relative">
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                          onChange={() => {
                            setSelectedIds(prev => prev.includes(problem.problemId) ? prev.filter(i => i !== problem.problemId) : [...prev, problem.problemId]);
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 leading-tight">{problem.title}</span>
                          <span className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{problem.problemId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1.5 font-bold text-slate-500 text-[13px]">
                          {problem.stats?.acceptanceRate}% AC
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                          {problem.category || 'General'}
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${diff.class}`}>
                          {diff.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-slate-900 font-bold text-[13px]">
                        {problem.totalSubmissions || problem.stats?.totalAttempts || 0}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${problem.status === 'published'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : problem.status === 'archived'
                              ? 'bg-rose-50 text-rose-500 border-rose-100'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {problem.status || 'draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-right pr-8">
                        <button
                          onClick={() => handleOpenEdit(problem)}
                          className="text-slate-300 hover:text-slate-900 p-1.5 transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

         {/* Improved Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500 font-bold">Showing per page</span>
            <select 
              value={pagination?.limit || 10}
              onChange={(e) => onFilterChange({ limit: parseInt(e.target.value), page: 1 })}
              className="bg-slate-50 border border-slate-200/60 rounded-lg text-[12px] font-bold px-2 py-1 focus:outline-none cursor-pointer hover:border-slate-300 transition-colors"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination && onPageChange(pagination.page - 1)}
              disabled={!pagination || pagination.page <= 1}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30"
            >
              «
            </button>
            <div className="flex items-center gap-1">
              {pagination && Array.from({ length: Math.min(pagination.totalPages, 3) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${pagination.page === i + 1 ? 'bg-orange-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {i + 1}
                </button>
              ))}
              {pagination?.totalPages > 3 && <span className="text-slate-300 px-1">...</span>}
              {pagination?.totalPages > 3 && (
                <button
                  onClick={() => onPageChange(pagination.totalPages)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${pagination.page === pagination.totalPages ? 'bg-orange-600 text-white shadow-sm' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {pagination.totalPages}
                </button>
              )}
            </div>
            <button
              onClick={() => pagination && onPageChange(pagination.page + 1)}
              disabled={!pagination || pagination.page >= pagination.totalPages}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30"
            >
              »
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500 font-bold">Go to page</span>
            <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1 focus-within:border-slate-300 transition-colors">
              <input
                type="text"
                className="w-8 bg-transparent text-[12px] font-bold text-slate-900 outline-none"
                placeholder={pagination?.page}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const p = parseInt(e.target.value);
                    if (p > 0 && p <= pagination.totalPages) {
                      onPageChange(p);
                      e.target.value = '';
                    }
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling;
                  const p = parseInt(input.value);
                  if (p > 0 && p <= pagination?.totalPages) {
                    onPageChange(p);
                    input.value = '';
                  }
                }}
                className="text-[11px] font-black text-indigo-600 ml-1 hover:text-indigo-700"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar (Exact Match) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-[calc(50%+140px)] -translate-x-1/2 bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-2 flex items-center gap-2 z-50 animate-in slide-in-from-bottom-10">
          <div className="px-4 border-r border-slate-100 text-[13px] font-bold text-slate-900">{selectedIds.length} Selected</div>
          <button
            onClick={() => { setSelectedIds([]); toast.success("Selection cleared"); }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-xl transition-all"
          >
            <X className="w-4 h-4 text-slate-400" />
            <span>Clear</span>
          </button>
          <button
            onClick={() => handleDelete(selectedIds[0])}
            className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 text-[13px] font-bold rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Bulk Delete</span>
          </button>
        </div>
      )}

      <ProblemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProblem(null);
        }}
        isPending={createMutation.isPending || updateMutation.isPending}
        initialData={editingProblem}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
