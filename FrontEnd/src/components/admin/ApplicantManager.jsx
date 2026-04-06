import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle, XCircle, Clock, Shield, User, Mail,
  AlertTriangle, ChevronDown, ChevronUp, Search, Filter,
  UserCheck, UserX, Pause, Play, MoreHorizontal, Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";

/**
 * ApplicantManager.jsx
 *
 * Master admin approval panel component.
 * Displays all admin accounts/applicants with full lifecycle management.
 * No Clerk dependency.
 */

const STATUS_CONFIG = {
  pending_email_verification: {
    label: "Email Pending",
    icon: Mail,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
  },
  pending_approval: {
    label: "Awaiting Approval",
    icon: Clock,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
  },
  active: {
    label: "Active",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-400",
  },
  suspended: {
    label: "Suspended",
    icon: Pause,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    dot: "bg-orange-400",
  },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {};
  const Icon = cfg.icon || Shield;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label || status}
    </span>
  );
};

export default function ApplicantManager() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-accounts", filterStatus],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/accounts${filterStatus ? `?status=${filterStatus}` : ""}`);
      return res.data;
    },
    refetchInterval: 30000,
  });

  const admins = (data?.admins || []).filter(a =>
    !search ||
    a.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const mutationOpts = (successMsg) => ({
    onSuccess: (_, variables) => {
      toast.success(successMsg);
      queryClient.invalidateQueries({ queryKey: ["admin-accounts"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Action failed."),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => axiosInstance.patch(`/admin/applicants/${id}/approve`),
    ...mutationOpts("Admin approved successfully."),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => axiosInstance.patch(`/admin/applicants/${id}/reject`, { reason }),
    ...mutationOpts("Applicant rejected."),
  });

  const suspendMutation = useMutation({
    mutationFn: (id) => axiosInstance.patch(`/admin/admins/${id}/suspend`),
    ...mutationOpts("Admin suspended."),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id) => axiosInstance.patch(`/admin/admins/${id}/reactivate`),
    ...mutationOpts("Admin reactivated."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/admin/accounts/${id}`),
    ...mutationOpts("Admin account removed."),
  });

  const handleReject = () => {
    if (!rejectTarget) return;
    rejectMutation.mutate({ id: rejectTarget._id, reason: rejectReason });
    setRejectTarget(null);
    setRejectReason("");
  };

  const statusFilters = ["", "pending_approval", "pending_email_verification", "active", "rejected", "suspended"];

  return (
    <div className="space-y-5">

      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Admin Account Management</h3>
          <p className="text-sm text-slate-500">Review applications and manage admin access.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 w-52 bg-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
          >
            <option value="">All statuses</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="pending_email_verification">Email Pending</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-slate-100">
          No accounts found{filterStatus ? ` with status "${filterStatus}"` : ""}.
        </div>
      ) : (
        <div className="space-y-2">
          {admins.map(admin => {
            const isExpanded = expandedId === admin._id;
            return (
              <div key={admin._id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Main row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {admin.fullName?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm truncate">{admin.fullName}</p>
                      {admin.isMasterAdmin && (
                        <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-md border border-orange-200 uppercase tracking-wider">Master</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{admin.email}</p>
                  </div>
                  <StatusBadge status={admin.status} />
                  <div className="flex items-center gap-1">
                    {/* Approve */}
                    {admin.status === "pending_approval" && (
                      <button
                        onClick={() => approveMutation.mutate(admin._id)}
                        disabled={approveMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors"
                        title="Approve"
                      >
                        <UserCheck size={12} /> Approve
                      </button>
                    )}
                    {/* Reject / Re-reject */}
                    {(admin.status === "pending_approval" || admin.status === "pending_email_verification") && (
                      <button
                        onClick={() => setRejectTarget(admin)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <UserX size={12} /> Reject
                      </button>
                    )}
                    {/* Suspend */}
                    {admin.status === "active" && !admin.isMasterAdmin && (
                      <button
                        onClick={() => { if (window.confirm(`Suspend ${admin.fullName}?`)) suspendMutation.mutate(admin._id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors"
                        title="Suspend"
                      >
                        <Pause size={12} /> Suspend
                      </button>
                    )}
                    {/* Reactivate */}
                    {admin.status === "suspended" && (
                      <button
                        onClick={() => reactivateMutation.mutate(admin._id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                        title="Reactivate"
                      >
                        <Play size={12} /> Reactivate
                      </button>
                    )}
                    {/* Remove Entirely */}
                    {!admin.isMasterAdmin && (
                      <button
                        onClick={() => { if (window.confirm(`Permanently remove ${admin.fullName}? This cannot be undone.`)) deleteMutation.mutate(admin._id); }}
                        disabled={deleteMutation.isPending}
                        className="flex items-center justify-center w-8 h-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Remove Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : admin._id)}
                      className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 border-t border-slate-50 bg-slate-50/50 grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <div><span className="font-semibold text-slate-600">Applied:</span> {new Date(admin.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-semibold text-slate-600">Email Verified:</span> {admin.emailVerifiedAt ? new Date(admin.emailVerifiedAt).toLocaleDateString() : "No"}</div>
                    {admin.approvedAt && <div><span className="font-semibold text-slate-600">Approved:</span> {new Date(admin.approvedAt).toLocaleDateString()}</div>}
                    {admin.rejectedAt && <div><span className="font-semibold text-slate-600">Rejected:</span> {new Date(admin.rejectedAt).toLocaleDateString()}</div>}
                    {admin.rejectionReason && (
                      <div className="col-span-2 bg-red-50 border border-red-100 rounded-lg p-2">
                        <span className="font-semibold text-red-600">Rejection Reason:</span> {admin.rejectionReason}
                      </div>
                    )}
                    {admin.lastLoginAt && <div><span className="font-semibold text-slate-600">Last Login:</span> {new Date(admin.lastLoginAt).toLocaleString()}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <XCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Reject Application</h3>
                <p className="text-sm text-slate-500">{rejectTarget.fullName} · {rejectTarget.email}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Reason (optional — sent to applicant)</label>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Provide a reason for rejection…"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={handleReject} disabled={rejectMutation.isPending} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60">
                {rejectMutation.isPending ? "Rejecting…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
