import React from "react";
import Skeleton from "../ui/Skeleton";

export default function RecentSessionsSkeleton() {
  return (
    <div className="flex flex-col gap-3 flex-grow min-h-[150px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Skeleton width={36} height={36} circle />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton width="35%" height={12} pill />
          <Skeleton width="55%" height={10} pill />
        </div>
      </div>
      {/* 3 row placeholders */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-[#2c2c35]">
          <Skeleton width={32} height={32} circle />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton width="60%" height={12} pill />
            <Skeleton width="40%" height={10} pill />
          </div>
          <Skeleton width={60} height={22} />
        </div>
      ))}
    </div>
  );
}
