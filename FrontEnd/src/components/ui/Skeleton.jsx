import React from "react";

/**
 * Shimmer skeleton primitive.
 * pill=true  → fully rounded (for text lines)
 * pill=false → slightly rounded rect (for cards/blocks)
 * circle=true → perfect circle (for avatars)
 */
export default function Skeleton({ width, height, className = "", pill = false, circle = false }) {
  const borderRadius = circle ? "9999px" : pill ? "9999px" : "6px";

  return (
    <>
      <style>{`
        @keyframes clyric-shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .clyric-skeleton {
          background: linear-gradient(90deg, #1c1c21 25%, #2c2c35 50%, #1c1c21 75%);
          background-size: 1200px 100%;
          animation: clyric-shimmer 1.6s infinite linear;
        }
      `}</style>
      <div
        className={`clyric-skeleton ${className}`}
        style={{
          width: width || "100%",
          height: height || "12px",
          borderRadius,
          flexShrink: 0,
        }}
      />
    </>
  );
}
