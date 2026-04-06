import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * AdminRouteGuard.jsx
 *
 * Protects all /admin/* routes (except /admin/login, /admin/reset-password).
 * Uses AdminAuthContext — completely independent of Clerk.
 *
 * Behavior:
 * - While loading: render nothing (prevents flash)
 * - Not signed in: redirect to /admin/login
 * - mustChangePassword: redirect to /admin/change-password
 * - Active + no forced change: render children
 */
export default function AdminRouteGuard({ children }) {
  const { isAdminLoaded, isAdminSignedIn, adminUser } = useAdminAuth();

  // Still resolving session from cookie — don't flash anything
  if (!isAdminLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Verifying admin session…</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAdminSignedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but must change password
  if (adminUser?.mustChangePassword) {
    return <Navigate to="/admin/change-password" replace />;
  }

  // All clear
  return children;
}
