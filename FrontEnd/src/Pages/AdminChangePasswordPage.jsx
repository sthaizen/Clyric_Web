import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

/**
 * AdminChangePasswordPage.jsx
 *
 * Shown when mustChangePassword === true (bootstrap or admin-forced reset).
 * Admin must set a new password before accessing the dashboard.
 * No Clerk imports whatsoever.
 */
export default function AdminChangePasswordPage() {
  const navigate = useNavigate();
  const { adminUser, refreshAdmin, adminLogout } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: "Very Weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-blue-500" },
      { label: "Strong", color: "bg-green-500" },
      { label: "Very Strong", color: "bg-green-600" },
    ];
    return { score, ...map[Math.min(score, 5)] };
  };

  const strength = passwordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword)
      return toast.error("All fields are required.");
    if (newPassword !== confirmPassword)
      return toast.error("New passwords do not match.");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters.");
    if (newPassword === currentPassword)
      return toast.error("New password must be different from current password.");

    setLoading(true);
    try {
      await axiosInstance.post("/admin-auth/change-password", {
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      await refreshAdmin();
      toast.success("Password changed successfully!");
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full text-center shadow-2xl mx-4">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Changed!</h2>
          <p className="text-slate-500 text-sm">Redirecting to the admin dashboard…</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all text-sm bg-white pr-12";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-orange-950 to-slate-900 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Shield size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">CLYRIC</p>
              <p className="text-sm font-bold text-white">Admin Portal</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">Set Your Password</h1>
          <p className="text-slate-400 text-sm">
            {adminUser?.isMasterAdmin
              ? "You're using the bootstrap password. Set a secure password to continue."
              : "A password change is required before accessing the dashboard."}
          </p>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700 font-medium">
            {adminUser?.isMasterAdmin
              ? "The default password admin123 must be replaced immediately."
              : "This is a required security step. You cannot skip it."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {adminUser?.isMasterAdmin ? "Current Password (admin123)" : "Current Password"}
            </label>
            <div className="relative">
              <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className={inputClass} autoComplete="current-password" />
              <button type="button" onClick={() => setShowCurrent(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
            <div className="relative">
              <input type={showNew ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min. 8 characters" className={inputClass} autoComplete="new-password" />
              <button type="button" onClick={() => setShowNew(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-500">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
            <div className="relative">
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className={`${inputClass} ${confirmPassword && confirmPassword !== newPassword ? "border-red-300 focus:ring-red-300" : ""}`} autoComplete="new-password" />
              <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-slate-900 text-white rounded-xl font-semibold transition-all text-sm ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-800 cursor-pointer"}`}
          >
            {loading ? "Changing Password…" : "Set New Password & Continue"}
          </button>

          <button
            type="button"
            onClick={adminLogout}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
