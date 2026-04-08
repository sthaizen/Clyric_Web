import React from "react";
import Skeleton from "../ui/Skeleton";

export default function ProblemsTableSkeleton({ rows = 15 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 70px 80px",
            padding: "12px",
            background: i % 2 !== 0 ? "#16161a" : "transparent",
            borderRadius: 6,
            alignItems: "center",
            gap: 8,
          }}
        >
          <Skeleton width="55%" height={12} pill />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton width={50} height={10} pill />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton width={40} height={10} pill />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton width={45} height={10} pill />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Skeleton width={50} height={10} pill />
          </div>
        </div>
      ))}
    </div>
  );
}
