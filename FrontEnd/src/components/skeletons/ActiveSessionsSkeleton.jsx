import React from "react";
import Skeleton from "../ui/Skeleton";

export default function ActiveSessionsSkeleton() {
  return (
    <div className="bg-[#16161a] border border-[#231c2f] rounded-xl shadow-sm p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Skeleton width={36} height={36} circle />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton width="40%" height={12} pill />
          <Skeleton width="60%" height={10} pill />
        </div>
      </div>
      {/* 3 session card placeholders */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-[#1c1c21] rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton width="50%" height={12} pill />
            <Skeleton width={60} height={20} />
          </div>
          <div className="flex gap-2">
            <Skeleton width={70} height={10} pill />
            <Skeleton width={80} height={10} pill />
          </div>
          <Skeleton width="100%" height={36} />
        </div>
      ))}
    </div>
  );
}
