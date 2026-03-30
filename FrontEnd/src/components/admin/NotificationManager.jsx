import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../../api/admin";
import toast from "react-hot-toast";
import { 
  Bell, Zap, Info, Calendar, AlertTriangle, MessageSquare, 
  Trash2, Plus, Clock, Server, FileText
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function NotificationManager() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
    icon: "Bell",
    isActive: true
  });

  // Fetch active notifications
  const { data, isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: adminApi.getNotifications
  });

  const notifications = data?.notifications || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: adminApi.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-notifications']);
      toast.success("Broadcast sent successfully!");
      setFormData({ title: "", message: "", type: "info", icon: "Bell", isActive: true });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to send broadcast");
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-notifications']);
      toast.success("Broadcast removed");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      toast.error("Title and message are required");
      return;
    }
    createMutation.mutate(formData);
  };

  const getIconProps = (type, iconName) => {
    let IconComp = Bell;
    if (iconName === 'Zap') IconComp = Zap;
    if (iconName === 'Info') IconComp = Info;
    if (iconName === 'Calendar') IconComp = Calendar;
    if (iconName === 'AlertTriangle') IconComp = AlertTriangle;

    switch (type) {
      case 'event': return { IconComp, bg: "bg-purple-50", color: "text-purple-600", border: "border-purple-200" };
      case 'warning': return { IconComp, bg: "bg-amber-50", color: "text-amber-600", border: "border-amber-200" };
      case 'success': return { IconComp, bg: "bg-emerald-50", color: "text-emerald-600", border: "border-emerald-200" };
      case 'info':
      default: return { IconComp, bg: "bg-blue-50", color: "text-blue-600", border: "border-blue-200" };
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Composer Form */}
        <div className="lg:col-span-1 border border-slate-200/60 rounded-[20px] shadow-sm bg-white overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Plus strokeWidth={2.5} className="w-4 h-4 text-orange-500" />
              New Broadcast
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Title</label>
              <input 
                type="text" 
                placeholder="e.g. Scheduled Maintenance" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Message</label>
              <textarea 
                placeholder="Details about the event..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all min-h-[100px] resize-y"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Type</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full appearance-none px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:outline-none focus:border-slate-300"
                  >
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="success">Success (Green)</option>
                    <option value="event">Event (Purple)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">Icon</label>
                <div className="relative">
                  <select 
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="w-full appearance-none px-3 py-2 pr-8 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-bold text-slate-700 focus:outline-none focus:border-slate-300"
                  >
                    <option value="Bell">Bell</option>
                    <option value="Zap">Zap (Flash)</option>
                    <option value="Info">Info (Circle)</option>
                    <option value="Calendar">Calendar</option>
                    <option value="AlertTriangle">Alert (Triangle)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={createMutation.isLoading}
              className="w-full mt-2 py-2.5 bg-slate-900 border border-slate-900 rounded-xl text-[14px] font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
            >
              {createMutation.isLoading ? "Sending..." : "Publish Broadcast"}
            </button>
          </form>
        </div>

        {/* Live Active Feed */}
        <div className="lg:col-span-2 border border-slate-200/60 rounded-[20px] shadow-sm bg-white overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-[15px] font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Server strokeWidth={2.5} className="w-4 h-4 text-emerald-500" />
              Live Active Broadcasts
            </h3>
            <span className="text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-sm">
              {notifications.length} Active
            </span>
          </div>

          <div className="p-2 flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 flex justify-center text-slate-400">Loading broadcasts...</div>
            ) : notifications.length === 0 ? (
              <div className="p-10 flex flex-col items-center justify-center text-slate-400 h-full gap-3">
                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <Bell strokeWidth={1} className="w-6 h-6 text-slate-300" />
                 </div>
                 <p className="text-[14px] font-medium text-center max-w-xs">No active global broadcasts. Create one to inform your users.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => {
                  const props = getIconProps(notif.type, notif.icon);
                  const IconComp = props.IconComp;
                  return (
                    <div key={notif._id} className={`group p-4 bg-white border ${props.border} rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-4 relative overflow-hidden`}>
                      <div className={`w-2 absolute left-0 top-0 bottom-0 ${props.bg.replace('50', '500')}`} />
                      
                      <div className={`w-10 h-10 shrink-0 rounded-xl ${props.bg} flex items-center justify-center border ${props.border}`}>
                        <IconComp strokeWidth={2.5} className={`w-5 h-5 ${props.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start pr-8">
                          <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{notif.title}</h4>
                          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-slate-500 mt-1 max-w-xl">{notif.message}</p>
                      </div>

                      <button 
                        onClick={() => {
                          if (window.confirm("Remove this broadcast from all user dashboards?")) {
                            deleteMutation.mutate(notif._id);
                          }
                        }}
                        disabled={deleteMutation.isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="End Broadcast"
                      >
                        <Trash2 strokeWidth={2} className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
