import React from "react";
import { Users, Video, FileText, Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeConfig = {
  signup: { icon: Users, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
  submission: { icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  session: { icon: Video, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  default: { icon: Clock, color: "text-slate-500", bg: "bg-slate-100 border-slate-200" },
};

export default function RecentActivityFeed({ activity, isLoading, onViewAll }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-3 animate-pulse">
            <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3.5 bg-slate-100 rounded w-2/3" />
              <div className="h-2.5 bg-slate-50 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activity?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50">
        <Clock className="w-8 h-8 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm font-medium">No recent activity detected.</p>
        <p className="text-slate-400 text-[13px] mt-1 text-center">Platform events will appear here.</p>
      </div>
    );
  }

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Scroll to top of the page where the KravioOverview monitoring table is
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-1 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
        {activity.map((item, i) => {
          const cfg = typeConfig[item.type] || typeConfig.default;
          const Icon = cfg.icon;

          return (
            <div
              key={i}
              className="group flex gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.bg} border mt-0.5`}>
                <Icon className={`w-4 h-4 ${cfg.color}`} />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <p className="text-sm font-medium text-slate-900 leading-snug">{item.label}</p>
                  <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap mt-0.5">
                    {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 truncate leading-tight">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleViewAll}
        className="mt-2 w-full py-2.5 text-[13px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-1"
      >
        View all logs <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

