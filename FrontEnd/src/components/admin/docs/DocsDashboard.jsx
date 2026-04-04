import React from "react";
import {
  FileText, FolderOpen, Globe, PenLine, Plus,
  Eye, ArrowUpRight, BookOpen, Image, Clock,
  ExternalLink, LayoutDashboard
} from "lucide-react";

const KpiCard = ({ label, value, sub, badgeText, badgeColor, icon: Icon }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-500",
    slate: "bg-slate-100 text-slate-500",
    violet: "bg-violet-50 text-violet-500",
  };
  return (
    <div className="bg-white border border-slate-200/60 rounded-[18px] p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-bold text-slate-400">{label}</span>
        {Icon && (
          <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
            <Icon className="w-4 h-4 text-slate-500" strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[32px] font-bold text-slate-900 leading-tight">{value}</span>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-300">{sub}</span>
          {badgeText && (
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${colors[badgeColor] || colors.slate}`}>
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, desc, accent, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${accent
      ? "bg-slate-900 border-slate-900 hover:bg-slate-800"
      : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-sm"
      }`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accent ? "bg-white/10" : "bg-slate-50 border border-slate-100"
      }`}>
      <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-slate-500"}`} strokeWidth={2} />
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-[13px] font-bold ${accent ? "text-white" : "text-slate-900"}`}>{label}</p>
      <p className={`text-[12px] truncate ${accent ? "text-slate-400" : "text-slate-400"}`}>{desc}</p>
    </div>
    <ArrowUpRight className={`w-4 h-4 ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${accent ? "text-white" : "text-slate-400"}`} />
  </button>
);

export default function DocsDashboard({ pages = [], categories = [], media = [], onNavigate }) {
  const published = pages.filter(p => p.status === "published").length;
  const drafts = pages.filter(p => p.status === "draft").length;
  const totalDocs = pages.length;
  const totalCats = categories.length;
  const totalMedia = media.length;

  // -- Real Data Calculations --

  // 1. Find the truly most recent updated page
  const sortedByUpdate = [...pages].sort((a, b) =>
    new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  );
  const lastUpdatedPage = sortedByUpdate[0];

  // 2. Simple relative time helper
  const getTimeAgo = (date) => {
    if (!date) return "—";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // 3. Proper Media Count (Tracked in storage + used in page sections)
  const imageSections = pages.reduce((acc, p) =>
    acc + (p.sections?.filter(s => s.type === "image" && s.imageUrl).length || 0), 0
  );
  const realMediaCount = Math.max(totalMedia, imageSections);

  const isEmpty = totalDocs === 0 && totalCats === 0;

  return (
    <div className="flex flex-col pb-10 text-slate-900">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isEmpty ? "bg-slate-300" : "bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.5)]"}`} />
          <span className="text-[13px] font-bold text-slate-500">
            Documentation CMS —{" "}
            <span className="text-slate-900">{isEmpty ? "Empty · Add your first document" : "Active"}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ExternalLink strokeWidth={2} className="w-3.5 h-3.5 text-slate-400" />
            View Live Docs
          </a>
          <button
            onClick={() => onNavigate("docs-create")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus strokeWidth={2.5} className="w-4 h-4" />
            New Document
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-4 gap-6 mb-8 px-1">
        <KpiCard label="Total Documents" value={totalDocs} sub="across all categories" icon={FileText}
          badgeText={totalDocs > 0 ? `${totalDocs} page${totalDocs !== 1 ? "s" : ""}` : "No pages yet"}
          badgeColor={totalDocs > 0 ? "emerald" : "slate"}
        />
        <KpiCard label="Published" value={published} sub="live on docs portal" icon={Globe}
          badgeText={totalDocs > 0 ? `${Math.round((published / totalDocs) * 100) || 0}% of total` : undefined}
          badgeColor="violet"
        />
        <KpiCard label="Drafts" value={drafts} sub="pending review" icon={PenLine}
          badgeText={drafts > 0 ? "Needs attention" : undefined}
          badgeColor="orange"
        />
        <KpiCard label="Categories" value={totalCats} sub="active groups" icon={FolderOpen}
          badgeText={totalCats === 0 ? "Add categories" : undefined}
          badgeColor="slate"
        />
      </div>

      {/* ── Empty state ── */}
      {isEmpty && (
        <div className="mb-8 px-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-[17px] font-bold text-slate-700 mb-2">No documentation yet</h3>
          <p className="text-[13px] text-slate-400 mb-6 max-w-sm mx-auto">
            Create your first documentation page or add categories to organise your content.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("docs-create")}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold hover:bg-slate-800 transition-all"
            >
              <Plus className="w-4 h-4" /> Create First Page
            </button>
            <button
              onClick={() => onNavigate("docs-categories")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200/60 text-slate-700 rounded-xl text-[13px] font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              <FolderOpen className="w-4 h-4 text-slate-400" /> Add Categories
            </button>
          </div>
        </div>
      )}

      {/* ── Main grid (only shown when there's data) ── */}
      {!isEmpty && (
        <div className="grid grid-cols-[1fr_300px] gap-6 mb-6 px-1">

          {/* Recent pages */}
          <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
              <div>
                <h3 className="text-[15px] font-bold text-slate-900">Recent Documents</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">Latest pages in the CMS</p>
              </div>
              <button
                onClick={() => onNavigate("docs-list")}
                className="text-[12px] font-bold text-slate-400 hover:text-slate-900 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {pages.slice(0, 6).map(page => (
                <div key={page._id || page.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-all">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${page.status === "published" ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 truncate">{page.title}</p>
                    <p className="text-[11px] text-slate-400 font-mono">/docs/{page.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${page.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}>
                      {page.status}
                    </span>
                    <span className="text-[11px] text-slate-300">{page.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-50">
                <h3 className="text-[14px] font-bold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <QuickAction icon={Plus} label="Create New Page" desc="Start a fresh documentation article" accent onClick={() => onNavigate("docs-create")} />
                <QuickAction icon={FolderOpen} label="Manage Categories" desc="Organise docs into groups" onClick={() => onNavigate("docs-categories")} />
                <QuickAction icon={Image} label="Media Library" desc={`${totalMedia} file${totalMedia !== 1 ? "s" : ""} uploaded`} onClick={() => onNavigate("docs-media")} />
                <QuickAction icon={Eye} label="Preview Public Docs" desc="See what users see" onClick={() => window.open("/docs", "_blank")} />
              </div>
            </div>

            {/* Category breakdown */}
            {categories.length > 0 && (
              <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm overflow-hidden flex flex-col h-[170px]">
                <div className="px-5 py-4 border-b border-slate-50 shrink-0">
                  <h3 className="text-[14px] font-bold text-slate-900">Pages by Category</h3>
                </div>
                <div className="p-5 space-y-4 max-h-[268px] overflow-y-auto transparent-scrollbar">
                  {categories.map(cat => {
                    const count = pages.filter(p => p.category === cat.name).length;
                    const pct = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;
                    return (
                      <div key={cat._id || cat.id} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px] font-bold text-slate-600">{cat.name}</span>
                          <span className="text-[12px] font-bold text-slate-400">{count} page{count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: cat.color || "#f97316" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom stats row ── */}
      <div className="grid grid-cols-3 gap-6 px-1">
        {[
          { icon: BookOpen, label: "Total Sections", value: pages.reduce((s, p) => s + (p.sections?.length || 0), 0), sub: "across all pages", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: Image, label: "Media Files", value: realMediaCount, sub: "images uploaded", color: "text-orange-500", bg: "bg-orange-50" },
          { icon: Clock, label: "Last Updated", value: lastUpdatedPage ? getTimeAgo(lastUpdatedPage.updatedAt) : "—", sub: lastUpdatedPage ? lastUpdatedPage.title : "No pages yet", color: "text-violet-500", bg: "bg-violet-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200/60 rounded-[18px] p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-slate-400 mb-0.5">{stat.label}</p>
              <p className="text-[18px] font-bold text-slate-900">{stat.value}</p>
              <p className="text-[11px] text-slate-400 truncate">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
