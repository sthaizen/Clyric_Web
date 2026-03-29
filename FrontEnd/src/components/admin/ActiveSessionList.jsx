import React from "react";
import { Video, Clock, RefreshCw, Users, HelpCircle, Activity, Globe, Lock, ShieldAlert, MonitorPlay, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const difficultyBadge = {
  easy: "bg-indigo-50 text-indigo-500 border-indigo-100",
  medium: "bg-orange-50 text-orange-400 border-orange-100",
  hard: "bg-rose-50 text-rose-400 border-rose-100",
};

export default function ActiveSessionList({ globalStats, sessions, isLoading, onRefresh }) {
  // Determine session state pseudo-logic
  const getSessionState = (session) => {
    if (session.durationMinutes > 120) return { label: "CRITICAL", class: "bg-rose-50 text-rose-500 border-rose-100", dot: "bg-rose-500" };
    if (!session.participant) return { label: "WAITING", class: "bg-orange-50 text-orange-500 border-orange-100", dot: "bg-orange-400" };
    return { label: "ACTIVE", class: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
  };

  const formatElapsed = (minutes) => {
    if (!minutes) return "0m";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      
      {/* Analytics Header Section (Exact Match KPI Row) */}
      <div className="grid grid-cols-4 gap-6 mb-8 px-1">
         <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[13px] font-bold text-slate-400 mb-4 block">Active Sessions</span>
            <div className="flex flex-col">
               <span className="text-[32px] font-bold text-slate-900 leading-tight">{sessions?.length || 0}</span>
               <div className="flex items-center gap-1 mt-2">
                  <span className="text-[11px] font-bold text-slate-300">vs peak</span>
                  <span className="text-[11px] font-bold text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                     <Plus className="w-2.5 h-2.5" /> 2 sessions
                  </span>
               </div>
            </div>
         </div>

         <div className="bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[13px] font-bold text-slate-400 mb-4 block">Total Users</span>
            <div className="flex flex-col">
               <span className="text-[32px] font-bold text-slate-900 leading-tight">
                 {sessions?.reduce((acc, s) => acc + (s.participant ? 2 : 1), 0) || 0}
               </span>
               <div className="flex items-center gap-1 mt-2">
                  <span className="text-[11px] font-bold text-slate-300">vs last hour</span>
                  <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                     <Plus className="w-2.5 h-2.5" /> 12%
                  </span>
               </div>
            </div>
         </div>

         <div className="col-span-2 bg-white border border-slate-200/40 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <span className="text-[13px] font-bold text-slate-400 mb-4 block uppercase tracking-widest">Global Status</span>
            <div className="flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="text-[24px] font-bold text-slate-900 leading-tight">Operational</span>
                  <div className="flex items-center gap-2 mt-1">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[11px] font-bold text-emerald-500 uppercase">Live Sync Active</span>
                  </div>
               </div>
               <button 
                 onClick={onRefresh}
                 className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-white transition-all group"
               >
                  <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
               </button>
            </div>
         </div>
      </div>

      {/* Redesigned Table */}
      <div className="overflow-hidden border border-slate-200/60 bg-white rounded-2xl shadow-sm pb-1 mb-6">
        <div className="overflow-x-auto transparent-scrollbar">
          <table className="w-full text-[14px] text-left whitespace-nowrap">
            <thead className="border-b border-slate-100 bg-slate-50/30 text-slate-400 font-bold text-[13px]">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Session Key</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Problem Context</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Host</th>
                <th className="px-4 py-4 font-semibold uppercase tracking-wider">Participant</th>
                <th className="px-6 py-4 text-right">Elapsed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                     <td className="px-5 py-4"><div className="h-6 w-24 bg-gray-100 rounded" /></td>
                     <td className="px-5 py-4">
                        <div className="space-y-2">
                           <div className="h-4 w-32 bg-gray-200 rounded" />
                           <div className="h-3 w-16 bg-gray-100 rounded" />
                        </div>
                     </td>
                     <td className="px-5 py-4"><div className="h-8 w-32 bg-gray-100 rounded-full" /></td>
                     <td className="px-5 py-4"><div className="h-8 w-32 bg-gray-100 rounded-full" /></td>
                     <td className="px-5 py-4 flex justify-end"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
                  </tr>
                ))
              ) : !sessions?.length ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Video strokeWidth={2} className="w-8 h-8 text-gray-300 mb-3" />
                      <p className="text-gray-500 font-bold text-sm">No live sessions detected</p>
                      <p className="text-gray-400 font-bold text-[13px] mt-1 uppercase tracking-widest">Platform is currently quiet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((session) => {
                  const state = getSessionState(session);
                  const diffClass = difficultyBadge[session.difficulty?.toLowerCase()] || difficultyBadge.easy;
                  
                  return (
                    <tr key={session._id} className="group border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                      <td className="px-6 py-4 align-middle">
                        <div className="flex flex-col items-start gap-1">
                          <code className="text-slate-400 font-black text-[12px] tracking-widest uppercase">
                            {session.roomId || session._id.slice(-8)}
                          </code>
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider border ${state.class}`}>
                            {state.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col min-w-0">
                           <span className="font-black text-slate-900 leading-tight">{session.problem}</span>
                           <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${diffClass}`}>
                                {session.difficulty}
                              </span>
                              {session.visibility === "private" ? <Lock className="w-3 h-3 text-slate-300" /> : <Globe className="w-3 h-3 text-slate-300" />}
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                           {session.host?.profileImage ? (
                              <img src={session.host.profileImage} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                           ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 uppercase">
                                 {session.host?.name?.[0]}
                              </div>
                           )}
                           <span className="font-bold text-slate-900 text-[13px]">{session.host?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        {session.participant ? (
                           <div className="flex items-center gap-2">
                              {session.participant.profileImage ? (
                                 <img src={session.participant.profileImage} alt="" className="w-7 h-7 rounded-full border border-slate-200" />
                              ) : (
                                 <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-600 uppercase">
                                    {session.participant.name?.[0]}
                                 </div>
                              )}
                              <span className="font-bold text-slate-900 text-[13px]">{session.participant.name}</span>
                           </div>
                        ) : (
                           <span className="text-slate-300 text-[11px] font-black uppercase tracking-widest">Waiting Instance</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-middle text-right">
                         <div className="flex flex-col gap-0.5">
                            <span className="font-black text-slate-900 leading-tight text-[14px]">
                              {formatElapsed(session.durationMinutes)}
                            </span>
                            <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                               {session.startedAt ? formatDistanceToNow(new Date(session.startedAt), { addSuffix: true }) : "Just started"}
                            </span>
                         </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
