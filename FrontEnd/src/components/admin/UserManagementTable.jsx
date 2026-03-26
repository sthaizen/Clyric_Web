import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import { Search, ChevronLeft, ChevronRight, Shield, UserX, UserCheck, Loader2, MoreVertical, Ban, Eye, Mail, Activity, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

const roleBadge = {
  admin: "bg-indigo-50 text-indigo-700 border-indigo-200",
  user: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusBadge = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  suspended: "bg-amber-50 text-amber-700 border-amber-200",
  banned: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function UserManagementTable({ users, pagination, isLoading, onPageChange, onSearch, onFilterChange }) {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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

  const handleAction = (id, updates) => {
    setActionLoading(id + JSON.stringify(updates));
    updateMutation.mutate({ id, updates });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  return (
    <div className="space-y-4">
      {/* Premium Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 min-w-0 flex gap-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button type="submit" className="hidden"></button>
        </form>
        <div className="flex gap-2">
          <select
            onChange={(e) => onFilterChange({ role: e.target.value })}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer appearance-none min-w-[120px]"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 focus:outline-none focus:border-indigo-500 shadow-sm cursor-pointer appearance-none min-w-[120px]"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Clean Light-Theme Data Table */}
      <div className="overflow-hidden border border-slate-200 bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide">
              <tr>
                <th className="px-5 py-3.5">User Identity</th>
                <th className="px-5 py-3.5">Status & Role</th>
                <th className="px-5 py-3.5">Engagement</th>
                <th className="px-5 py-3.5">Performance</th>
                <th className="px-5 py-3.5">Recent Activity</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 w-32 bg-slate-100 rounded" />
                          <div className="h-2 w-48 bg-slate-50 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-5 w-20 bg-slate-100 rounded-md" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-4 w-28 bg-slate-100 rounded" /></td>
                    <td className="px-5 py-4 text-right"><div className="h-8 w-8 bg-slate-100 rounded-lg inline-block" /></td>
                  </tr>
                ))
              ) : !users?.length ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const busy = (key) => actionLoading === user._id + JSON.stringify(key);
                  const isBanned = user.status === "banned";
                  
                  return (
                    <tr key={user._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {user.profileImage ? (
                              <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[13px] text-slate-600 font-semibold shadow-sm">
                                {user.name?.[0]?.toUpperCase() || "?"}
                              </div>
                            )}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-emerald-500' : user.status === 'suspended' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-900 font-semibold truncate leading-tight">{user.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <p className="text-slate-500 text-[12px] truncate" title={user.email}>{user.email}</p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${statusBadge[user.status]}`}>
                            {user.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${roleBadge[user.role]}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-semibold">Lv. {user.levelStats?.level ?? 1}</span>
                          <span className="text-slate-500 text-[12px] mt-0.5">
                            {user.analytics?.totalSubmissions ?? 0} subs • {user.levelStats?.exp ?? 0} XP
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 align-middle">
                        {user.analytics?.totalSubmissions > 0 ? (
                          <div className="w-full max-w-[120px]">
                            <div className="flex justify-between text-[11px] font-medium mb-1.5">
                              <span className="text-slate-500">Acceptance</span>
                              <span className={user.analytics?.acceptanceRate >= 50 ? 'text-emerald-600' : 'text-amber-600'}>
                                {user.analytics?.acceptanceRate}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${user.analytics?.acceptanceRate >= 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${user.analytics?.acceptanceRate}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium italic">No tracking data</span>
                        )}
                      </td>
                      <td className="px-5 py-3 align-middle">
                        {user.analytics?.lastActive ? (
                          <div className="flex flex-col">
                            <span className="text-slate-900 font-medium text-[12px]">
                              {formatDistanceToNow(new Date(user.analytics.lastActive), { addSuffix: true })}
                            </span>
                            <span className="text-slate-400 text-[11px] mt-0.5">
                              Last online
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col text-[12px] text-slate-500">
                            Never active
                            <span className="text-[10px] text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 align-middle text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          
                          <button 
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <div className="w-px h-5 bg-slate-200 mx-1" />

                          {user.role === "user" ? (
                            <button
                              title="Promote to Admin"
                              onClick={() => handleAction(user._id, { role: "admin" })}
                              className="p-1.5 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            >
                              {busy({ role: "admin" }) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button
                              title="Demote to User"
                              onClick={() => handleAction(user._id, { role: "user" })}
                              className="p-1.5 bg-white text-indigo-600 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            >
                              {busy({ role: "user" }) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                            </button>
                          )}

                          {user.status === "active" ? (
                            <button
                              title="Suspend User"
                              onClick={() => handleAction(user._id, { status: "suspended" })}
                              className="p-1.5 bg-white text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            >
                              {busy({ status: "suspended" }) ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                            </button>
                          ) : (
                            <button
                              title="Reactivate User"
                              onClick={() => handleAction(user._id, { status: "active" })}
                              className="p-1.5 bg-white text-amber-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            >
                              {busy({ status: "active" }) ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                          )}

                          {!isBanned && (
                            <button
                              title="Ban User"
                              onClick={() => handleAction(user._id, { status: "banned" })}
                              className="p-1.5 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 shadow-sm"
                            >
                              {busy({ status: "banned" }) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                            </button>
                          )}
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
              Showing {users?.length || 0} of {pagination.total.toLocaleString()} users
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

      {/* Light Theme Detail Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedUser(null)} 
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              {selectedUser.profileImage ? (
                <img src={selectedUser.profileImage} alt="" className="w-16 h-16 rounded-2xl border border-slate-200 shadow-sm object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl text-slate-600 font-semibold shadow-sm">
                  {selectedUser.name?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-[18px] font-semibold text-slate-900 leading-tight">{selectedUser.name}</h3>
                <p className="text-slate-500 text-[13px]">{selectedUser.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${statusBadge[selectedUser.status]}`}>
                    {selectedUser.status}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${roleBadge[selectedUser.role]}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total XP</p>
                <p className="text-2xl text-slate-900 font-semibold tracking-tight">{selectedUser.levelStats?.exp ?? 0}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-1">Solved</p>
                <p className="text-2xl text-slate-900 font-semibold tracking-tight">{selectedUser.analytics?.acceptedCount ?? 0}</p>
              </div>
            </div>

            <div className="space-y-1">
               <div className="flex justify-between text-[13px] py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Clerk ID</span>
                  <span className="text-slate-700 font-mono text-[11px] bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{selectedUser.clerkId}</span>
               </div>
               <div className="flex justify-between text-[13px] py-2.5 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Member Since</span>
                  <span className="text-slate-900 font-medium">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
               </div>
               {selectedUser.analytics?.preferredLanguages?.length > 0 && (
                 <div className="flex justify-between text-[13px] py-2.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Languages</span>
                    <span className="flex items-center gap-1.5 flex-wrap justify-end">
                      {selectedUser.analytics.preferredLanguages.map(lang => (
                        <span key={lang} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{lang}</span>
                      ))}
                    </span>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
