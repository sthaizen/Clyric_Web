import React, { useEffect } from "react";
import { Calendar, Bell, RefreshCw, Zap, Info, AlertTriangle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../lib/axios";
import { socket } from "../../lib/socket";

const UpcomingEvents = () => {
   const { data, isLoading, error } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const res = await axiosInstance.get('/dashboard/notifications');
      return res.data;
    },
    refetchInterval: 60000 // Poll every minute
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    // Ensure socket is connected for live broadcasts
    if (!socket.connected) {
      socket.connect();
    }

    const handleNewNotification = (notif) => {
      queryClient.setQueryData(['upcoming-events'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          // Prepend new notification, avoiding duplicates
          notifications: [notif, ...oldData.notifications.filter(n => n._id !== notif._id)].slice(0, 10)
        };
      });
    };

    const handleDeleteNotification = (id) => {
      queryClient.setQueryData(['upcoming-events'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          notifications: oldData.notifications.filter(n => n._id !== id)
        };
      });
    };

    socket.on("new-notification", handleNewNotification);
    socket.on("delete-notification", handleDeleteNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
      socket.off("delete-notification", handleDeleteNotification);
    };
  }, [queryClient]);

  const getIconProps = (type, iconName) => {
    let IconComp = Bell; // default
    if (iconName === 'Zap') IconComp = Zap;
    if (iconName === 'Info') IconComp = Info;
    if (iconName === 'Calendar') IconComp = Calendar;
    if (iconName === 'AlertTriangle') IconComp = AlertTriangle;

    switch (type) {
      case 'event': return { IconComp, iconBg: "bg-purple-900/20", iconColor: "text-purple-400" };
      case 'warning': return { IconComp, iconBg: "bg-amber-900/20", iconColor: "text-amber-400" };
      case 'success': return { IconComp, iconBg: "bg-emerald-900/20", iconColor: "text-emerald-400" };
      case 'info':
      default: return { IconComp, iconBg: "bg-blue-900/20", iconColor: "text-blue-400" };
    }
  };

  const events = data?.notifications || [];

  return (
   <div className="w-full h-full bg-[#16161a] rounded-2xl p-6 border border-white/[0.03] flex flex-col">
      <h2 className="text-[20px] text-white font-semibold mb-6 tracking-tight">
        Upcoming Events & Alerts
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-3 flex-grow animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#1c1c21] rounded-2xl p-4 h-[72px] border border-white/[0.05]"></div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col gap-3 flex-grow items-center justify-center text-gray-500">
           <Bell className="w-8 h-8 opacity-20 mb-2" />
           <p className="text-[13px] font-medium">No new alerts at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 flex-grow overflow-y-auto transparent-scrollbar max-h-[260px] pr-1">
          {events.map((event) => {
            const { IconComp, iconBg, iconColor } = getIconProps(event.type, event.icon);
            return (
              <div
                key={event._id}
                className="bg-[#1c1c21] rounded-2xl p-4 flex items-center gap-4 border border-white/[0.05] transition-all hover:bg-[#232329]"
              >
                <div className={`shrink-0 p-3 rounded-xl ${iconBg} ${iconColor}`}>
                  <IconComp size={20} strokeWidth={2.5} />
                </div>

                <div className="flex flex-col">
                  <p className="text-[14px] text-gray-300 leading-snug">
                    <span className="text-white font-medium">{event.title} </span>
                  </p>
                  <p className="text-[12px] text-gray-400 mt-0.5 max-w-[220px] truncate">
                    {event.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;