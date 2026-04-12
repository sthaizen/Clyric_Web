import React from "react";
import { PenSquare, MessageSquarePlus } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMessengerContext } from "../../context/MessengerContext";
import { useRecommendedPeers } from "../../hooks/useRecommendedPeers";
import NewChatModal from "./NewChatModal";

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export default function ConversationList() {
  const { user } = useUser();
  const {
    conversations,
    convsLoading,
    openConversation,
    openChatWith,
    showNewChat,
    setShowNewChat,
  } = useMessengerContext();

  const { data: recommendedData, isLoading: peersLoading } = useRecommendedPeers();
  const eligiblePeers = recommendedData?.peers || [];

  // Filter peers that don't have an active conversation mapped yet
  const unstartedPeers = eligiblePeers.filter((peer) => {
    return !conversations.some((conv) => {
      return conv.participants?.some(
        (p) => p._id && p._id.toString() === peer.id?.toString()
      );
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      {/* List */}
      <div
        style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}
        className="messenger-scroll"
      >
        {convsLoading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
            <div
              style={{
                width: 24,
                height: 24,
                border: "2px solid #5044E5",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "messengerSpin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes messengerSpin{ to{transform:rotate(360deg)} }`}</style>
          </div>
        ) : (
          <>
            {/* 1. Active Conversations */}
            {conversations.map((conv) => {
            const myMongoId = user?.unsafeMetadata?.mongoId;
            const other = conv.participants?.find((p) => {
              if (p.clerkId && user?.id) return p.clerkId !== user.id;
              if (p._id && myMongoId) return p._id.toString() !== myMongoId;
              return false;
            }) || conv.participants?.[0];
            const name = other?.nickname || other?.name || "Unknown";
            const avatar = other?.profileImage || "";
            const isOnline = other?.isOnline || false;
            const unread = conv.unreadCount || 0;
            const lastMsg = conv.lastMessage || "";
            const time = formatRelativeTime(conv.lastMessageAt || conv.updatedAt);

            return (
              <button
                key={conv._id}
                onClick={() => openConversation(conv)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 18px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {/* Avatar */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name}
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#5044E5,#8a6bfe)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 17,
                        fontWeight: 700,
                        color: "#fff",
                      }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isOnline && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 2,
                        right: 2,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: "#22c55e",
                        border: "2px solid #1b1b1f",
                      }}
                    />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        color: unread > 0 ? "#fff" : "#d1d5db",
                        fontSize: 13.5,
                        fontWeight: unread > 0 ? 700 : 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 150,
                      }}
                    >
                      {name}
                    </span>
                    <span style={{ fontSize: 11, color: "#5a5a72", flexShrink: 0 }}>
                      {time}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontSize: 12.5,
                        color: unread > 0 ? "#a0a0b5" : "#6b7280",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 170,
                        fontWeight: unread > 0 ? 500 : 400,
                      }}
                    >
                      {lastMsg || "No messages yet"}
                    </span>
                    {unread > 0 && (
                      <span
                        style={{
                          background: "#5044E5",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 700,
                          borderRadius: 999,
                          minWidth: 18,
                          height: 18,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 5px",
                          flexShrink: 0,
                        }}
                      >
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

            {/* 2. Unstarted Peers (People you haven't texted yet) */}
            {unstartedPeers.length > 0 && (
              <>
                <div style={{ padding: "16px 18px 8px" }}>
                  <span style={{ fontSize: 11, color: "#5a5a72", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Other Connections
                  </span>
                </div>
                {unstartedPeers.map((peer) => (
                  <button
                    key={peer.id}
                    onClick={() => openChatWith(peer)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 18px", border: "none",
                      background: "transparent", cursor: "pointer", textAlign: "left",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {peer.avatar ? (
                        <img src={peer.avatar} alt={peer.name} style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }} />
                      ) : (
                        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#5044E5,#8a6bfe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff" }}>
                          {peer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {peer.isOnline && (
                        <div style={{ position: "absolute", bottom: 2, right: 2, width: 11, height: 11, borderRadius: "50%", background: "#22c55e", border: "2px solid #1b1b1f" }} />
                      )}
                    </div>
                    <div>
                      <div style={{ color: "#e2e2e8", fontSize: 13.5, fontWeight: 500 }}>{peer.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 12.5, marginTop: 1 }}>
                        Tap to start chatting
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Empty State Fallback */}
            {conversations.length === 0 && unstartedPeers.length === 0 && !peersLoading && (
              <div style={{ textAlign: "center", paddingTop: 40, color: "#6b7280", fontSize: 13, padding: "40px 20px 0" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#232329", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <PenSquare size={20} color="#5a5a72" />
                </div>
                No connected peers yet.<br/>
                <span style={{ fontSize: 12, marginTop: 4, display: "inline-block" }}>Complete an interview session to unlock messaging.</span>
              </div>
            )}
          </>
        )}
      </div>




      <style>{`
        .messenger-scroll::-webkit-scrollbar { width: 4px; }
        .messenger-scroll::-webkit-scrollbar-track { background: transparent; }
        .messenger-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        .messenger-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>
    </div>
  );
}
