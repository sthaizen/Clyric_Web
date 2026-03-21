import React, { useState, useMemo } from "react";
import ContributionGraph from "../ContributionGraph.jsx";

const DashboardContributionGraph = ({ data, selectedYear, setSelectedYear }) => {
  const contributionData = data?.dailyContributions || data?.contributionGraph || [];
  
  const currentYear = new Date().getFullYear();
  const [localYear, setLocalYear] = useState(currentYear);
  const yearToUse = selectedYear || localYear;
  const setYear = setSelectedYear || setLocalYear;

  const totalContributions = useMemo(() => {
    return contributionData.reduce((sum, day) => {
      if (day.date && day.date.startsWith(yearToUse.toString())) {
        return sum + (day.count || 0);
      }
      return sum;
    }, 0);
  }, [contributionData, yearToUse]);

  return (
    /* 1. MATCHING OUTER SHELL: Using the same bg and border as the Events card */
    <div className="w-full h-full flex flex-col md:flex-row gap-8 font-sans bg-[#16161a] p-6 rounded-2xl border border-white/[0.03] shadow-sm overflow-hidden">
      
      {/* Main Left Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-[20px] text-white font-semibold tracking-tight">
            {totalContributions} Activity in {yearToUse}
          </h2>
          
          <button className="group flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-white transition-colors">
            Activity settings
            <span className="text-[10px] group-hover:translate-y-0.5 transition-transform opacity-60">▼</span>
          </button>
        </div>
        
        {/* 2. THE GRAPH AREA: Centering and ensuring it fits the new container size */}
        <div className="flex-grow flex items-center justify-center pt-2">
           <ContributionGraph 
             data={contributionData} 
             year={yearToUse} 
           />
        </div>
      </div>

    

    </div>
  );
};

export default DashboardContributionGraph;