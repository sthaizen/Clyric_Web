import React, { useState, useMemo } from "react";
import ContributionGraph from "../ContributionGraph.jsx";

const DashboardContributionGraph = ({ data }) => {
  const contributionData = data?.dailyContributions || data?.contributionGraph || [];
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const totalContributions = useMemo(() => {
    return contributionData.reduce((sum, day) => {
      if (day.date && day.date.startsWith(selectedYear.toString())) {
        return sum + (day.count || 0);
      }
      return sum;
    }, 0);
  }, [contributionData, selectedYear]);

  return (
    // 1. Made the outer wrapper the main card matching your top row
    <div className="w-full flex flex-col md:flex-row gap-6 font-sans bg-[#1b1b1f] p-6 rounded-xl border border-[#231c2f] shadow-sm">
      
      {/* Main Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl text-white font-medium tracking-wide">
            {totalContributions} Activity in {selectedYear}
          </h2>
          <button className="text-xs text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            Activity settings
            <span className="text-[10px] opacity-70">▼</span>
          </button>
        </div>
        
        {/* 2. Removed the inner border and background, letting it breathe */}
        <div className="overflow-hidden pt-2">
          <ContributionGraph 
            data={contributionData} 
            year={selectedYear} 
          />
        </div>
      </div>

      {/* Right Sidebar - Year Navigation */}
      <div className="w-full md:w-[150px] md:pt-10 flex flex-col gap-1.5 shrink-0">
        {[currentYear, currentYear - 1].map((yearOption) => (
          <button
            key={yearOption}
            onClick={() => setSelectedYear(yearOption)}
            // 3. Cleaned up the active state to be a subtle wash of indigo, not a heavy block
            className={`text-left px-4 py-2.5 text-[13px] rounded-lg transition-all duration-200 ${
              selectedYear === yearOption
                ? "bg-indigo-500/10 text-indigo-400 font-medium"
                : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
            }`}
          >
            {yearOption}
          </button>
        ))}
      </div>

    </div>
  );
};

export default DashboardContributionGraph;