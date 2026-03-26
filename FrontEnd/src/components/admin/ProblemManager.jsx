import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Loader2, AlertTriangle, BarChart2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import ProblemFormModal from "./ProblemFormModal";

const difficultyConfig = {
  easy: { label: "Easy", class: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  medium: { label: "Medium", class: "bg-amber-50 text-amber-700 border-amber-200" },
  hard: { label: "Hard", class: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function ProblemManager({ problems, pagination, isLoading, onPageChange, onSearch, onFilterChange }) {
  const queryClient = useQueryClient();
  const [searchVal, setSearchVal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);

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

  return (
    <div className="space-y-4">
      {/* Light Theme Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex flex-1 gap-2 max-w-2xl min-w-0">
          <form onSubmit={handleSearch} className="flex-1 min-w-0 flex">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search problems by title or slug..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
              />
            </div>
            <button type="submit" className="hidden"></button>
          </form>
          <select
            onChange={(e) => onFilterChange({ difficulty: e.target.value })}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer appearance-none min-w-[130px]"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-medium transition-all shadow-sm shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Create Problem
        </button>
      </div>

      {/* Light Theme Data Table */}
      <div className="overflow-hidden border border-slate-200 bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Problem Title</th>
                <th className="px-5 py-3.5">Difficulty</th>
                <th className="px-5 py-3.5">Performance</th>
                <th className="px-5 py-3.5">Engagement</th>
                <th className="px-5 py-3.5">Insights</th>
                <th className="px-5 py-3.5 text-right flex-shrink-0 min-w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="space-y-2 w-full">
                        <div className="h-4 w-48 bg-slate-100 rounded" />
                        <div className="h-2 w-32 bg-slate-50 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-slate-100 rounded-md" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-28 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-24 bg-slate-100 rounded-md" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-8 w-16 bg-slate-100 rounded-lg inline-block" /></td>
                  </tr>
                ))
              ) : !problems?.length ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                    No problems matching criteria found.
                  </td>
                </tr>
              ) : (
                problems.map((problem) => {
                  const diff = difficultyConfig[problem.difficulty] || difficultyConfig.easy;
                  const acceptance = problem.stats?.acceptanceRate ?? 0;
                  const isDeleting = deletingSlug === problem.problemId;
                  
                  return (
                    <tr key={problem._id} className={`hover:bg-slate-50/80 transition-colors group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}>
                      <td className="px-5 py-3 align-middle">
                        <div className="min-w-0">
                          <p className="text-slate-900 font-semibold truncate leading-tight">{problem.title}</p>
                          <p className="text-slate-400 text-[11px] truncate mt-0.5 font-mono bg-slate-50 px-1 py-0.5 rounded border border-slate-100 inline-block">{problem.problemId}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${diff.class}`}>
                          {diff.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="w-full max-w-[140px]">
                          <div className="flex justify-between text-[11px] font-medium mb-1.5">
                            <span className="text-slate-500">Acceptance Rate</span>
                            <span className={acceptance >= 50 ? 'text-emerald-600' : acceptance >= 30 ? 'text-amber-600' : 'text-rose-600'}>
                              {acceptance}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div 
                              className={`h-full ${acceptance >= 50 ? 'bg-emerald-500' : acceptance >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${acceptance}%` }}
                            />
                            <div 
                              className="h-full bg-transparent transition-all"
                              style={{ width: `${100 - acceptance}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="flex items-center gap-3">
                           <div className="flex flex-col items-start leading-tight">
                             <span className="text-slate-900 font-semibold">{problem.stats?.totalAttempts?.toLocaleString() ?? 0}</span>
                             <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Attempts</span>
                           </div>
                           <div className="w-px h-6 bg-slate-200" />
                           <div className="flex flex-col items-start leading-tight">
                             <span className="text-slate-900 font-semibold">{problem.stats?.uniqueAttempts?.toLocaleString() ?? 0}</span>
                             <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Solvers</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="flex items-center gap-2">
                           {problem.performance?.isHighFailure && (
                             <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider">
                               <AlertTriangle className="w-3 h-3 text-rose-500" /> High Failure
                             </span>
                           )}
                           {problem.performance?.isLowEngagement && (
                             <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-wider">
                               <BarChart2 className="w-3 h-3 text-slate-400" /> Low Engagement
                             </span>
                           )}
                           {!problem.performance?.isHighFailure && !problem.performance?.isLowEngagement && (
                             <span className="text-slate-400 text-[11px] font-medium italic">Normal metrics</span>
                           )}
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEdit(problem)}
                            className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            title="Edit Problem"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(problem.problemId)}
                            className="p-1.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            title="Delete Problem"
                          >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-rose-500" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {pagination && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50">
            <span className="text-[12px] font-medium text-slate-500">
              Showing {problems?.length || 0} problems
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white shadow-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
               <div className="px-3 py-1.5 rounded border border-slate-200 bg-white text-[12px] text-slate-600 font-medium flex items-center shadow-sm">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="p-1.5 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white shadow-sm transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

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
