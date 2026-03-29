import React, { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import {
  Search, Shield, Ban, UserCheck, Loader2, X, Plus,
  Star, MoreHorizontal, Users, TrendingUp, Activity, UserX
} from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, RadialBarChart, RadialBar, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ─── Config ──────────────────────────────────────────────────────────────────
const roleBadge = {
  admin: "bg-slate-900 text-white border-slate-900",
  user:  "bg-slate-100 text-slate-500 border-slate-200",
};

const statusBadge = {
  active:    "bg-emerald-50 text-emerald-600 border-emerald-100",
  suspended: "bg-orange-50 text-orange-400 border-orange-100",
  banned:    "bg-rose-50 text-rose-500 border-rose-100",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function UserManagementTable({
  globalStats, users, pagination, isLoading,
  onPageChange, onSearch, onFilterChange
}) {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUser, setSelectedUser]   = useState(null);
  const [selectedIds, setSelectedIds]     = useState([]);
  const [limitVal, setLimitVal]           = useState(10);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => adminApi.updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("User updated");
      setActionLoading(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
      setActionLoading(null);
    },
  });

  const handleBulkAction = async (ids, updates) => {
    if (!ids?.length) return;
    setActionLoading(true);
    const results = await Promise.allSettled(ids.map(id => adminApi.updateUser(id, updates)));
    const ok  = results.filter(r => r.status === "fulfilled").length;
    const bad = results.filter(r => r.status === "rejected").length;
    queryClient.invalidateQueries(["admin-users"]);
    if (bad === 0) toast.success(`Updated ${ok} users`);
    else           toast.error(`Updated ${ok}, failed ${bad}`);
    setSelectedIds([]);
    setActionLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  // ─── Chart Data ────────────────────────────────────────────────────────────
  const signupTrend = useMemo(() =>
    (globalStats?.trends?.signups || []).map(item => ({
      date:  item._id ? format(parseISO(item._id), "dd MMM") : "N/A",
      count: item.count || 0,
    })), [globalStats]);

  // Role breakdown bar chart data
  const roleBreakdown = useMemo(() => {
    const adminCount  = (users || []).filter(u => u.role === "admin").length;
    const userCount   = (users || []).filter(u => u.role !== "admin").length;
    const bannedCount2 = (users || []).filter(u => u.status === "banned").length;
    const activeCount2 = (users || []).filter(u => u.status === "active").length;
    return [
      { label: "Members", count: userCount },
      { label: "Admins",  count: adminCount },
      { label: "Active",  count: activeCount2 },
      { label: "Banned",  count: bannedCount2 },
    ];
  }, [users]);

  // Status donut chart data
  const STATUS_COLORS = { active: "#10b981", suspended: "#f97316", banned: "#f43f5e" };
  const statusDonut = useMemo(() => {
    const map = { active: 0, suspended: 0, banned: 0 };
    (users || []).forEach(u => { if (map[u.status] !== undefined) map[u.status]++; });
    return Object.entries(map)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }));
  }, [users]);

  // ─── KPI Derived Values ────────────────────────────────────────────────────
  const totalUsers   = globalStats?.users?.total || pagination?.totalUsers || users?.length || 0;
  const newToday     = globalStats?.users?.newToday ?? 0;
  const activeToday  = globalStats?.users?.activeToday ?? 0;
  const bannedCount  = (users || []).filter(u => u.status === "banned").length;

  // ─── Pagination handler ─────────────────────────────────────────────────────
  const handleLimitChange = (val) => {
    setLimitVal(val);
    onFilterChange({ limit: val, page: 1 });
  };

  const handleGoToPage = (val) => {
    const p = parseInt(val);
    if (p > 0 && p <= (pagination?.totalPages || 1)) onPageChange(p);
  };

  return (
    <div className="space-y-6">

      {/* ── 4 KPI Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 px-1">
        {/* KPI 1: Total Users */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">Total Accounts</span>
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-slate-100 transition-colors">
              <Users className="w-4 h-4 text-slate-500" />
            </div>
          </div>
          <span className="text-[34px] font-black text-slate-900 leading-none block">{totalUsers}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">System managed</span>
          </div>
        </div>

        {/* KPI 2: New Today */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">New Today</span>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <span className="text-[34px] font-black text-slate-900 leading-none block">{newToday}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              {globalStats?.users?.newThisWeek ?? 0} this week
            </span>
          </div>
        </div>

        {/* KPI 3: Active Today (DAU) */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">Active Today</span>
            <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
          <span className="text-[34px] font-black text-slate-900 leading-none block">{activeToday}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] font-bold text-slate-300">DAU metric</span>
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ml-1 ${
              activeToday > 0 ? 'text-indigo-500 bg-indigo-50' : 'text-slate-300 bg-slate-50'
            }`}>
              {totalUsers > 0 ? Math.round((activeToday / totalUsers) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* KPI 4: Banned */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all cursor-default group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[13px] font-bold text-slate-400 tracking-tight uppercase">Banned / Suspended</span>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <UserX className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <span className="text-[34px] font-black text-slate-900 leading-none block">{bannedCount}</span>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
              bannedCount === 0 ? 'text-emerald-500 bg-emerald-50' : 'text-rose-500 bg-rose-50'
            }`}>
              {bannedCount === 0 ? "All clear" : "Needs review"}
            </span>
          </div>
        </div>
      </div>

      {/* ── 2 Charts Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 px-1">
        {/* Chart 1: User Status - Radial Bar */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm h-[260px] flex flex-col">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">User Status Distribution</h4>
          <p className="text-[11px] text-slate-400 mb-4">Account health breakdown</p>
          <div className="flex-1 min-h-0 flex items-center gap-4">
            {/* Radial Chart */}
            <div className="w-3/5 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius={25}
                  outerRadius={85}
                  barSize={14}
                  data={[
                    { name: 'Active',    value: (users||[]).filter(u=>u.status==='active').length,    fill: '#10b981' },
                    { name: 'Suspended', value: (users||[]).filter(u=>u.status==='suspended').length, fill: '#f97316' },
                    { name: 'Banned',    value: (users||[]).filter(u=>u.status==='banned').length,    fill: '#f43f5e' },
                  ]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={5}
                    background={{ fill: '#f8fafc' }}
                    clockWise
                    dataKey="value"
                    cornerRadius={8}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="w-2/5 space-y-4">
              {[
                { label: 'Active',    color: '#10b981', count: (users||[]).filter(u=>u.status==='active').length },
                { label: 'Suspended', color: '#f97316', count: (users||[]).filter(u=>u.status==='suspended').length },
                { label: 'Banned',    color: '#f43f5e', count: (users||[]).filter(u=>u.status==='banned').length },
              ].map((item, i) => {
                const total = (users||[]).length || 1;
                const pct = Math.round((item.count / total) * 100);
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-[10px] font-black text-slate-700 uppercase">{item.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{item.count}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 2: Account Role Donut */}
        <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm h-[260px] flex flex-col">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Account Breakdown</h4>
          <p className="text-[11px] text-slate-400 mb-4">Users by role and status</p>
          <div className="flex-1 min-h-0 relative flex items-center">
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleBreakdown.filter(r => r.count > 0).length > 0
                      ? roleBreakdown.filter(r => r.count > 0)
                      : [{ label: "No data", count: 1 }]
                    }
                    dataKey="count"
                    nameKey="label"
                    cx="40%" cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={4}
                  >
                    {roleBreakdown.filter(r => r.count > 0).map((entry, i) => {
                      const ROLE_COLORS = ["#18181B", "#4f46e5", "#10b981", "#f43f5e"];
                      return <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 space-y-3 pr-2">
              {roleBreakdown.filter(r => r.count > 0).length > 0 ? (
                roleBreakdown.filter(r => r.count > 0).map((entry, i) => {
                  const ROLE_COLORS = ["#18181B", "#4f46e5", "#10b981", "#f43f5e"];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ROLE_COLORS[i % ROLE_COLORS.length] }} />
                      <div>
                        <span className="text-[10px] font-black text-slate-700 uppercase block">{entry.label}</span>
                        <span className="text-[10px] font-bold text-slate-400">{entry.count} users</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span className="text-[11px] font-bold text-slate-300 uppercase">No data</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 px-1">
        <form onSubmit={handleSearch} className="flex-1 min-w-0 flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-700 transition-colors" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 shadow-sm"
            />
          </div>
          <button type="submit" className="hidden" />
        </form>
        <div className="flex gap-2">
          <select
            onChange={(e) => onFilterChange({ role: e.target.value })}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none shadow-sm cursor-pointer min-w-[100px]"
          >
            <option value="">Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none shadow-sm cursor-pointer min-w-[100px]"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border border-slate-200/60 bg-white rounded-2xl shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[14px] text-left whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-slate-400 text-[12px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    checked={users?.length > 0 && selectedIds.length === users?.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedIds(users?.map(u => u._id) || []);
                      else setSelectedIds([]);
                    }}
                  />
                </th>
                <th className="px-4 py-4 font-semibold">User Account</th>
                <th className="px-4 py-4 font-semibold">Role</th>
                <th className="px-4 py-4 font-semibold">Submissions</th>
                <th className="px-4 py-4 font-semibold">XP Level</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right">
                  <Plus className="w-4 h-4 ml-auto text-slate-400" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg shrink-0" />
                        <div className="space-y-2">
                          <div className="h-3 w-28 bg-slate-100 rounded" />
                          <div className="h-2 w-40 bg-slate-50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-lg" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-100 rounded-lg" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-6 w-8 bg-slate-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : !users?.length ? (
                <tr>
                  <td colSpan="7" className="px-5 py-14 text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-slate-200" />
                    <p className="font-bold text-slate-500 text-[14px]">No users found</p>
                    <p className="text-[12px] text-slate-400 font-bold mt-1 uppercase tracking-wider">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isSelected = selectedIds.includes(user._id);
                  return (
                    <tr
                      key={user._id}
                      className={`group border-b border-slate-50 transition-all ${isSelected ? "bg-orange-50/30" : "hover:bg-slate-50/40"}`}
                    >
                      <td className="px-6 py-4 relative">
                        {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r" />}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                          onChange={() => setSelectedIds(prev =>
                            prev.includes(user._id) ? prev.filter(i => i !== user._id) : [...prev, user._id]
                          )}
                        />
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img src={user.profileImage} className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-100" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 uppercase">
                              {user.name?.[0]}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-slate-900 leading-tight text-[14px]">{user.name}</span>
                            <span className="text-[11px] text-slate-400 font-bold truncate w-[150px]">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${roleBadge[user.role] || roleBadge.user}`}>
                          {user.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-slate-900 font-bold text-[13px]">
                        {user.analytics?.totalSubmissions ?? 0}
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                          <span className="font-bold text-slate-900 text-[13px]">Lv. {user.levelStats?.level ?? 1}</span>
                          <span className="text-[11px] text-slate-400 font-bold">· {user.levelStats?.exp ?? 0} XP</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusBadge[user.status] || statusBadge.active}`}>
                          {user.status || "active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle text-right pr-6 relative group/actions">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover/actions:opacity-100 transition-all">
                          <button
                            onClick={() => handleBulkAction([user._id], { role: user.role === "admin" ? "user" : "admin" })}
                            title={user.role === "admin" ? "Demote to Member" : "Promote to Admin"}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                          >
                            <Shield className={`w-4 h-4 ${user.role === "admin" ? "text-indigo-500" : ""}`} />
                          </button>
                          <button
                            onClick={() => handleBulkAction([user._id], { status: user.status === "banned" ? "active" : "banned" })}
                            title={user.status === "banned" ? "Unban User" : "Ban User"}
                            className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Ban className={`w-4 h-4 ${user.status === "banned" ? "text-rose-500" : ""}`} />
                          </button>
                          <button
                            onClick={() => setSelectedUser(user)}
                            title="View Details"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
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

        {/* ── Pagination ─────────────────────────────────────────────────── */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-white flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-500 font-bold">Showing per page</span>
            <select
              value={limitVal}
              onChange={(e) => handleLimitChange(parseInt(e.target.value))}
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
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold"
            >«</button>
            <div className="flex items-center gap-1">
              {pagination && Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${pagination.page === i + 1 ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-600"}`}
                >{i + 1}</button>
              ))}
              {(pagination?.totalPages || 0) > 5 && <span className="text-slate-300 px-1">…</span>}
              {(pagination?.totalPages || 0) > 5 && (
                <button
                  onClick={() => onPageChange(pagination.totalPages)}
                  className={`w-8 h-8 rounded-lg text-[13px] font-bold ${pagination?.page === pagination?.totalPages ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-600"}`}
                >{pagination.totalPages}</button>
              )}
            </div>
            <button
              onClick={() => pagination && onPageChange(pagination.page + 1)}
              disabled={!pagination || pagination.page >= pagination.totalPages}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 text-[13px] font-bold"
            >»</button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500 font-bold">Go to page</span>
            <div className="flex items-center bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1 focus-within:border-slate-300 transition-colors">
              <input
                type="text"
                className="w-8 bg-transparent text-[12px] font-bold text-slate-900 outline-none"
                placeholder={pagination?.page}
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
                className="text-[11px] font-black text-indigo-600 ml-1 hover:text-indigo-700"
              >GO</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bulk Action Floating Bar ──────────────────────────────────────── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.08)] rounded-full px-2 py-1.5 flex items-center gap-1 z-[100]">
          <div className="px-5 border-r border-slate-100 text-[13px] font-bold text-slate-900 pr-6">
            {selectedIds.length} <span className="text-slate-400 font-medium ml-1">Selected</span>
          </div>
          <button
            onClick={() => setSelectedIds([])}
            className="px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-600 rounded-full flex items-center gap-2"
          >
            <X className="w-4 h-4 text-slate-400" /> Clear
          </button>
          <button
            disabled={!!actionLoading}
            onClick={() => handleBulkAction(selectedIds, { status: "active" })}
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-[13px] font-bold text-slate-700 rounded-full"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4 text-slate-400" />}
            Activate
          </button>
          <button
            disabled={!!actionLoading}
            onClick={() => handleBulkAction(selectedIds, { status: "banned" })}
            className="flex items-center gap-2 px-6 py-2 hover:bg-rose-50 text-rose-600 text-[13px] font-bold rounded-full"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
            Bulk Ban
          </button>
        </div>
      )}

      {/* ── User Detail Modal ─────────────────────────────────────────────── */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-[28px] w-full max-w-md shadow-2xl p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-full"
            >
              <X strokeWidth={2.5} className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-5 mb-7">
              {selectedUser.profileImage ? (
                <img src={selectedUser.profileImage} className="w-16 h-16 rounded-[20px] border border-slate-100 shadow-sm object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-[20px] bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-700 uppercase">
                  {selectedUser.name?.[0]}
                </div>
              )}
              <div>
                <h3 className="text-[20px] font-black text-slate-900 leading-tight mb-1">{selectedUser.name}</h3>
                <p className="text-slate-400 text-[11px] uppercase tracking-wider font-bold mb-2">{selectedUser.email}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-widest border ${statusBadge[selectedUser.status] || statusBadge.active}`}>
                    {selectedUser.status || "active"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-widest border ${roleBadge[selectedUser.role] || roleBadge.user}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total XP</p>
                <p className="text-[26px] font-black text-slate-900 leading-none">{selectedUser.levelStats?.exp ?? 0}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Problems Solved</p>
                <p className="text-[26px] font-black text-slate-900 leading-none">{selectedUser.analytics?.acceptedCount ?? 0}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Submissions</p>
                <p className="text-[26px] font-black text-slate-900 leading-none">{selectedUser.analytics?.totalSubmissions ?? 0}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Level</p>
                <p className="text-[26px] font-black text-slate-900 leading-none">{selectedUser.levelStats?.level ?? 1}</p>
              </div>
            </div>

            <div className="space-y-0 border border-slate-100 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-50">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Member Since</span>
                <span className="text-slate-900 font-bold text-[13px]">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-50">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Clerk ID</span>
                <span className="text-slate-600 font-bold font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded-lg">{selectedUser.clerkId?.slice(0, 16)}…</span>
              </div>
              {selectedUser.analytics?.preferredLanguages?.length > 0 && (
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Languages</span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {selectedUser.analytics.preferredLanguages.map(lang => (
                      <span key={lang} className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions inside modal */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { handleBulkAction([selectedUser._id], { role: selectedUser.role === "admin" ? "user" : "admin" }); setSelectedUser(null); }}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <Shield className="w-4 h-4" />
                {selectedUser.role === "admin" ? "Demote" : "Promote"}
              </button>
              <button
                onClick={() => { handleBulkAction([selectedUser._id], { status: selectedUser.status === "banned" ? "active" : "banned" }); setSelectedUser(null); }}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-colors ${
                  selectedUser.status === "banned"
                    ? "border border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    : "border border-rose-200 text-rose-600 hover:bg-rose-50"
                }`}
              >
                <Ban className="w-4 h-4" />
                {selectedUser.status === "banned" ? "Unban" : "Ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
