import React, { useState, useMemo } from "react";
import {
  Plus, Pencil, Trash2, Search, ChevronDown, Eye, Globe,
  EyeOff, FileText, SlidersHorizontal, X, BookOpen, Copy
} from "lucide-react";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const StatusBadge = ({ status }) => (
  <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
    status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
  }`}>
    {status}
  </span>
);

const DiffBadge = ({ level }) => {
  const map = {
    Beginner:     "bg-green-50 text-green-600",
    Intermediate: "bg-orange-50 text-orange-600",
    Advanced:     "bg-red-50 text-red-600",
  };
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${map[level] || "bg-slate-100 text-slate-500"}`}>
      {level || "—"}
    </span>
  );
};

const getId = (p) => p._id || p.id;


export default function DocsListPage({ pages = [], categories = [], onNavigate, onEdit, onDelete, onBulkDelete, onDuplicate, onToggleStatus }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = useMemo(() => {
    return pages.filter(p => {
      const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.slug?.includes(search.toLowerCase());
      const matchCat = !filterCat || p.category === filterCat;
      const matchStatus = !filterStatus || p.status === filterStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [pages, search, filterCat, filterStatus]);

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected(prev => prev.length === filtered.length ? [] : filtered.map(getId));
  const bulkDelete = () => {

    onBulkDelete(selected);
    setSelected([]);
  };


  const confirmDelete = (page) => setDeleteConfirm(page);
  const doDelete = () => {
    if (deleteConfirm) { onDelete(deleteConfirm.id); setDeleteConfirm(null); }
  };

  const hasFilters = search || filterCat || filterStatus;

  return (
    <div className="flex flex-col pb-10">

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-[15px] font-bold text-slate-900 mb-2">Delete Document?</h3>
            <p className="text-[13px] text-slate-500 mb-5">
              <span className="font-bold text-slate-900">"{deleteConfirm.title}"</span> will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={doDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-[13px] font-bold hover:bg-red-600 transition-all">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <span className="text-[22px] font-bold text-slate-900">{pages.length}</span>
          <span className="text-[13px] font-bold text-slate-400">
            {pages.length === 1 ? "document" : "documents"} ·{" "}
            <span className="text-emerald-600">{pages.filter(p => p.status === "published").length} published</span>
          </span>
        </div>
        <button
          onClick={() => onNavigate("docs-create")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus strokeWidth={2.5} className="w-4 h-4" />
          New Document
        </button>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col gap-3 mb-5 px-1">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or slug…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 shadow-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold border transition-all shadow-sm ${
              hasFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {hasFilters && <span className="bg-white/20 text-white text-[10px] rounded-md px-1.5 py-0.5 font-black">ON</span>}
          </button>
          {selected.length > 0 && (
            <button onClick={bulkDelete} className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-[13px] font-bold hover:bg-red-600 transition-all shadow-sm">
              <Trash2 className="w-3.5 h-3.5" /> Delete {selected.length}
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-xl px-4 py-3 shadow-sm">
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            {hasFilters && (
              <button onClick={() => { setSearch(""); setFilterCat(""); setFilterStatus(""); }} className="text-[12px] font-bold text-red-500 hover:text-red-700 whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-200 mb-4" strokeWidth={1.5} />
          <p className="text-[15px] font-bold text-slate-400 mb-2">
            {pages.length === 0 ? "No documents yet" : "No results found"}
          </p>
          <p className="text-[13px] text-slate-300 mb-6">
            {pages.length === 0
              ? "Create your first documentation page to get started"
              : "Try adjusting your search or filters"}
          </p>
          {pages.length === 0 && (
            <button
              onClick={() => onNavigate("docs-create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Create First Document
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Table Head */}
          <div className="flex items-center gap-4 px-5 py-3 border-b border-slate-100 bg-slate-50/30">
            <input
              type="checkbox"
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="w-3.5 h-3.5 accent-slate-900 cursor-pointer"
            />
            <span className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Title</span>
            <span className="w-32 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
            <span className="w-24 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
            <span className="w-24 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Difficulty</span>
            <span className="w-16 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Sections</span>
            <span className="w-28" />
          </div>

          {/* Rows */}
          {filtered.map(page => {
            const pid = getId(page);
            return (
              <div key={pid} className="group flex items-center gap-4 px-5 py-4 border-b border-slate-50 hover:bg-slate-50/40 transition-all last:border-0">
                <input
                  type="checkbox"
                  checked={selected.includes(pid)}
                  onChange={() => toggleSelect(pid)}
                  className="w-3.5 h-3.5 accent-slate-900 cursor-pointer"
                />

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-slate-900 truncate">{page.title}</p>
                <p className="text-[11px] font-mono text-slate-400 truncate">/docs/{page.slug}</p>
              </div>
              <span className="w-32 text-[12px] font-bold text-slate-500 truncate">{page.category || "—"}</span>
              <span className="w-24">
                <StatusBadge status={page.status} />
              </span>
              <span className="w-24">
                <DiffBadge level={page.difficulty} />
              </span>
              <span className="w-16 text-[13px] font-bold text-slate-500 text-center">
                {page.sections?.length || 0}
              </span>
              {/* Row Actions */}
              <div className="w-28 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => window.open(`/docs/${page.slug}`, "_blank")}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onEdit(page)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onToggleStatus(pid)}
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                    page.status === "published"
                      ? "border-emerald-200 text-emerald-500 hover:bg-emerald-50"
                      : "border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-500"
                  }`}
                  title={page.status === "published" ? "Unpublish" : "Publish"}
                >
                  {page.status === "published" ? <Globe className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => onDuplicate(pid)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => confirmDelete(page)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          );
        })}


          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-400">
              {filtered.length} of {pages.length} documents
            </p>
            {selected.length > 0 && (
              <p className="text-[12px] font-bold text-slate-500">{selected.length} selected</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
