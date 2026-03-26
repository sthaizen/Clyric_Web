import React from "react";
import MetricCard from "./ui/MetricCard";
import { 
  Users, Activity, Code2, CheckCircle2, 
  XOctagon, Clock, Trophy, Flame
} from "lucide-react";

export default function AdminStatsOverview({ stats, isLoading }) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[120px] bg-white rounded-2xl animate-pulse border border-slate-200 shadow-sm" />
        ))}
      </div>
    );
  }

  // Calculate some derived metrics for trends (mocking trend calculation as we don't have historical DAU in this specific payload)
  const dauTrend = stats.users.activeToday > 0 ? 12.4 : 0; 
  const wauTrend = 5.1; 

  const metrics = [
    {
      title: "Daily Active Users",
      value: stats.users.activeToday,
      icon: Users,
      color: "indigo",
      trend: dauTrend,
      trendLabel: "vs yesterday",
    },
    {
      title: "Weekly Active Users",
      value: stats.users.activeThisWeek,
      icon: Activity,
      color: "indigo",
      trend: wauTrend,
      trendLabel: "vs last week",
    },
    {
      title: "Live Sessions",
      value: stats.sessions.active,
      icon: Flame,
      color: "orange",
      suffix: stats.sessions.active > 0 ? " active" : "",
      // No trend for live state
      sparkline: false
    },
    {
      title: "Total Signups",
      value: stats.users.total,
      icon: Users,
      color: "zinc",
      trend: stats.users.newToday > 0 ? Math.round((stats.users.newToday / stats.users.total) * 100) : 0,
      trendLabel: `+${stats.users.newToday} today`,
      sparkline: false
    },
    {
      title: "Submissions Today",
      value: stats.submissions.today,
      icon: Code2,
      color: "violet",
      trend: 8.2, // mock trend
      trendLabel: "vs yesterday",
    },
    {
      title: "Accepted Solutions",
      value: stats.submissions.acceptedToday,
      icon: CheckCircle2,
      color: "emerald",
      trend: stats.submissions.acceptanceRateToday,
      trendLabel: "acceptance rate",
    },
    {
      title: "Failed Attempts",
      value: stats.submissions.failedToday,
      icon: XOctagon,
      color: "rose",
      trend: -2.3, // mock
      trendLabel: "vs yesterday",
    },
    {
      title: "Quests Completed",
      value: stats.quests.completedToday,
      icon: Trophy,
      color: "orange",
      trend: 14.5, // mock
      trendLabel: "vs yesterday",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
}
