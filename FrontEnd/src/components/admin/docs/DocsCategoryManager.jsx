import React, { useState, useMemo, useEffect } from "react";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Check, X,
  FolderOpen, Hash, ArrowUpDown, Info
} from "lucide-react";

const COLOR_PRESETS = [
  "#f97316","#8b5cf6","#0ea5e9","#10b981","#f43f5e",
  "#6366f1","#14b8a6","#f59e0b","#64748b","#ef4444","#84cc16","#ec4899",
];

const autoSlug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Inline Form ───────────────────────────────────────────────────────────────
const CategoryForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(
    initial || { name: "", slug: "", sortOrder: "", visible: true, color: "#f97316" }
  );
  const [err, setErr] = useState("");

  const handleName = (e) => {
    const name = e.target.value;
    setForm(prev => ({ ...prev, name, slug: initial?.id ? prev.slug : autoSlug(name) }));
  };

  const handleSave = () => {
    if (!form.name.trim()) { setErr("Category name is required."); return; }
    onSave(form);
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-lg space-y-5">
      <h3 className="text-[13px] font-bold text-slate-900 pb-3 border-b border-slate-100">
        {initial?.id ? "Edit Category" : "New Category"}
      </h3>

      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-[12px] font-bold text-red-600">
          <X className="w-3.5 h-3.5" />{err}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Name <span className="text-rose-400">*</span>
          </label>
          <input
            value={form.name}
            onChange={handleName}
            placeholder="e.g. Getting Started"
            autoFocus
            className="w-full px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">URL Slug</label>
          <input
            value={form.slug}
            onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="getting-started"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-[12px] font-mono text-slate-600 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Sort Order</label>
          <input
            type="number"
            min="1"
            value={form.sortOrder}
            onChange={e => setForm(prev => ({ ...prev, sortOrder: e.target.value }))}
            placeholder="1"
            className="w-full px-3 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 transition-all"
          />
          <p className="text-[11px] text-slate-300 mt-1">Lower numbers appear first</p>
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Accent Colour</label>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {COLOR_PRESETS.map(color => (
              <button
                key={color}
                onClick={() => setForm(prev => ({ ...prev, color }))}
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ backgroundColor: color, borderColor: form.color === color ? "#1e293b" : "transparent" }}
              >
                {form.color === color && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        onClick={() => setForm(prev => ({ ...prev, visible: !prev.visible }))}
        className="flex items-center gap-3 cursor-pointer select-none w-fit"
      >
        <div className={`w-10 h-5 rounded-full relative transition-all ${form.visible ? "bg-emerald-500" : "bg-slate-300"}`}>
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.visible ? "right-0.5" : "left-0.5"}`} />
        </div>
        <span className="text-[13px] font-bold text-slate-700">
          {form.visible ? "Visible on public docs" : "Hidden from public docs"}
        </span>
      </div>

      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          {initial?.id ? "Update" : "Add Category"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── Category Row ───────────────────────────────────────────────────────────────
const CategoryRow = ({ cat, pageCount, onEdit, onDelete, onToggle }) => (
  <div className="group flex items-center gap-4 px-5 py-4 border-b border-slate-50 hover:bg-slate-50/40 transition-all last:border-0">
    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color || "#cbd5e1" }} />

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-bold text-slate-900">{cat.name}</span>
        {!cat.visible && (
          <span className="text-[10px] font-black text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Hidden</span>
        )}
      </div>
      <span className="text-[11px] font-mono text-slate-400">/docs/{cat.slug}</span>
    </div>

    <div className="flex items-center gap-8 mr-4">
      <div className="text-center">
        <p className="text-[15px] font-bold text-slate-900">{pageCount}</p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Pages</p>
      </div>
      {cat.sortOrder && (
        <div className="text-center">
          <p className="text-[15px] font-bold text-slate-900">#{cat.sortOrder}</p>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Order</p>
        </div>
      )}
    </div>

    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onToggle(cat.id)}
        className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${cat.visible
          ? "border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50"
          : "border-slate-200 text-slate-300 hover:text-slate-600 hover:bg-slate-50"}`}
        title={cat.visible ? "Hide" : "Show"}
      >
        {cat.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
      <button onClick={() => onEdit(cat)}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
        title="Edit"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => onDelete(cat.id)}
        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function DocsCategoryManager({ categories = [], pages = [], onAdd, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);   // null | "new" | category object
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filtered = useMemo(() => {
    return categories
      .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999));
  }, [categories, search]);

  // Derived Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  // Reset to first page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const handleSave = (form) => {
    if (editing?.id) {
      onUpdate({ ...editing, ...form });
    } else {
      onAdd(form);
    }
    setEditing(null);
  };

  const handleToggle = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat) onUpdate({ ...cat, visible: !cat.visible });
  };

  const handleGoToPage = (val) => {
    const p = parseInt(val);
    if (p > 0 && p <= totalPages) setCurrentPage(p);
  };

  const getPageRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        range.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        range.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return range;
  };

  const stats = {
    total:   categories.length,
    visible: categories.filter(c => c.visible).length,
    hidden:  categories.filter(c => !c.visible).length,
  };

  return (
    <div className="flex flex-col pb-10">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
        <div className="flex items-center gap-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Visible", value: stats.visible, color: "text-emerald-600" },
            { label: "Hidden", value: stats.hidden, color: "text-slate-400" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={`text-[22px] font-bold ${s.color || "text-slate-900"}`}>{s.value}</span>
              <span className="text-[12px] font-bold text-slate-400">{s.label}</span>
              {i < 2 && <div className="w-px h-5 bg-slate-200 ml-2" />}
            </div>
          ))}
        </div>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus strokeWidth={2.5} className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* ── Inline Form ── */}
      {editing && (
        <div className="mb-6">
          <CategoryForm
            initial={editing === "new" ? null : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* ── Empty state ── */}
      {categories.length === 0 && !editing && (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-2xl">
          <FolderOpen className="w-12 h-12 text-slate-200 mb-4" strokeWidth={1.5} />
          <p className="text-[15px] font-bold text-slate-400 mb-2">No categories yet</p>
          <p className="text-[13px] text-slate-300 mb-6">Add your first category to organise your documentation</p>
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all"
          >
            <Plus className="w-4 h-4" /> Add First Category
          </button>
        </div>
      )}

      {/* ── Table ── */}
      {categories.length > 0 && (
        <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Table header toolbar */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-slate-400" strokeWidth={2} />
              <span className="text-[13px] font-bold text-slate-900">All Categories</span>
            </div>
            <div className="relative">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[12px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 w-44 transition-all"
              />
              <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Column headers */}
          <div className="flex items-center gap-4 px-5 py-2.5 border-b border-slate-50 bg-slate-50/20">
            <div className="w-3" />
            <div className="flex-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category Name</div>
            <div className="flex gap-8 mr-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Pages</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16 text-center">Order</span>
            </div>
            <div className="w-28" />
          </div>

          {/* Rows */}
          {paginatedData.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[13px] font-bold text-slate-400">No categories match "{search}"</p>
            </div>
          ) : paginatedData.map(cat => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              pageCount={pages.filter(p => p.category === cat.name).length}
              onEdit={setEditing}
              onDelete={onDelete}
              onToggle={handleToggle}
            />
          ))}

          {/* ── Pagination Footer ── */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50 bg-white flex-wrap gap-3">
            {/* Showing Limit */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-slate-500 font-bold">Showing per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="bg-slate-50 border border-slate-200/60 rounded-lg text-[12px] font-bold px-2 py-1 focus:outline-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Nav Arrows & Numbers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold transition-all"
              >
                «
              </button>
              <div className="flex items-center gap-1">
                {getPageRange().map((p, i) => (
                  <button
                    key={i}
                    onClick={() => typeof p === "number" && setCurrentPage(p)}
                    disabled={typeof p !== "number"}
                    className={`min-w-[32px] h-8 px-2 rounded-lg text-[13px] font-bold transition-all ${
                      currentPage === p 
                        ? "bg-slate-900 text-white" 
                        : typeof p === "number"
                          ? "text-slate-600 hover:bg-slate-50"
                          : "text-slate-300 cursor-default"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold transition-all"
              >
                »
              </button>
            </div>

            {/* Go To Page */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-slate-500 font-bold">Go to page</span>
              <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1 focus-within:border-slate-300 transition-colors">
                <input
                  type="text"
                  className="w-8 bg-transparent text-[12px] font-bold text-slate-900 outline-none"
                  placeholder={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleGoToPage(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousSibling;
                    handleGoToPage(input.value);
                    input.value = "";
                  }}
                  className="text-[11px] font-black text-indigo-600 ml-1 hover:text-indigo-700 uppercase tracking-wider"
                >
                  GO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Guide note ── */}
      {categories.length > 0 && (
        <div className="mt-6 flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-blue-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[13px] font-bold text-blue-800 mb-1">How Categories Work</p>
            <p className="text-[12px] text-blue-600 leading-relaxed">
              Categories group pages in the public sidebar. The accent colour is used as the sidebar dot indicator.
              Hidden categories aren't shown in the sidebar but pages remain accessible via direct URL.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
