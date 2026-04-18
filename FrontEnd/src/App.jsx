import React, { useState, useEffect, Suspense, lazy } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ReactLenis from "lenis/react";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";
import { socket } from "./lib/socket";

// Page Imports (Lazy Loaded)
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const DashboardPage = lazy(() => import("./Pages/DashboardPage"));
const ProblemsPage = lazy(() => import("./Pages/ProblemsPage"));
const ProblemPage = lazy(() => import("./Pages/ProblemPage"));
const Servicess = lazy(() => import("./Pages/Servicess"));
const CodingEnvironemt = lazy(() => import("./Pages/CodingEnvironemt"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const AdminLoginPage = lazy(() => import("./Pages/AdminLoginPage"));
const AdminChangePasswordPage = lazy(() => import("./Pages/AdminChangePasswordPage"));
const PriceOverview = lazy(() => import("./Pages/PriceOverview"));
const Connection = lazy(() => import("./components/Connection"));
const LeaderboardPage = lazy(() => import("./Pages/LeaderboardPage"));
const DocsPage = lazy(() => import("./Pages/DocsPage"));
const TermsPage = lazy(() => import("./Pages/TermsPage"));
const Faq = lazy(() => import("./Pages/FAQ"));

// Admin Auth (no Clerk)
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";

// CSS Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const SessionPage = lazy(() => import("./Pages/SessionPage"));
const CosmicCheckout = lazy(() => import("./Pages/CheckOutPage"));
import PaymentListener from "./components/PaymentListener";
const AboutUs = lazy(() => import("./Pages/AboutUs"));
import ClerkAxiosInterceptor from "./components/ClerkAxiosInterceptor";
import { MessengerProvider } from "./context/MessengerContext";
import MessengerTrigger from "./components/messenger/MessengerTrigger";
import MessengerPanel from "./components/messenger/MessengerPanel";

const App = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();
  const location = useLocation();

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
      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [isLoaded, isSignedIn, user?.id, navigate]);

  if (!isLoaded) return null;

  return (
    <ClerkAxiosInterceptor>
      <MessengerProvider>
        <ReactLenis root>
          <div className="root-container dark:bg-black relative min-h-screen w-full">
            <ScrollToTop />
            <PaymentListener />
            <Suspense fallback={<LoadingSpinner />}>
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
                <Route path="/aboutus" element={<AboutUs theme={theme} setTheme={setTheme} />} />
                <Route path="/FAQ" element={<Faq theme={theme} setTheme={setTheme} />} />
              </Routes>
            </Suspense>

            {isSignedIn && ["/dashboard", "/problems", "/leaderboard"].some(p => location.pathname === p) && (
              <>
                <MessengerTrigger />
                <MessengerPanel />
              </>
            )}
          </div>
          <Toaster />
        </ReactLenis>
      </MessengerProvider>
    </ClerkAxiosInterceptor>
  );
};

export default App;