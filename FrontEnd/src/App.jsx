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
import PriceOverview from "./Pages/PriceOverview";
import Connection from "./components/Connection";
import LeaderboardPage from "./Pages/LeaderboardPage";
import DocsPage from "./Pages/DocsPage";

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

      // Auto-navigation for Admin
      if (user.publicMetadata?.role === "admin") {
        const currentPath = window.location.pathname;
        if (currentPath === "/" || currentPath === "/dashboard") {
          navigate("/admin");
        }
      }

      return () => {
        socket.off("connect", onConnect);
      };
    }
  }, [isLoaded, isSignedIn, user?.id, user?.publicMetadata?.role, navigate]);

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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/priceoverview" element={<PriceOverview />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/checkout" element={<CosmicCheckout />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
        </Routes>
      </div>
      <Toaster />
    </ReactLenis>
  );
};

export default App;