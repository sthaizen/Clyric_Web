import React from "react";
import { Hexagon } from "lucide-react";

export default function BadgesCard() {
  return (
    <div className="bg-[#1b1b1f] border border-[#231c2f] rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col min-h-[160px] justify-between">
      {/* Top Section */}
      <div className="relative z-10">
        <h3 className="text-gray-400 text-xs font-medium mb-1">Badges</h3>
        <p className="text-3xl font-bold text-white">0</p>
      </div>

      {/* Faded Background Icon (Matching the screenshot's right-side aesthetic) */}
      <div className="absolute right-[-10px] top-8 opacity-5 text-gray-500">
        <Hexagon size={120} strokeWidth={1} />
      </div>
      {/* Inner visual for the badge */}
      <div className="absolute right-[22px] top-[64px] opacity-10 flex flex-col items-center">
         <span className="text-[10px] font-bold">3</span>
         <span className="text-[8px]">MAR</span>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 mt-6">
        <p className="text-gray-500 text-xs mb-1">Locked Badge</p>
        <p className="text-gray-200 text-sm font-medium"></p>
      </div>
    </div>
  );
}