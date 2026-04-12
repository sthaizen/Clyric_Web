import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div
        style={{
          background: "#232329",
          borderRadius: "18px 18px 18px 4px",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#6d6d85",
              display: "inline-block",
              animation: `messengerBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes messengerBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
