import React, { useState, useMemo } from "react";
import {
  Users, Code2, Activity, Search, Filter, MoreVertical,
  Check, Clock, RefreshCw, Flame, X, Bell, ArrowUpDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { format, formatDistanceToNow, isToday, isYesterday, subDays, isAfter } from "date-fns";

// ─── Config ───────────────────────────────────────────────────────────────────

const typeIndicator = {
  signup: { color: "bg-emerald-500" },
  submission: { color: "bg-indigo-500" },
  session: { color: "bg-violet-500" },
  default: { color: "bg-slate-400" },
};

const priorityMap = {
  signup: { label: "Low", dot: "bg-blue-400" },
  submission: { label: "Medium", dot: "bg-amber-500" },
  session: { label: "High", dot: "bg-rose-500" },
  default: { label: "Low", dot: "bg-slate-300" },
};

const statusMap = {
  Accepted: { label: "Accepted", icon: Check, cls: "text-emerald-700" },
  signup: { label: "Registered", icon: Users, cls: "text-blue-700" },
  session: { label: "Active", icon: Flame, cls: "text-violet-700" },
  default: { label: "Processed", icon: Clock, cls: "text-amber-700" },
};

function filterByTab(list, tab) {
  if (!list?.length) return [];
  return list.filter((a) => {
    if (!a.time) return false;
    const d = new Date(a.time);
    if (tab === "Today") return isToday(d);
    if (tab === "Yesterday") return isYesterday(d);
    return isAfter(d, subDays(new Date(), 7));
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function KravioOverview({ stats, activities, isLoading, onRefreshActivity, isFetchingActivity, userName }) {
  const [updateTab, setUpdateTab] = useState("Today");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tableSearch, setTableSearch] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [tableFilter, setTableFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // ── Chart ──
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartData = stats?.trends?.submissions?.length
    ? stats.trends.submissions.map((s) => ({ name: days[new Date(s._id).getDay()], value: s.total }))
    : days.map((n) => ({ name: n, value: 0 }));

  // ── KPIs ──
  const totalUsers = stats?.users?.total ?? 0;
  const weekSignups = stats?.users?.newThisWeek ?? 0;
  const subsToday = stats?.submissions?.today ?? 0;
  const accRate = stats?.submissions?.acceptanceRateToday ?? 0;
  const activeSess = stats?.sessions?.active ?? 0;
  const dau = stats?.users?.activeToday ?? 0;
  const weekTotal = stats?.trends?.submissions?.reduce((s, x) => s + x.total, 0) ?? 0;

  // ── Activity feed (filtered by tab + search) ──
  const feedItems = useMemo(() => {
    let items = filterByTab(activities, updateTab);
    if (activitySearch) {
      const q = activitySearch.toLowerCase();
      items = items.filter((a) => a.label?.toLowerCase().includes(q) || a.sub?.toLowerCase().includes(q));
    }
    return items;
  }, [activities, updateTab, activitySearch]);

  // ── Table (filtered + sorted) ──
  const tableItems = useMemo(() => {
    let items = activities || [];
    if (tableFilter !== "all") items = items.filter((a) => a.type === tableFilter);
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      items = items.filter((a) => a.label?.toLowerCase().includes(q) || a.sub?.toLowerCase().includes(q));
    }
    if (sortCol) {
      items = [...items].sort((a, b) => {
        let va, vb;
        if (sortCol === "subject") { va = a.label || ""; vb = b.label || ""; }
        else if (sortCol === "priority") { const o = { session: 3, submission: 2, signup: 1 }; va = o[a.type] || 0; vb = o[b.type] || 0; }
        else if (sortCol === "date" || sortCol === "age") { va = new Date(a.time || 0).getTime(); vb = new Date(b.time || 0).getTime(); }
        else { va = a.sub || ""; vb = b.sub || ""; }
        const cmp = typeof va === "string" ? va.localeCompare(vb) : va - vb;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return items;
  }, [activities, tableFilter, tableSearch, sortCol, sortDir]);

  const toggleRow = (i) => setSelected((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleAll = () => { const c = Math.min(tableItems.length, 10); setSelected(selected.size === c ? new Set() : new Set(Array.from({ length: c }, (_, i) => i))); };
  const doSort = (col) => { if (sortCol === col) setSortDir((d) => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("asc"); } };

  // ── Sortable header helper ──
  const SortTh = ({ col, children, className = "" }) => (
    <th className={`px-4 py-3 cursor-pointer select-none hover:text-slate-700 transition-colors ${className}`} onClick={() => doSort(col)}>
      <span className="inline-flex items-center gap-1">{children} <ArrowUpDown className="w-3 h-3 opacity-40" /></span>
    </th>
  );

  // ── Loading ──
  if (isLoading || !stats) {
    return (
      <div className="animate-pulse flex flex-col gap-6">
        <div className="h-14 bg-slate-100 rounded-xl w-1/3" />
        <div className="grid grid-cols-4 gap-5">{[1,2,3,4].map(i => <div key={i} className="h-[220px] bg-slate-100 rounded-xl" />)}</div>
        <div className="h-[380px] bg-slate-100 rounded-xl" />
        <div className="h-[300px] bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Greeting (matches Kravio) ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Hello, {userName || "Admin"} 👋</h1>
          <p className="text-[14px] text-slate-500 mt-1">Here are the latest insights from your platform.</p>
        </div>
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"><MoreVertical className="w-5 h-5" /></button>
      </div>

      {/* ── Row 1: 3 KPI Cards + Latest Updates (4-col like Kravio) ───────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">

        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-semibold text-slate-500">Total Users</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-6">
            <div>
              <p className="text-[32px] font-bold text-slate-900 leading-none">{totalUsers.toLocaleString()}</p>
              <p className="text-[12px] mt-2"><span className="text-emerald-500 font-semibold">+{weekSignups}</span><span className="text-slate-400"> this week</span></p>
            </div>
            <svg width="80" height="36" viewBox="0 0 80 36" fill="none"><path d="M2 28 L15 15 L28 20 L45 8 L60 18 L78 2" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 28 L15 15 L28 20 L45 8 L60 18 L78 2 L78 36 L2 36Z" fill="#10b981" opacity="0.08"/></svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-semibold text-slate-500">Submissions Today</span>
            <Code2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-6">
            <div>
              <p className="text-[32px] font-bold text-slate-900 leading-none">{subsToday.toLocaleString()}</p>
              <p className="text-[12px] mt-2"><span className={accRate >= 50 ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"}>{accRate}%</span><span className="text-slate-400"> acceptance rate</span></p>
            </div>
            <svg width="80" height="36" viewBox="0 0 80 36" fill="none"><path d="M2 25 L15 18 L28 22 L45 10 L60 15 L78 5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 25 L15 18 L28 22 L45 10 L60 15 L78 5 L78 36 L2 36Z" fill="#6366f1" opacity="0.08"/></svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-semibold text-slate-500">Active Sessions</span>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-end justify-between mt-auto pt-6">
            <div>
              <p className="text-[32px] font-bold text-slate-900 leading-none">{activeSess}</p>
              <p className="text-[12px] mt-2"><span className="text-slate-500 font-medium">{dau} DAU</span><span className="text-slate-400"> · live now</span></p>
            </div>
            <svg width="80" height="36" viewBox="0 0 80 36" fill="none">
              {activeSess > 0
                ? <path d="M2 20 L15 12 L28 18 L45 6 L60 14 L78 4" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M2 18 L78 18" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/>}
            </svg>
          </div>
        </div>

        {/* Latest Updates (same row, Kravio-style) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[15px] font-bold text-slate-900">Latest Updates</span>
            <button onClick={onRefreshActivity} className="p-1 text-slate-400 hover:text-slate-600 rounded transition">
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingActivity ? "animate-spin" : ""}`} />
            </button>
          </div>
          <div className="flex p-0.5 bg-slate-100 rounded-lg mb-3">
            {["Today", "Yesterday", "This week"].map((t) => (
              <button key={t} onClick={() => setUpdateTab(t)} className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${updateTab === t ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t}</button>
            ))}
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} placeholder="Search activities" className="w-full pl-8 pr-7 py-1.5 text-[12px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 shadow-sm" />
            {activitySearch && <button onClick={() => setActivitySearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>}
          </div>
          <p className="text-[11px] font-bold text-slate-900 mb-2">{feedItems.length} <span className="text-slate-500 font-medium">{updateTab === "Today" ? "activities today" : updateTab === "Yesterday" ? "activities yesterday" : "this week"}</span></p>
          <div className="flex-1 overflow-y-auto space-y-0.5 max-h-[180px] custom-scrollbar">
            {feedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center"><Activity className="w-6 h-6 text-slate-200 mb-1" /><p className="text-slate-400 text-[12px]">{activitySearch ? "No matches" : `No activity ${updateTab.toLowerCase()}`}</p></div>
            ) : feedItems.slice(0, 8).map((item, i) => {
              const ind = typeIndicator[item.type] || typeIndicator.default;
              return (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-2 h-2 rounded-sm ${ind.color} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <p className="text-[12px] font-semibold text-slate-900 truncate">{item.label}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{item.time ? format(new Date(item.time), "h:mm a") : ""}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 2: Full-width Bar Chart (Kravio-style) ────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-[14px] font-semibold text-slate-700">Submission Volume Trend</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-500 shadow-sm">
            <Clock className="w-3.5 h-3.5" /> Last 7 days
          </div>
        </div>
        <div className="flex items-end gap-2 mb-6">
          <p className="text-[36px] font-bold text-slate-900 leading-none tracking-tight">{weekTotal.toLocaleString()}</p>
          <p className="text-[13px] text-slate-500 mb-1">past 7 days</p>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
              <Tooltip cursor={{ fill: "transparent" }} content={({ active, payload }) => active && payload?.length ? <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-md font-semibold shadow-xl">{payload[0].payload.name} : {payload[0].value}</div> : null} />
              <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={42} onMouseEnter={(_, i) => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                {chartData.map((_, i) => <Cell key={i} fill={i === hoveredBar ? "#0f172a" : "#cbd5e1"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 3: Platform Monitoring Table (Kravio-style) ───────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <Activity className="w-4 h-4 text-slate-500" /> Platform Monitoring
            {selected.size > 0 && <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[11px] font-bold">{selected.size} selected</span>}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input value={tableSearch} onChange={(e) => setTableSearch(e.target.value)} placeholder="Search events..." className="w-full pl-8 pr-7 py-1.5 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-400 shadow-sm" />
              {tableSearch && <button onClick={() => setTableSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"><X className="w-3 h-3" /></button>}
            </div>
            <div className="relative">
              <button onClick={() => setShowFilterMenu(!showFilterMenu)} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[13px] font-medium shadow-sm transition ${tableFilter !== "all" ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                <Filter className="w-3.5 h-3.5" /> {tableFilter === "all" ? "Filter" : tableFilter}
              </button>
              {showFilterMenu && (
                <div className="absolute right-0 top-[calc(100%+4px)] z-20 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 w-[150px]">
                  {[{ k: "all", l: "All Events" }, { k: "signup", l: "Signups" }, { k: "submission", l: "Submissions" }, { k: "session", l: "Sessions" }].map((o) => (
                    <button key={o.k} onClick={() => { setTableFilter(o.k); setShowFilterMenu(false); }} className={`w-full text-left px-3 py-2 text-[13px] rounded-lg transition ${tableFilter === o.k ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}>{o.l}</button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 rounded transition"><MoreVertical className="w-4 h-4" /></button>
          </div>
        </div>

        {tableFilter !== "all" && (
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[11px] font-bold rounded-lg border border-indigo-100">
              {tableFilter} <button onClick={() => setTableFilter("all")}><X className="w-3 h-3" /></button>
            </span>
          </div>
        )}

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-[13px] whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium text-[12px]">
              <tr>
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={selected.size > 0 && selected.size === Math.min(tableItems.length, 10)} onChange={toggleAll} className="rounded border-slate-300 text-indigo-600" /></th>
                <th className="px-4 py-3">Task ID</th>
                <SortTh col="subject">Subject</SortTh>
                <SortTh col="priority">Priority</SortTh>
                <SortTh col="source">Source</SortTh>
                <th className="px-4 py-3">Status</th>
                <SortTh col="date">Date</SortTh>
                <SortTh col="age">Age</SortTh>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableItems.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-slate-400">No events match your criteria.</td></tr>
              ) : tableItems.slice(0, 10).map((item, i) => {
                const pri = priorityMap[item.type] || priorityMap.default;
                const stKey = item.verdict === "Accepted" ? "Accepted" : item.type;
                const st = statusMap[stKey] || statusMap.default;
                const StIcon = st.icon;
                const ind = typeIndicator[item.type] || typeIndicator.default;
                return (
                  <tr key={i} className={`hover:bg-slate-50 transition ${selected.has(i) ? "bg-indigo-50/40" : ""}`}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(i)} onChange={() => toggleRow(i)} className="rounded border-slate-300 text-indigo-600" /></td>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${ind.color}`} /><span className="font-semibold text-slate-900">#{String(i + 2319).padStart(4, "0")}</span></div></td>
                    <td className="px-4 py-3 text-slate-700 font-medium max-w-[200px] truncate">{item.label}</td>
                    <td className="px-4 py-3"><div className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${pri.dot}`} /><span className="text-slate-600">{pri.label}</span></div></td>
                    <td className="px-4 py-3 text-slate-600 max-w-[160px] truncate">{item.sub}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 font-semibold text-[12px] ${st.cls}`}><StIcon className="w-3.5 h-3.5" />{st.label}</span></td>
                    <td className="px-4 py-3 text-slate-600">{item.time ? format(new Date(item.time), "yyyy-MM-dd") : "-"}</td>
                    <td className="px-4 py-3 text-slate-500">{item.time ? formatDistanceToNow(new Date(item.time), { addSuffix: false }) + " ago" : "-"}</td>
                    <td className="px-4 py-3 text-right"><button className="p-1 hover:bg-slate-200 text-slate-400 rounded"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tableItems.length > 0 && (
          <div className="flex items-center justify-between mt-3">
            <p className="text-[12px] text-slate-400">Showing {Math.min(tableItems.length, 10)} of {tableItems.length} events</p>
            {selected.size > 0 && <button onClick={() => setSelected(new Set())} className="text-[12px] text-indigo-600 font-medium hover:text-indigo-800">Clear selection</button>}
          </div>
        )}
      </div>
    </div>
  );
}
