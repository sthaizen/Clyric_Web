import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ReactLenis from "lenis/react";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { socket } from "./lib/socket";

// Page Imports
import LandingPage from "./Pages/LandingPage";
import DashboardPage from "./Pages/DashboardPage";
import ProblemsPage from "./Pages/ProblemsPage";
import ProblemPage from "./Pages/ProblemPage";
import Servicess from "./Pages/Servicess";
import CodingEnvironemt from "./Pages/CodingEnvironemt";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminLoginPage from "./Pages/AdminLoginPage";
import AdminChangePasswordPage from "./Pages/AdminChangePasswordPage";
import PriceOverview from "./Pages/PriceOverview";
import Connection from "./components/Connection";
import LeaderboardPage from "./Pages/LeaderboardPage";
import DocsPage from "./Pages/DocsPage";
import TermsPage from "./Pages/TermsPage";

// Admin Auth (no Clerk)
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

// CSS Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SessionPage from "./Pages/SessionPage";
import CosmicCheckout from "./Pages/CheckOutPage";
import PaymentListener from "./components/PaymentListener";

const App = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const onConnect = () => {
        socket.emit("user-connected", user.id);
      };

      socket.on("connect", onConnect);

      if (socket.connected) {
        onConnect();
      } else {
        socket.connect();
      }

      // NOTE: Admin auto-redirect via Clerk has been removed.
      // Admins now log in at /admin/login using a separate custom auth system.

      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [isLoaded, isSignedIn, user?.id, navigate]);

  if (!isLoaded) return null;

  return (
    <ReactLenis root>
      <div className="root-container dark:bg-black relative min-h-screen w-full">
        <PaymentListener />
        <Routes>
          {/* Main Landing Page Route */}
          <Route
            path="/"
            element={<LandingPage theme={theme} setTheme={setTheme} />}
          />

          <Route
            path="/dashboard" element={<DashboardPage />}
          />

          {/* Other Routes */}
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problem/:id" element={<ProblemPage />} />
          <Route path="/session/:id" element={<SessionPage />} />
          <Route path="/connection" element={<Connection />} />
          <Route path="/service" element={<Servicess />} />
          <Route path="/coding" element={<CodingEnvironemt />} />
          {/* ─── Admin Routes (custom auth — no Clerk) ─── */}
          <Route path="/admin/login" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
          <Route path="/admin/reset-password" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
          <Route path="/admin/change-password" element={<AdminAuthProvider><AdminChangePasswordPage /></AdminAuthProvider>} />
          <Route path="/admin" element={
            <AdminAuthProvider>
              <AdminRouteGuard>
                <AdminDashboard />
              </AdminRouteGuard>
            </AdminAuthProvider>
          } />
          
          <Route path="/priceoverview" element={<PriceOverview />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/checkout" element={<CosmicCheckout />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </div>
      <Toaster />
    </ReactLenis>
  );
};

export default App;