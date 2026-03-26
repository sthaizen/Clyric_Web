import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

const defaultForm = {
  slug: "",
  title: "",
  difficulty: "Easy",
  descriptionText: "",
  categoryDisplay: "",
};

export default function ProblemFormModal({ isOpen, onClose, onSubmit, initialData, isPending }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        descriptionText: initialData.description?.text || "",
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      slug: form.slug,
      title: form.title,
      difficulty: form.difficulty,
      categoryDisplay: form.categoryDisplay,
      description: { text: form.descriptionText },
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-[17px] text-slate-900 font-semibold tracking-tight">
            {initialData ? "Edit Problem" : "Create New Problem"}
          </h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">Problem Slug *</label>
              <input
                required
                value={form.slug}
                disabled={!!initialData} // Usually bad to change slug after creation
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="two-sum"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 shadow-sm transition-shadow"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Two Sum"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">Difficulty *</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-shadow appearance-none cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">Category Display</label>
              <input
                value={form.categoryDisplay}
                onChange={(e) => setForm({ ...form, categoryDisplay: e.target.value })}
                placeholder="Arrays & Hashing"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-shadow"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">Description text *</label>
              <textarea
                required
                rows={6}
                value={form.descriptionText}
                onChange={(e) => setForm({ ...form, descriptionText: e.target.value })}
                placeholder="Given an array of integers nums and an integer target..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-shadow resize-y"
              />
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-3 mt-auto bg-slate-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-semibold transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center gap-2 shadow-sm shadow-indigo-600/20"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {initialData ? "Save Changes" : "Create Problem"}
          </button>
        </div>
      </div>
    </div>
  );
}
