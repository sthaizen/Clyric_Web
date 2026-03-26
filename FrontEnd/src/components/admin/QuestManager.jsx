import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import { Plus, Award, X, Loader2, Target, Zap, Activity, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

const typeColor = {
  daily: "bg-indigo-50 text-indigo-700 border-indigo-200",
  weekly: "bg-violet-50 text-violet-700 border-violet-200",
  milestone: "bg-amber-50 text-amber-700 border-amber-200",
};

const defaultForm = {
  questId: "",
  title: "",
  description: "",
  type: "daily",
  rewardExp: 100,
  isActive: true,
  targetCriteria: { action: "solve", count: 1, difficulty: "any" },
};

export default function QuestManager({ quests, isLoading }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const createMutation = useMutation({
    mutationFn: adminApi.createQuest,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-quests"]);
      toast.success("Quest created!");
      setShowForm(false);
      setForm(defaultForm);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create quest"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const activeQuests = quests?.filter(q => q.isActive) || [];
  const completionsToday = quests?.reduce((sum, q) => sum + (q.completionsToday || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Light Theme Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] font-semibold text-slate-500 tracking-wide">Active Templates</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">{activeQuests.length} <span className="text-[13px] font-medium text-slate-400">/ {quests?.length || 0}</span></p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group">
           <div className="flex justify-between items-center mb-4">
             <span className="text-[13px] font-semibold text-slate-500 tracking-wide">Completions Today</span>
             <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
               <Target className="w-4 h-4" />
             </div>
           </div>
           <p className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">{completionsToday}</p>
        </div>

        <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-slate-50 flex flex-col justify-center items-center">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="w-full h-full min-h-[90px] flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white transition-all bg-transparent"
            >
              {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span className="font-semibold text-[14px]">{showForm ? "Cancel Creation" : "Design New Quest"}</span>
            </button>
        </div>
      </div>

      {/* Light Theme Create Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-4 fade-in duration-300"
        >
          <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100">
             <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                <Sparkles className="w-4 h-4" />
             </div>
             <h3 className="text-[16px] text-slate-900 font-semibold tracking-tight">Quest Architect</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quest ID Slug</label>
               <input
                 required
                 placeholder="e.g. solve-3-hards"
                 value={form.questId}
                 onChange={(e) => setForm({ ...form, questId: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono shadow-sm"
               />
            </div>
            <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Display Title</label>
               <input
                 required
                 placeholder="Master of Algorithms"
                 value={form.title}
                 onChange={(e) => setForm({ ...form, title: e.target.value })}
                 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
               />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</label>
               <textarea
                 required
                 placeholder="Explain what the user needs to do..."
                 rows={3}
                 value={form.description}
                 onChange={(e) => setForm({ ...form, description: e.target.value })}
                 className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y shadow-sm"
               />
            </div>

            <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pacing Type</label>
               <select
                 value={form.type}
                 onChange={(e) => setForm({ ...form, type: e.target.value })}
                 className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm appearance-none"
               >
                 <option value="daily">Daily Rotating</option>
                 <option value="weekly">Weekly Challenge</option>
                 <option value="milestone">Lifetime Milestone</option>
               </select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">XP Reward</label>
               <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500 font-bold text-[12px]">XP</div>
                  <input
                    type="number"
                    min={10} max={5000}
                    value={form.rewardExp}
                    onChange={(e) => setForm({ ...form, rewardExp: parseInt(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono shadow-sm"
                  />
               </div>
            </div>

            <div className="space-y-1.5 md:col-span-2 flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl mt-2">
               <div className="w-1/2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trigger Action</label>
                  <select
                    value={form.targetCriteria.action}
                    onChange={(e) => setForm({ ...form, targetCriteria: { ...form.targetCriteria, action: e.target.value } })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none shadow-sm"
                  >
                    <option value="solve">Solve Problem</option>
                    <option value="collaborate">Join Session</option>
                  </select>
               </div>
               <div className="w-1/2 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Required Count</label>
                  <input
                    type="number"
                    min={1}
                    value={form.targetCriteria.count}
                    onChange={(e) => setForm({ ...form, targetCriteria: { ...form.targetCriteria, count: parseInt(e.target.value) } })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none font-mono shadow-sm"
                  />
               </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-5 border-t border-slate-100 mt-2">
             <button
               type="submit"
               disabled={createMutation.isPending}
               className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-all shadow-sm shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50"
             >
               {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
               Deploy Quest
             </button>
          </div>
        </form>
      )}

      {/* Operational Quest List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Quest Directive</th>
                <th className="px-5 py-3.5">Classification</th>
                <th className="px-5 py-3.5">Engagement Pulse</th>
                <th className="px-5 py-3.5 text-right">Reward Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td className="px-5 py-4"><div className="h-8 w-48 bg-slate-100 rounded" /></td>
                     <td className="px-5 py-4"><div className="h-6 w-20 bg-slate-100 rounded-md" /></td>
                     <td className="px-5 py-4"><div className="h-6 w-32 bg-slate-100 rounded" /></td>
                     <td className="px-5 py-4"><div className="h-6 w-16 bg-slate-100 rounded-md ml-auto" /></td>
                  </tr>
                ))
              ) : !quests?.length ? (
                <tr>
                  <td colSpan="4" className="px-5 py-12 text-center text-slate-500">
                     <ShieldAlert className="w-8 h-8 mx-auto mb-3 opacity-30 text-slate-400" />
                     <p className="font-medium">No engagement directives mapped.</p>
                  </td>
                </tr>
              ) : (
                quests.map((quest) => {
                  const engagement = Math.min((quest.completionsToday || 0) * 10, 100); // Mock metric
                  return (
                    <tr key={quest._id} className={`hover:bg-slate-50/80 transition-colors group ${!quest.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex flex-col min-w-[250px] whitespace-normal">
                          <div className="flex items-center gap-2 mb-1">
                             <p className="text-slate-900 font-semibold">{quest.title}</p>
                             {!quest.isActive && <span className="text-[10px] uppercase font-bold text-rose-600 border border-rose-200 bg-rose-50 px-1.5 py-0.5 rounded">Archived</span>}
                          </div>
                          <p className="text-slate-500 text-[12px] leading-relaxed max-w-md">{quest.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex flex-col gap-2 items-start">
                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${typeColor[quest.type] || typeColor.daily}`}>
                             {quest.type}
                           </span>
                           <code className="text-slate-600 text-[10px] font-mono px-1.5 py-0.5 bg-slate-50 rounded border border-slate-200 font-semibold">
                             {quest.targetCriteria?.count}x {quest.targetCriteria?.action}
                           </code>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                        <div className="flex flex-col gap-1.5 min-w-[150px]">
                           <div className="flex items-center justify-between text-[11px]">
                             <span className="text-slate-500 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500"/> Pulse</span>
                             <span className="text-slate-700 font-mono font-semibold">{quest.completionsToday || 0} today</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 transition-all rounded-full" style={{ width: `${engagement}%` }} />
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle text-right">
                         <div className="flex items-center justify-end gap-1.5 text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg inline-flex shadow-sm">
                           <Zap className="w-3.5 h-3.5 shrink-0" />
                           <span className="font-bold text-[14px]">{quest.rewardExp}</span>
                           <span className="text-[10px] uppercase tracking-wider font-bold opacity-80">XP</span>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
