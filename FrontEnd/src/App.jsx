import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ReactLenis from "lenis/react";
import { Toaster } from "react-hot-toast";
import { useUser } from "@clerk/clerk-react";

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

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const [theme, setTheme] = useState("light");

  if (!isLoaded) return null;

  return (
    <ReactLenis root>
      <div className="root-container dark:bg-black relative min-h-screen w-full">
        <Routes>
          {/* Main Landing Page Route */}
          <Route 
            path="/" 
            element={<LandingPage theme={theme} setTheme={setTheme} />} 
          />

          <Route
            path="/dashboard"
            element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />}
          />

          {/* Other Routes */}
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problem/:id" element={<ProblemPage />} />
          <Route path="/connection" element={<Connection />} />
          <Route path="/service" element={<Servicess />} />
          <Route path="/coding" element={<CodingEnvironemt />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/price" element={<PriceOverview />} />
        </Routes>
      </div>
      <Toaster />
    </ReactLenis>
  );
};

export default App;