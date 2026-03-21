import React from "react";
import { Calendar, Bell, RefreshCw } from "lucide-react";

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Contest: Weekly Code-Off",
      subtitle: "#42 starts in",
      highlight: "2h",
      icon: Calendar,
      iconBg: "bg-purple-900/20",
      iconColor: "text-purple-400",
    },
    {
      id: 2,
      title: "New Skill Pathway:",
      subtitle: '"Intro to ML"',
      highlight: "available",
      icon: Bell,
      iconBg: "bg-amber-900/20",
      iconColor: "text-amber-400",
    },
    {
      id: 3,
      title: "Scheduled Platform",
      subtitle: "Maintenance:",
      highlight: "March 24",
      icon: RefreshCw,
      iconBg: "bg-blue-900/20",
      iconColor: "text-blue-400",
    },
  ];

  return (
   <div className="w-full h-full bg-[#16161a] rounded-2xl p-6 border border-white/[0.03] flex flex-col">
      <h2 className="text-[20px] text-white font-semibold mb-6 tracking-tight">
        Upcoming Events & Alerts
      </h2>

      {/* flex-grow ensures this container takes up remaining space */}
      <div className="flex flex-col gap-3 flex-grow">
        {events.map((event) => {
          const IconComponent = event.icon;
          return (
            <div
              key={event.id}
              className="bg-[#1c1c21] rounded-2xl p-4 flex items-center gap-4 border border-white/[0.05] transition-all hover:bg-[#232329]"
            >
              <div className={`shrink-0 p-3 rounded-xl ${event.iconBg} ${event.iconColor}`}>
                <IconComponent size={20} strokeWidth={2.5} />
              </div>

              <div className="flex flex-col">
                <p className="text-[14px] text-gray-300 leading-snug">
                  <span className="text-white font-medium">{event.title} </span>
                  <span className="text-gray-400">{event.subtitle} </span>
                  <span className={event.id === 1 ? "text-purple-400 font-semibold" : "text-white font-medium"}>
                    {event.highlight}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;