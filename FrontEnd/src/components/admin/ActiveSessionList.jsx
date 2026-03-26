import React from "react";
import { Video, Clock, RefreshCw, Users, HelpCircle, Activity, Globe, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const difficultyBadge = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function ActiveSessionList({ sessions, isLoading, onRefresh }) {
  // Determine session state pseudo-logic
  const getSessionState = (session) => {
    if (session.durationMinutes > 120) return { label: "Abandoned", class: "bg-rose-50 text-rose-700 border-rose-200 truncate", dot: "bg-rose-500" };
    if (!session.participant) return { label: "Waiting", class: "bg-amber-50 text-amber-700 border-amber-200 truncate", dot: "bg-amber-500 animate-pulse" };
    return { label: "Active", class: "bg-emerald-50 text-emerald-700 border-emerald-200 truncate", dot: "bg-emerald-500 animate-pulse" };
  };

  return (
    <div className="space-y-4">
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20 rounded-full animate-pulse" />
            <div className="relative w-10 h-10 border border-indigo-100 bg-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <div>
            <h3 className="text-slate-900 font-semibold">Live Operation Monitor</h3>
            <p className="text-slate-500 text-[13px] mt-0.5">Tracking {sessions?.length || 0} active collaborative rooms.</p>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 mt-3 sm:mt-0 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-600 hover:text-indigo-600 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium shadow-sm group"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          Force Sync
        </button>
      </div>

      {/* Clean Light-Theme Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-[13px] text-left whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Instance ID / State</th>
                <th className="px-5 py-3.5">Target Problem</th>
                <th className="px-5 py-3.5">Host / Founder</th>
                <th className="px-5 py-3.5">Participant</th>
                <th className="px-5 py-3.5">Telemetry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td className="px-5 py-4"><div className="h-6 w-24 bg-slate-100 rounded" /></td>
                     <td className="px-5 py-4">
                        <div className="space-y-2">
                           <div className="h-4 w-32 bg-slate-100 rounded" />
                           <div className="h-3 w-16 bg-slate-50 rounded" />
                        </div>
                     </td>
                     <td className="px-5 py-4"><div className="h-8 w-32 bg-slate-100 rounded-full" /></td>
                     <td className="px-5 py-4"><div className="h-8 w-32 bg-slate-100 rounded-full" /></td>
                     <td className="px-5 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : !sessions?.length ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Video className="w-8 h-8 text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium text-sm">No live sessions detected</p>
                      <p className="text-slate-400 text-[13px] mt-1">Platform is currently quiet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const state = getSessionState(session);
                  const diffClass = difficultyBadge[session.difficulty?.toLowerCase()] || difficultyBadge.easy;
                  
                  return (
                    <tr key={session._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-5 py-4 align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <code className="px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 font-mono text-xs border border-slate-200 whitespace-nowrap inline-block">
                            {session.roomId || session._id.slice(-8)}
                          </code>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] uppercase font-bold tracking-wider mt-1 ${state.class}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${state.dot}`} />
                            {state.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                         <div className="flex flex-col gap-1.5 items-start min-w-0 max-w-[200px]">
                           <span className="text-slate-900 font-semibold truncate w-full block" title={session.problem}>{session.problem}</span>
                           <div className="flex items-center gap-2">
                             <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${diffClass}`}>
                               {session.difficulty}
                             </span>
                             {session.visibility === "private" ? (
                               <Lock className="w-3 h-3 text-slate-400" title="Private Room" />
                             ) : (
                               <Globe className="w-3 h-3 text-slate-400" title="Public Room" />
                             )}
                           </div>
                         </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                         <div className="inline-flex items-center gap-2.5 p-1 pr-3 bg-white border border-slate-200 rounded-full shadow-sm max-w-full">
                           {session.host?.profileImage ? (
                             <img src={session.host.profileImage} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-100" />
                           ) : (
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-semibold shrink-0">
                               {session.host?.name?.[0]?.toUpperCase() || "?"}
                             </div>
                           )}
                           <span className="text-slate-700 text-xs font-semibold truncate">{session.host?.name || "Unknown"}</span>
                         </div>
                      </td>
                      <td className="px-5 py-4 align-middle">
                         {session.participant ? (
                           <div className="inline-flex items-center gap-2.5 p-1 pr-3 bg-white border border-slate-200 rounded-full shadow-sm max-w-full">
                           {session.participant.profileImage ? (
                             <img src={session.participant.profileImage} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-100" />
                           ) : (
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-semibold shrink-0">
                               {session.participant.name?.[0]?.toUpperCase() || "?"}
                             </div>
                           )}
                           <span className="text-slate-700 text-xs font-semibold truncate">{session.participant.name}</span>
                         </div>
                         ) : (
                            <span className="text-slate-400 text-xs italic flex items-center gap-1.5 font-medium">
                              <HelpCircle className="w-3.5 h-3.5" /> No participant yet
                            </span>
                         )}
                      </td>
                      <td className="px-5 py-4 align-middle">
                         <div className="flex flex-col gap-1 items-end">
                           <div className="flex items-center gap-1.5 text-slate-900">
                             <Clock className="w-3.5 h-3.5 text-slate-400" />
                             <span className="font-mono text-[12px] font-semibold">{session.durationMinutes}m</span>
                           </div>
                           <span className="text-slate-400 text-[11px] font-medium">
                             Started {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
                           </span>
                         </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
