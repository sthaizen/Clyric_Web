import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ title, value, icon: Icon, trend, trendLabel, color = "indigo", suffix, formatValue = true, sparkline = true }) {
  // Map colors to a subtle light-theme palette
  const colorMap = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    violet: "text-violet-600 bg-violet-50 border-violet-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    orange: "text-amber-600 bg-amber-50 border-amber-100",
    zinc: "text-slate-600 bg-slate-50 border-slate-200",
  };

  const theme = colorMap[color] || colorMap.indigo;
  const displayValue = formatValue && typeof value === 'number' ? value.toLocaleString() : value;

  // Mock a simple wave SVG sparkline if requested
  const sparklineEl = sparkline && (
    <svg className={`w-16 h-8 ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} viewBox="0 0 64 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {trend >= 0 
        ? <path d="M2 24 L14 18 L26 28 L40 12 L52 20 L62 4" />
        : <path d="M2 8 L14 16 L26 6 L40 22 L52 14 L62 26" />
      }
    </svg>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] font-semibold text-slate-500 tracking-wide">{title}</span>
        {Icon && (
          <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900 mb-1">
            {displayValue}{suffix}
          </h3>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
              {trendLabel && <span className="text-[11px] text-slate-500 font-medium">{trendLabel}</span>}
            </div>
          )}
        </div>
        
        {/* Sparkline placed at bottom right */}
        {sparkline && (
          <div className="mb-2 opacity-60">
            {sparklineEl}
          </div>
        )}
      </div>
    </div>
  );
}
