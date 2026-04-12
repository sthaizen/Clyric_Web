import React from "react";

/**
 * Single message bubble.
 * isMine = message sent by the current user (right-aligned, accent color)
 * otherwise = left-aligned, dark muted bubble
 */
export default function MessageBubble({ message, isMine }) {
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const senderName =
    message.sender?.nickname || message.sender?.name || "Unknown";
  const avatarSrc = message.sender?.profileImage || "";
  const avatarInitial = senderName.charAt(0).toUpperCase();

  if (isMine) {
    return (
      <div className="flex justify-end mb-1">
        <div className="flex flex-col items-end max-w-[72%]">
          <div
            style={{
              background: "linear-gradient(135deg, #6d5cf7 0%, #5044E5 100%)",
              borderRadius: "18px 18px 4px 18px",
              padding: "9px 14px",
              color: "#fff",
              fontSize: 13.5,
              lineHeight: "1.45",
              wordBreak: "break-word",
              boxShadow: "0 2px 8px rgba(80,68,229,0.25)",
            }}
          >
            {message.content}
          </div>
          <span
            style={{ fontSize: 10, color: "#5a5a72", marginTop: 3, paddingRight: 2 }}
          >
            {time}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-1">
      {/* Avatar */}
      <div className="shrink-0 mb-4">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={senderName}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        ) : (
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "#3b3264",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#a78bfa",
            }}
          >
            {avatarInitial}
          </div>
        )}
      </div>

      <div className="flex flex-col items-start max-w-[72%]">
        <div
          style={{
            background: "#232329",
            borderRadius: "18px 18px 18px 4px",
            padding: "9px 14px",
            color: "#e2e2e8",
            fontSize: 13.5,
            lineHeight: "1.45",
            wordBreak: "break-word",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {message.content}
        </div>
        <span style={{ fontSize: 10, color: "#5a5a72", marginTop: 3, paddingLeft: 2 }}>
          {time}
        </span>
      </div>
    </div>
  );
}
