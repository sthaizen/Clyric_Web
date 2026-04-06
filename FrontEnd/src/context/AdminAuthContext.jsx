import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../lib/axios";

/**
 * AdminAuthContext.jsx
 *
 * Completely independent of Clerk. Manages admin session state
 * via the admin_token httpOnly cookie. No Clerk imports anywhere.
 *
 * Provides: adminUser, isAdminLoaded, isAdminSignedIn, adminLogin, adminLogout
 */

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);

  // On mount: check if there is an active admin session
  const checkSession = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/admin-auth/me");
      setAdminUser(res.data);
    } catch {
      // 401 = no session or expired — that's expected when not logged in
      setAdminUser(null);
    } finally {
      setIsAdminLoaded(true);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /**
   * Log in: POST credentials, store returned admin data in state.
   * The admin_token cookie is set by the backend automatically.
   */
  const adminLogin = async (email, password) => {
    const res = await axiosInstance.post("/admin-auth/login", { email, password });
    setAdminUser(res.data.admin);
    return res.data;
  };

  /**
   * Log out: clear cookie via backend, clear local state.
   */
  const adminLogout = async () => {
    try {
      await axiosInstance.post("/admin-auth/logout");
    } catch {
      // Even if the request fails, clear local state
    }
    setAdminUser(null);
  };

  /**
   * Refresh admin profile (e.g. after changing password).
   */
  const refreshAdmin = async () => {
    await checkSession();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminLoaded,
        isAdminSignedIn: !!adminUser,
        adminLogin,
        adminLogout,
        refreshAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

/**
 * Hook to consume admin auth state anywhere inside AdminAuthProvider.
 * Must NOT be used in normal user-facing components.
 */
export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within <AdminAuthProvider>");
  }
  return ctx;
};

export default AdminAuthContext;
