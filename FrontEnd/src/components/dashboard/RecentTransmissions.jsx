import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

function getVerdictIcon(verdict) {
  if (verdict === 'Accepted') {
    return <CheckCircle2 size={20} fill="#a78bfa" className="text-[#1A1C23]" />;
  }
  if (verdict === 'Time Limit Exceeded') {
    return <AlertCircle size={20} fill="#fca5a5" className="text-[#1A1C23]" />;
  }
  // Wrong Answer, Runtime Error, Compilation Error, etc.
  return <AlertTriangle size={20} fill="#fbbf24" className="text-[#1A1C23]" />;
}

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatStatus(item) {
  const parts = [];
  if (item.difficulty) parts.push(item.difficulty.toUpperCase());
  if (item.verdict) {
    if (item.verdict === 'Accepted') {
      if (item.runtimeMs != null) parts.push(`${item.runtimeMs}MS`);
      if (item.memoryKb != null) parts.push(`${(item.memoryKb / 1024).toFixed(1)}MB`);
    } else {
      parts.push(item.verdict.toUpperCase());
    }
  }
  return parts.join(' • ');
}

const RecentTransmissions = ({ recentSubmissions = [] }) => {
  if (recentSubmissions.length === 0) {
    return (
      <div className="bg-[#16161a] rounded-2xl p-6 h-full relative shadow-sm border border-[#2A2B32]/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[18px] font-bold text-gray-100">Recent Submission</h3>
        </div>
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-500 text-sm">No submissions yet. Start solving!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#16161a] rounded-2xl p-6 h-full relative shadow-sm border border-[#2A2B32]/30 flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h3 className="text-[18px] font-bold text-gray-100">
          Recent Submission
        </h3>
        <button className="text-[12px] font-bold uppercase tracking-widest text-[#a78bfa] hover:text-[#c084fc] transition-colors pr-4">
          VIEW ALL
        </button>
      </div>

      {/* List - Added max-h-[280px] and overflow-y-auto here */}
      <div className="flex flex-col gap-1 pr-2 max-h-[200px] overflow-y-auto custom-scrollbar">
        {recentSubmissions.map((t, idx) => (
          <div key={idx} className="flex items-center gap-4 hover:bg-[#1F2028] p-3 rounded-xl transition-colors cursor-pointer group">

            {/* Icon Box */}
            <div className="bg-[#1d1d22]/60 group-hover:bg-[#2A2B32] border border-[#2a2a35] p-2.5 rounded-xl transition-colors flex-shrink-0">
              {getVerdictIcon(t.verdict)}
            </div>

            {/* Text Content */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[15px] font-bold text-gray-100 truncate">
                {t.title || t.problemSlug}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase truncate mt-0.5">
                {formatStatus(t)}
              </span>
            </div>

            {/* Time */}
            <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap flex-shrink-0">
              {formatTimeAgo(t.date)}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RecentTransmissions;