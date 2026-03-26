import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
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

// CSS Imports
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SessionPage from "./Pages/SessionPage";
import CosmicCheckout from "./Pages/CheckOutPage";
import PaymentListener from "./components/PaymentListener";

const App = () => {
  const { isSignedIn, isLoaded, user } = useUser();
  const [theme, setTheme] = useState("light");

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
  }, [isLoaded, isSignedIn, user?.id]);

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
          <Route path="/price" element={<PriceOverview />} />
          <Route path="/checkout" element={<CosmicCheckout />} />
        </Routes>
      </div>
      <Toaster />
    </ReactLenis>
  );
};

export default App;