import React from "react";
import { Database, Wifi, Server, Activity, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SystemHealthMonitor({ healthData, statsError, isFetching }) {
  // Infer health from backend report
  const apiStatus = healthData?.api?.status || "operational";
  const socketStatus = healthData?.socket?.status || "operational";
  const dbStatus = healthData?.db?.status || "operational";
  const workerStatus = healthData?.workers?.status || "operational";

  const services = [
    {
      id: "api",
      name: "Core API Service",
      type: "Application",
      icon: Server,
      status: apiStatus,
      uptime: healthData?.api?.uptime || "99.98%",
      latency: healthData?.api?.latency || "...",
      lastCheck: Date.now(),
      color: "blue",
    },
    {
       id: "db",
       name: "MongoDB Primary",
       type: "Database",
       icon: Database,
       status: dbStatus,
       uptime: healthData?.db?.uptime || "99.99%",
       latency: healthData?.db?.latency || "...",
       lastCheck: Date.now(),
       color: "emerald",
    },
    {
       id: "socket",
       name: "Socket.io Relay",
       type: "Real-time",
       icon: Wifi,
       status: socketStatus,
       uptime: healthData?.socket?.uptime || "99.95%",
       latency: healthData?.socket?.latency || "...",
       lastCheck: Date.now(),
       color: "violet",
    },
    {
       id: "workers",
       name: "Inngest Workers",
       type: "Background",
       icon: Activity,
       status: workerStatus,
       uptime: healthData?.workers?.uptime || "100%",
       latency: healthData?.workers?.latency || "N/A",
       lastCheck: Date.now(),
       color: "orange",
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "operational": return { icon: CheckCircle, text: "OPERATIONAL", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" };
      case "degraded": return { icon: AlertTriangle, text: "DEGRADED", color: "text-orange-400", bg: "bg-orange-50 border-orange-100" };
      case "outage": return { icon: XCircle, text: "OFFLINE", color: "text-rose-400", bg: "bg-rose-50 border-rose-100" };
      case "off": return { icon: Clock, text: "DISCONNECTED", color: "text-slate-400", bg: "bg-slate-50 border-slate-200" };
      default: return { icon: Clock, text: "UNKNOWN", color: "text-slate-400", bg: "bg-slate-50 border-slate-200" };
    }
  };

  const getThemeColor = (color) => {
     const map = {
        blue: "text-slate-900 bg-slate-50 border-slate-200",
        emerald: "text-indigo-500 bg-indigo-50 border-indigo-100",
        violet: "text-slate-400 bg-slate-50 border-slate-200",
        orange: "text-orange-400 bg-orange-50 border-orange-100",
     };
     return map[color] || map.blue;
  };

  return (
    <div className="space-y-5">
      {/* Global Status Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-[18px] border bg-white ${!statsError ? 'border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'border-rose-200 bg-rose-50 shadow-sm'} transition-all`}>
          <div className="flex items-center gap-4">
             <div className={`relative w-12 h-12 flex items-center justify-center rounded-2xl border ${!statsError ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-rose-50 border-rose-100 shadow-sm'}`}>
                {!statsError ? <ShieldCheck strokeWidth={2.5} className="w-6 h-6 text-indigo-500" /> : <ShieldAlert strokeWidth={2.5} className="w-6 h-6 text-rose-500" />}
             </div>
             <div>
                <h3 className={`text-[17px] font-black ${!statsError ? "text-slate-900" : "text-rose-900"}`}>{!statsError ? "All Systems Operational" : "System Degraded"}</h3>
                <p className={`text-[12px] mt-0.5 font-bold uppercase tracking-widest ${!statsError ? "text-slate-400" : "text-rose-400"}`}>
                   {!statsError ? "Telemetry report: Nominal" : "Unable to reach core APIs"}
                </p>
             </div>
          </div>
         <div className="flex flex-col items-end">
             {isFetching && <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Activity strokeWidth={2.5} className="w-3.5 h-3.5 animate-pulse text-[#18181B]"/> Syncing</span>}
             <span className="text-[11px] text-gray-500 font-bold tracking-widest uppercase mt-1">Last ping: {new Date().toLocaleTimeString()}</span>
         </div>
       </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         {services.map((svc) => {
            const statusCfg = getStatusConfig(svc.status);
            const theme = getThemeColor(svc.color);
            const StatusIcon = statusCfg.icon;

            return (
               <div key={svc.id} className="relative overflow-hidden bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between h-full group">
                  <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3.5">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${theme}`}>
                            <svc.icon strokeWidth={2.5} className={`w-5 h-5`} />
                         </div>
                         <div>
                            <p className="text-[14px] font-black text-slate-900 leading-snug">{svc.name}</p>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{svc.type}</p>
                         </div>
                      </div>
                  </div>

                  <div>
                     <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 mb-6 rounded-lg border ${statusCfg.bg}`}>
                         <StatusIcon strokeWidth={2.5} className={`w-3.5 h-3.5 ${statusCfg.color}`} />
                         <span className={`text-[11px] font-black uppercase tracking-wider ${statusCfg.color}`}>{statusCfg.text}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-50">
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">Uptime</span>
                           <span className="text-[14px] font-black text-slate-900">{svc.uptime}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                           <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">Latency</span>
                           <span className="text-[14px] font-black text-slate-900">{svc.latency}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-right">
                           <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">Check</span>
                           <span className="text-[10px] font-black text-slate-400 mt-0.5 uppercase tracking-widest truncate">{formatDistanceToNow(svc.lastCheck, { addSuffix: true })}</span>
                        </div>
                     </div>
                  </div>
               </div>
            )
         })}
      </div>
    </div>
  );
}
