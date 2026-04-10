import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import ExcelJS from "exceljs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, CartesianGrid,
  RadialBarChart, RadialBar, Legend
} from "recharts";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowLeftRight, CreditCard, ChevronDown, Check,
  Search, Activity, Zap as ZapIcon, MoreHorizontal, Settings, Database, Monitor,
  Filter, ArrowUpDown, Layout, List, Info, ArrowUpRight, ArrowDownRight,
  Star, ExternalLink, Download, PlusSquare, Plus, SlidersHorizontal, FileText, LogOut
} from "lucide-react";
import SafeChartFrame from "./charts/SafeChartFrame";
import { ChartTheme } from "./charts/ChartTheme";

// ─── Formatting helpers ────────────────────────────────────────────────────────
const CONVERSION_RATE = 133;
const fmt = (n, curr = 'NPR') => {
  const val = curr === 'USD' ? parseFloat(n) / CONVERSION_RATE : parseFloat(n);
  return new Intl.NumberFormat(curr === 'USD' ? "en-US" : "en-IN", {
    style: "currency",
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0);
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

// ─── Tiers to "Wallets" mapping (Real prices for MRR calc) ──────────────────────
const WALLET_META = [
  { tier: "practice-pack", name: "Practice Pack", symbol: "PP", price: 299 },
  { tier: "code-rooms", name: "Code Rooms", symbol: "CR", price: 499 },
  { tier: "interview-studio", name: "Interview Studio", symbol: "IS", price: 899 },
  { tier: "career-plus", name: "Career Plus", symbol: "C+", price: 1499 }
];

// Animations removed per request

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminOverviewTab({ stats, activities, breakdown, isLoading, userName, subTab, onSwitchTab }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currency, setCurrency] = useState("NPR");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedActivityIds, setSelectedActivityIds] = useState([]);
  const [deletedActivityIds, setDeletedActivityIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);

  const handleToggleStats = (val) => {
    setCurrency(val ? "USD" : "NPR");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Clyric Admin";
      workbook.created = new Date();

      // ── Sheet 1: Financial Overview ────────────────────────────────────
      const overviewSheet = workbook.addWorksheet("Financial Overview");
      overviewSheet.columns = [
        { header: "Metric", key: "metric", width: 32 },
        { header: "Value", key: "value", width: 20 },
        { header: "Currency", key: "currency", width: 12 },
      ];
      const headerRow = overviewSheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E1E1E" } };
      headerRow.height = 22;

      const isUSD = currency === "USD";
      const curr = isUSD ? "USD" : "NPR";
      const rate = isUSD ? CONVERSION_RATE : 1;
      const toDisplay = (n) => (parseFloat(n) / rate).toFixed(2);

      [
        { metric: "Active Subscribers", value: payingUsers, currency: "—" },
        { metric: "Platform Revenue (MRR)", value: toDisplay(totalRevenue), currency: curr },
        { metric: "Revenue Today", value: toDisplay(revenueToday), currency: curr },
        { metric: "Avg Revenue Per User", value: toDisplay(arpu), currency: curr },
        { metric: "Conversion Rate", value: `${conversionRate}%`, currency: "—" },
        { metric: "Total Users", value: totalUsers, currency: "—" },
        { metric: "Active Sessions", value: activeSessions, currency: "—" },
        { metric: "Submissions Today", value: submissionsToday, currency: "—" },
        { metric: "Acceptance Rate Today", value: `${acceptanceRate}%`, currency: "—" },
      ].forEach(r => overviewSheet.addRow(r));

      overviewSheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          cell.border = { top: { style: "thin", color: { argb: "FFE2E8F0" } }, bottom: { style: "thin", color: { argb: "FFE2E8F0" } }, left: { style: "thin", color: { argb: "FFE2E8F0" } }, right: { style: "thin", color: { argb: "FFE2E8F0" } } };
          if (rowNumber > 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowNumber % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        });
      });

      // ── Sheet 2: Subscription Breakdown ───────────────────────────────
      const subSheet = workbook.addWorksheet("Subscription Breakdown");
      subSheet.columns = [
        { header: "Plan", key: "plan", width: 22 },
        { header: "Subscribers", key: "subscribers", width: 16 },
        { header: `Price (${curr})`, key: "price", width: 16 },
        { header: `MRR (${curr})`, key: "mrr", width: 16 },
      ];
      const subHeader = subSheet.getRow(1);
      subHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
      subHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E1E1E" } };
      subHeader.height = 22;
      walletData.forEach(w => subSheet.addRow({
        plan: w.name,
        subscribers: w.count,
        price: (w.price / rate).toFixed(2),
        mrr: (w.mrr / rate).toFixed(2),
      }));
      subSheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          cell.border = { top: { style: "thin", color: { argb: "FFE2E8F0" } }, bottom: { style: "thin", color: { argb: "FFE2E8F0" } }, left: { style: "thin", color: { argb: "FFE2E8F0" } }, right: { style: "thin", color: { argb: "FFE2E8F0" } } };
          if (rowNumber > 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowNumber % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        });
      });

      // ── Sheet 3: Recent Activity ───────────────────────────────────────
      const actSheet = workbook.addWorksheet("Recent Activity");
      actSheet.columns = [
        { header: "Activity", key: "label", width: 34 },
        { header: "Sub-detail", key: "sub", width: 34 },
        { header: "Value", key: "price", width: 16 },
        { header: "Status", key: "status", width: 16 },
        { header: "Time", key: "time", width: 24 },
      ];
      const actHeader = actSheet.getRow(1);
      actHeader.font = { bold: true, color: { argb: "FFFFFFFF" } };
      actHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E1E1E" } };
      actHeader.height = 22;
      validActivities.forEach(a => actSheet.addRow({
        label: a.label,
        sub: a.sub,
        price: a.price,
        status: a.status,
        time: a.time ? new Date(a.time).toLocaleString() : "—",
      }));
      actSheet.eachRow((row, rowNumber) => {
        row.eachCell(cell => {
          cell.border = { top: { style: "thin", color: { argb: "FFE2E8F0" } }, bottom: { style: "thin", color: { argb: "FFE2E8F0" } }, left: { style: "thin", color: { argb: "FFE2E8F0" } }, right: { style: "thin", color: { argb: "FFE2E8F0" } } };
          if (rowNumber > 1) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: rowNumber % 2 === 0 ? "FFF8FAFC" : "FFFFFFFF" } };
        });
      });

      // ── Download ───────────────────────────────────────────────────────
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clyric_admin_report_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Report exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // ─── Hooks ────────────────────────────────────────────────────────────────
  // Attach stable ID for selection & filter out deleted
  const validActivities = useMemo(() => {
    return (activities || [])
      .map((a, i) => ({ ...a, _uniqueId: a._id || `act-${i}` }))
      .filter(a => !deletedActivityIds.has(a._uniqueId));
  }, [activities, deletedActivityIds]);

  // Chart Data structured for the new target ComposedChart design
  const chartData = useMemo(() => {
    if (!stats?.trends?.revenue?.length) return [];
    const factor = currency === "USD" ? CONVERSION_RATE : 1;
    return stats.trends.revenue.map(s => ({
      name: format(new Date(s._id), "MMM d").toUpperCase(),
      Revenue: s.total / factor,
      Collected: (s.total * 0.95) / factor,
      Due: (s.total * 0.05) / factor,
      // Use raw count for an unscaled line/bars
      count: s.total / factor / 1000 || 0
    })).slice(-10);
  }, [stats?.trends?.revenue, currency]);

  if (subTab !== "Overview") {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-gray-500">
        <Activity strokeWidth={2.5} className="w-10 h-10 mb-4 opacity-30" />
        <h3 className="text-xl font-bold text-[#18181B] mb-2">{subTab} Layout Active</h3>
        <p className="text-sm">Content configured to switch context inside overview tab only.</p>
      </div>
    );
  }

  // Skeleton
  if (isLoading || !stats) {
    return <div className="animate-pulse space-y-6 flex-1 w-full"><div className="h-20 bg-black/5 rounded-[24px]" /><div className="flex gap-6"><div className="w-[340px] h-[800px] bg-black/5 rounded-[32px]" /><div className="flex-1 space-y-6"><div className="h-[300px] bg-black/5 rounded-[32px]" /><div className="h-[400px] bg-black/5 rounded-[32px]" /></div></div></div>;
  }

  // Data Map
  const totalRevenue = stats?.financials?.totalRevenue || 0;
  const revenueToday = stats?.financials?.revenueToday || 0;
  const activeSubs = stats?.financials?.activeSubscriptions || 0;

  const submissionsToday = stats?.submissions?.today || 0;
  const failedSubs = stats?.submissions?.failedToday || 0;
  const acceptanceRate = stats?.submissions?.acceptanceRateToday || 0;

  const activeSessions = stats?.sessions?.active || 0;
  const highPriorityIssues = stats?.problems?.highPriorityIssues || 0;

  // Wallet counts (Real Subscriptions)
  const breakdownCounts = breakdown?.breakdown || [];
  const walletData = WALLET_META.map(w => {
    const tierMatch = breakdownCounts.find(b => b.tier === w.tier);
    const count = tierMatch?.count || 0;
    return { ...w, count, mrr: count * w.price };
  });

  // Financial Derived Metrics
  const payingUsers = walletData.reduce((acc, curr) => acc + curr.count, 0);
  const totalUsers = stats?.users?.total || activeSubs || 1;
  const conversionRate = totalUsers > 0 ? ((payingUsers / totalUsers) * 100).toFixed(1) : 0;
  const arpu = totalUsers > 0 ? (totalRevenue / totalUsers) : 0;

  const pendingPayments = validActivities.filter(a => a.status === "PENDING" && a.label?.toLowerCase().includes("plan")).length;
  const failedPayments = validActivities.filter(a => a.status === "FAILED" && a.label?.toLowerCase().includes("plan")).length;

  // Filter Activities
  let filteredActivities = validActivities;
  if (typeFilter !== "All") filteredActivities = filteredActivities.filter((a) => a.type === typeFilter);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredActivities = filteredActivities.filter(a => a.label?.toLowerCase().includes(q) || a.sub?.toLowerCase().includes(q));
  }

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / itemsPerPage));
  const currentActivities = filteredActivities.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedActivityIds(currentActivities.map(a => a._uniqueId));
    else setSelectedActivityIds([]);
  };

  const clearSelection = () => setSelectedActivityIds([]);

  const handleApplyCode = () => {
    toast.success(`Applying dynamic codes to ${selectedActivityIds.length} items...`);
    clearSelection();
  };

  const handleDeleteSelected = () => {
    const newDeleted = new Set(deletedActivityIds);
    selectedActivityIds.forEach(id => newDeleted.add(id));
    setDeletedActivityIds(newDeleted);
    toast.success(`Deleted ${selectedActivityIds.length} items from view`);
    clearSelection();
  };

  // Gauge Data
  const gaugeVal = Math.max(0, Math.min(100, acceptanceRate));
  const gaugeData = [
    { name: "Rate", value: gaugeVal, color: "#18181B" },
    { name: "Empty", value: 100 - gaugeVal, color: "rgba(0,0,0,0.05)" }
  ];

  // Radial Chart Data (4 Tiers) - High Contrast Theme
  const radialData = walletData.map((w, idx) => ({
    name: w.name,
    value: w.count,
    fill: idx === 0 ? "#9ea3af" : idx === 1 ? "#f43f5e" : idx === 2 ? "#f97316" : "#18181B"
  })).reverse();



  return (
    <div
      className="flex flex-col flex-1 pb-10 text-gray-900"
    >
      {/* Sub-Header Action Row (Exact Match) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200/60 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => toast.success("Switched to Table View")}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/40 rounded-lg text-[13px] font-bold text-slate-900 shadow-sm"
            >
              <Layout strokeWidth={2} className="w-3.5 h-3.5 text-slate-500" />
              <span>Table View</span>
              <ChevronDown strokeWidth={2.5} className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => toast.success("Filter panel opened")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white transition-all text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:shadow-sm hover:border border-transparent hover:border-slate-200/60 rounded-xl"
          >
            <Filter strokeWidth={2} className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>

          <button
            onClick={() => toast.success("Sort panel opened")}
            className="flex items-center gap-2 px-4 py-2 hover:bg-white transition-all text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:shadow-sm hover:border border-transparent hover:border-slate-200/60 rounded-xl"
          >
            <ArrowUpDown strokeWidth={2} className="w-3.5 h-3.5" />
            <span>Sort</span>
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          <button 
            onClick={() => handleToggleStats(currency !== "USD")}
            className="flex items-center gap-3 ml-2 hover:bg-slate-50 p-1 px-2 rounded-xl transition-all group"
          >
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Currency</span>
            <div className={`w-9 h-5 rounded-full relative transition-all duration-300 ${currency === "USD" ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-slate-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform ${currency === "USD" ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
            </div>
            <div className="flex items-center">
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider transition-all ${currency === "USD" ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-60'}`}>
                {currency}
              </span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success("Widget customizer opened")}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <SlidersHorizontal strokeWidth={2} className="w-3.5 h-3.5 text-slate-400" />
            <span>Customize</span>
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
          >
            {exporting ? (
              <svg className="w-3.5 h-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" /></svg>
            ) : (
              <Download strokeWidth={2} className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{exporting ? "Exporting…" : "Export"}</span>
          </button>
          <button
            onClick={() => {
              onSwitchTab('problems');
              toast.success("Navigated to Problem Library");
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-900 rounded-xl text-[13px] font-bold text-white hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus strokeWidth={2.5} className="w-4 h-4" />
            <span>Add New Problem</span>
          </button>
        </div>
      </div>

      {/* Exact Match KPI Row (Total Product, Revenue, etc.) */}
      <div className="grid grid-cols-4 gap-6 mb-8 px-1">
        {/* KPI 1: Active Subscribers */}
        <div className="bg-white border border-slate-200/60 rounded-[18px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-slate-400 flex items-center gap-1.5">
              Active Subscribers <Info className="w-3 h-3" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-slate-900 leading-tight">{payingUsers}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">vs last month</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" /> 8 users
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Revenue (MRR) */}
        <div className="bg-white border border-slate-200/60 rounded-[18px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-slate-400 flex items-center gap-1.5">
              Platform Revenue (MRR) <Info className="w-3 h-3" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-slate-900 leading-tight tracking-tight">{fmt(totalRevenue, currency)}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">vs last month</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" /> 12%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Conversion Rate */}
        <div className="bg-white border border-slate-200/60 rounded-[18px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-slate-400 flex items-center gap-1.5">
              Conversion Rate <Info className="w-3 h-3" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-slate-900 leading-tight">{conversionRate}%</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">vs last month</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" /> 2.1%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: ARPU */}
        <div className="bg-white border border-slate-200/60 rounded-[18px] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-slate-400 flex items-center gap-1.5">
              Avg Revenue Per User <Info className="w-3 h-3" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-slate-900 leading-tight tracking-tight">{fmt(arpu, currency)}</span>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[11px] font-bold text-slate-300">vs last month</span>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Plus className="w-2.5 h-2.5" /> 4%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid Row */}
      <div className="grid grid-cols-[240px_1fr_240px] gap-5 mb-6 w-full min-h-[300px]">

        {/* LEFT COMPONENT: System Monitors */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-0 px-2">
            <div className="font-bold text-[13px] uppercase tracking-widest text-gray-400">Payment Pipeline</div>
            <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#18181B] hover:bg-gray-50 transition-colors"><MoreHorizontal strokeWidth={2.5} className="w-3 h-3" /></button>
          </div>

          <div className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-3 relative overflow-hidden border border-gray-100 group">
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[18px] font-bold pr-4 leading-tight text-[#18181B]">Pending <br /> Transactions</span>
              <div className="w-8 h-8 bg-gray-50 rounded-[10px] flex items-center justify-center text-gray-700 shrink-0 border border-gray-100">
                <CreditCard strokeWidth={2} className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[13px] text-gray-500 font-medium relative z-10">Awaiting gateway sync</span>

            <div className="flex items-center gap-2 mt-3 relative z-10">
              <div className="px-3 py-1.5 rounded-[8px] text-[13px] font-bold whitespace-nowrap bg-orange-50 text-orange-500 border border-orange-100 flex items-center gap-2">
                {pendingPayments || 1} pending <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[24px] flex flex-col gap-3 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[18px] font-bold pr-4 leading-tight text-[#18181B]">Failed <br /> Payments</span>
              <div className="w-8 h-8 bg-gray-50 rounded-[10px] flex items-center justify-center text-gray-700 shrink-0 border border-gray-100">
                <Info strokeWidth={2} className="w-4 h-4" />
              </div>
            </div>
            <span className="text-[13px] text-gray-500 font-medium">Requires follow-up</span>

            <div className="flex items-center gap-2 mt-3">
              <div className="px-3 py-1.5 rounded-[8px] text-[13px] font-bold bg-rose-50 border border-rose-100 text-rose-500">
                {failedPayments} failed
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE COMPONENT: Chart Container & Wallets */}
        <div className="flex flex-col gap-4 min-w-0">
          <SafeChartFrame
            className="flex-1 pb-2 min-h-[200px]"
            customHeader={
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-50 rounded-[8px] flex items-center justify-center border border-gray-200">
                      <Activity strokeWidth={2.5} className="w-3.5 h-3.5 text-gray-700" />
                    </div>
                    <span className="text-[24px] font-bold text-[#18181B]">{fmt(totalRevenue, currency)}</span>
                  </div>
                  <button className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-center text-gray-400 hover:text-[#18181B] hover:bg-gray-50 transition-colors">
                    <ArrowLeftRight strokeWidth={2.5} className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[12px] text-gray-400 font-bold mb-3 ml-1 uppercase tracking-widest">{currency} Revenue Trend</p>
              </>
            }
          >
            <div className="w-full h-full relative -ml-4 pr-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
                  <defs>
                    <linearGradient id="colorThemeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ChartTheme.colors.primary} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={ChartTheme.colors.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={ChartTheme.grid.stroke} strokeDasharray={ChartTheme.grid.strokeDasharray} vertical={true} />

                  <XAxis
                    dataKey="name"
                    {...ChartTheme.axis}
                    minTickGap={20}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: ChartTheme.colors.text, fontWeight: 700 }}
                    dx={10}
                    tickFormatter={(val) => currency === "USD" ? `$${val.toFixed(0)}` : (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val)}
                  />

                  <Tooltip
                    cursor={ChartTheme.tooltip.cursor}
                    contentStyle={ChartTheme.tooltip.contentStyle}
                    itemStyle={ChartTheme.tooltip.itemStyle}
                    labelStyle={{ fontSize: '10px', fontWeight: 800, color: ChartTheme.colors.text, marginBottom: '4px', textTransform: 'uppercase' }}
                    formatter={(value, name) => [`${currency === "USD" ? "$" : "NPR "}${parseFloat(value).toLocaleString()}`, name]}
                  />

                  <Bar yAxisId="right" dataKey="Revenue" fill="#9da3af" radius={[4, 4, 4, 4]} barSize={22} />
                  <Area yAxisId="right" type="monotone" dataKey="Revenue" stroke={ChartTheme.colors.primary} strokeWidth={2.5} fillOpacity={1} fill="url(#colorThemeArea)" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </SafeChartFrame>

          {/* 4 Wallet Breakdown Cards - Redesigned for premium look and no-squash */}
          <div className="grid grid-cols-4 gap-3 shrink-0">
            {WALLET_META.map((w, idx) => {
              const matched = breakdownCounts.find(b => b.tier === w.tier);
              const cnt = matched?.count || 0;
              return (
                <div key={idx} className="bg-white rounded-[22px] border border-gray-100 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer group min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400 group-hover:bg-[#18181B] group-hover:text-white transition-colors border border-slate-100 uppercase">{w.symbol}</div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-gray-900 transition-colors truncate">{w.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-bold leading-none text-[#18181B]">{cnt}</span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase letter-spacing-widest">Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <SafeChartFrame
          title="Subscription status"
          action={
            <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#18181B] hover:bg-gray-50 transition-colors">
              <MoreHorizontal strokeWidth={2.5} className="w-3.5 h-3.5" />
            </button>
          }
        >
          <div className="flex flex-col h-full w-full">
            {/* Header / Summary */}
            <div className="mb-6 mt-1 shrink-0 text-center">
              <span className="text-[44px] font-black block leading-none text-[#18181B] tracking-tight">{activeSubs}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-2 block">Premium Accounts</span>
            </div>

            {/* Radial Chart - Centered & Larger */}
            <div className="w-full flex justify-center mb-6 px-2">
              <div className="w-[180px] h-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="25%"
                    outerRadius="100%"
                    barSize={12}
                    data={radialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      minAngle={15}
                      background={{ fill: '#f8fafc' }}
                      clockWise
                      dataKey="value"
                      nameKey="name"
                      cornerRadius={15}
                    />
                    <Tooltip
                      formatter={(value, name) => [`${value} Accounts`, `PACKAGE: ${name.toUpperCase()}`]}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#18181B' }}
                      cursor={{ fill: 'transparent' }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Optimized Legend - Vertical Tiers */}
            <div className="flex-1 max-h-[150px] overflow-y-auto transparent-scrollbar space-y-3 px-1 custom-scroll-area">
              {walletData.map((w, idx) => {
                const color = idx === 0 ? "#cbd5e1" : idx === 1 ? "#f43f5e" : idx === 2 ? "#f97316" : "#18181B";
                const pct = Math.round((w.count / (activeSubs || 1)) * 100);
                return (
                  <div key={idx} className="group transition-all py-1">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-all">{w.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-900">{w.count}</span>
                        <span className="text-[9px] font-bold text-slate-300">({pct}%)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>



            <p className="text-[10px] text-center text-slate-300 font-bold mt-6 uppercase tracking-widest">Plan performance metrics</p>
          </div>
        </SafeChartFrame>
      </div>
      {/* Exact Match Table Row */}
      <div className="bg-white rounded-[20px] border border-slate-200/60 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto transparent-scrollbar">
          <table className="w-full text-left text-[14px] whitespace-nowrap min-w-[900px]">
            <thead className="text-[13px] text-slate-400 font-bold border-b border-slate-100 bg-slate-50/30">
              <tr>
                <th className="py-4 px-6 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    onChange={handleSelectAll}
                    checked={currentActivities.length > 0 && selectedActivityIds.length === currentActivities.length}
                  />
                </th>
                <th className="py-4 px-4 font-semibold">Activity</th>
                <th className="py-4 px-4 font-semibold">Details</th>
                <th className="py-4 px-4 font-semibold">Value</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold">Time</th>
                <th className="py-4 px-4 text-right font-semibold pr-8"><Plus className="w-4 h-4 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {currentActivities.map((item, idx) => {
                const isOdd = idx % 2 !== 0;
                const statusType = item.status?.toLowerCase();
                const isSelected = selectedActivityIds.includes(item._uniqueId);

                return (
                  <tr key={item._uniqueId} className={`group transition-all ${isSelected ? 'bg-orange-50/30' : 'hover:bg-slate-50/50'}`}>
                    <td className="py-4 px-6 relative">
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedActivityIds([...selectedActivityIds, item._uniqueId]);
                          else setSelectedActivityIds(selectedActivityIds.filter(i => i !== item._uniqueId));
                        }}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {item.label?.split(": ")[0] === "Plan"
                        ? `Plan: ${WALLET_META.find(w => w.tier === item.label.split(": ")[1])?.name || item.label.split(": ")[1]}`
                        : item.label
                      }
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-medium">{item.sub || "System Task"}</td>
                    <td className="py-4 px-4 text-slate-900 font-bold">{item.price && item.price !== "-" ? item.price : "N/A"}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${statusType === 'completed' ? 'bg-indigo-50 text-indigo-500' :
                          statusType === 'pending' ? 'bg-orange-50 text-orange-400' :
                            statusType === 'in progress' ? 'bg-rose-50 text-rose-400' :
                              'bg-slate-50 text-slate-400'
                        }`}>
                        {item.status || "In Process"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-[12px] font-medium selection:bg-none">
                      {item.createdAt ? formatDistanceToNow(parseISO(item.createdAt), { addSuffix: true }) : (item.time || "Just now")}
                    </td>
                    <td className="py-4 px-4 text-right pr-12 relative group/menu">
                      <button className="text-slate-300 hover:text-slate-900 p-1.5 transition-all outline-none">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Floating Context Menu on Hover/Focus */}
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-white border border-slate-200 shadow-xl rounded-xl py-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all z-10 flex items-center px-1">
                        <button
                          onClick={() => {
                            const newDeleted = new Set(deletedActivityIds);
                            newDeleted.add(item._uniqueId);
                            setDeletedActivityIds(newDeleted);
                            toast.success("Activity cleared");
                          }}
                          className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 whitespace-nowrap"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Matching Reference */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500 font-bold">Showing per page</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200/60 rounded-lg text-[12px] font-bold px-2 py-1 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30"
            >
              «
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${currentPage === i + 1 ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 3 && <span className="text-slate-300 px-1">...</span>}
              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${currentPage === totalPages ? 'bg-orange-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  {totalPages}
                </button>
              )}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30"
            >
              »
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500 font-bold">Go to page</span>
            <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1">
              <input
                type="text"
                className="w-6 bg-transparent text-[12px] font-bold text-slate-900 outline-none"
                defaultValue={currentPage}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }
                }}
              />
              <button className="text-[12px] font-bold text-slate-900 ml-1">Go ›</button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar - Aligned with Account Tab Styling */}
      {selectedActivityIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5 flex items-center gap-1 z-[100] animate-in slide-in-from-bottom-5">
          <div className="px-5 border-r border-slate-100 text-[13px] font-bold text-slate-900 pr-6">{selectedActivityIds.length} <span className="text-slate-400 font-medium ml-1">Selected</span></div>
          <button
            onClick={clearSelection}
            className="px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-full transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-slate-400" />
            <span>Clear</span>
          </button>
          <button
            onClick={handleApplyCode}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-xl transition-all"
          >
            <ZapIcon className="w-4 h-4 text-slate-400" />
            <span>Apply Code</span>
          </button>
          <button
            onClick={() => { clearSelection(); toast.success("Drafting edits..."); }}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-xl transition-all"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Edit Info</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 px-6 py-2 hover:bg-rose-50 text-rose-600 text-[13px] font-bold rounded-full transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Bulk Delete</span>
          </button>
        </div>
      )}


    </div>
  );
}
