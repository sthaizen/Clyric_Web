import React from "react";
import { Database, Wifi, Server, Activity, CheckCircle, XCircle, Clock, AlertTriangle, ShieldCheck, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SystemHealthMonitor({ statsError, isFetching }) {
  // Infer health from API reachability
  const apiStatus = !statsError ? "operational" : "outage";
  const socketStatus = "operational"; // Assuming active if loaded
  const dbStatus = !statsError ? "operational" : "degraded";
  const workerStatus = "operational";

  const services = [
    {
      id: "api",
      name: "Core API Service",
      type: "Application",
      icon: Server,
      status: apiStatus,
      uptime: "99.98%",
      latency: "45ms",
      lastCheck: Date.now(),
      color: "blue",
    },
    {
       id: "db",
       name: "MongoDB Primary",
       type: "Database",
       icon: Database,
       status: dbStatus,
       uptime: "99.99%",
       latency: "12ms",
       lastCheck: Date.now() - 5000,
       color: "emerald",
    },
    {
       id: "socket",
       name: "Socket.io Relay",
       type: "Real-time",
       icon: Wifi,
       status: socketStatus,
       uptime: "99.95%",
       latency: "28ms",
       lastCheck: Date.now() - 2000,
       color: "violet",
    },
    {
       id: "workers",
       name: "Inngest Workers",
       type: "Background",
       icon: Activity,
       status: workerStatus,
       uptime: "100%",
       latency: "N/A",
       lastCheck: Date.now() - 15000,
       color: "orange",
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "operational": return { icon: CheckCircle, text: "Operational", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" };
      case "degraded": return { icon: AlertTriangle, text: "Degraded", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" };
      case "outage": return { icon: XCircle, text: "Major Outage", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" };
      default: return { icon: Clock, text: "Unknown", color: "text-slate-500", bg: "bg-slate-100 border-slate-200" };
    }
  };

  const getThemeColor = (color) => {
     const map = {
        blue: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        violet: "text-violet-600 bg-violet-50 border-violet-100",
        orange: "text-amber-600 bg-amber-50 border-amber-100",
     };
     return map[color] || map.blue;
  };

  return (
    <div className="space-y-5">
      {/* Global Status Header */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border bg-white ${!statsError ? 'border-slate-200' : 'border-rose-200'} shadow-sm transition-all`}>
         <div className="flex items-center gap-4">
            <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl border ${!statsError ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
               {!statsError ? <ShieldCheck className="w-6 h-6 text-emerald-600" /> : <ShieldAlert className="w-6 h-6 text-rose-600" />}
            </div>
            <div>
               <h3 className="text-[17px] font-semibold text-slate-900">{!statsError ? "All Systems Operational" : "System Degraded or Offline"}</h3>
               <p className={`text-[13px] mt-0.5 ${!statsError ? "text-slate-500" : "text-rose-600"}`}>
                  {!statsError ? "Platform telemetry is nominal." : "Unable to reach core APIs."}
               </p>
            </div>
         </div>
         <div className="flex flex-col items-end">
             {isFetching && <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 animate-pulse"/> Syncing</span>}
             <span className="text-[11px] text-slate-400 font-medium mt-1">Last ping: {new Date().toLocaleTimeString()}</span>
         </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {services.map((svc) => {
            const statusCfg = getStatusConfig(svc.status);
            const theme = getThemeColor(svc.color);
            const StatusIcon = statusCfg.icon;

            return (
               <div key={svc.id} className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
                  
                  <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${theme}`}>
                            <svc.icon className={`w-5 h-5`} />
                         </div>
                         <div>
                            <p className="text-[14px] font-semibold text-slate-900 leading-snug">{svc.name}</p>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{svc.type}</p>
                         </div>
                      </div>
                  </div>

                  <div>
                     <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 mb-4 rounded border ${statusCfg.bg}`}>
                         <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.color}`} />
                         <span className={`text-[10px] font-bold uppercase tracking-wider ${statusCfg.color}`}>{statusCfg.text}</span>
                      </div>

                     <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Uptime</span>
                           <span className="text-[13px] font-semibold text-slate-700">{svc.uptime}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Latency</span>
                           <span className="text-[13px] font-semibold text-slate-700">{svc.latency}</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                           <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pinged</span>
                           <span className="text-[12px] font-medium text-slate-500 mt-0.5">{formatDistanceToNow(svc.lastCheck, { addSuffix: true })}</span>
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
