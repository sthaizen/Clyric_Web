import React, { useState, useMemo } from "react";
import { Search, X, MessageSquarePlus } from "lucide-react";
import { useRecommendedPeers } from "../../hooks/useRecommendedPeers";
import { useMessengerContext } from "../../context/MessengerContext";

export default function NewChatModal({ onClose }) {
  const { openChatWith } = useMessengerContext();
  const [search, setSearch] = useState("");

  const { data: recommendedData, isLoading: loading } = useRecommendedPeers();
  const peers = recommendedData?.peers || [];

  const filtered = useMemo(
    () =>
      peers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [peers, search]
  );

  const handleSelect = async (peer) => {
    onClose();
    await openChatWith(peer);
  };

  return (
    /* Backdrop */
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        background: "rgba(10,10,15,0.7)",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 18px 12px",
          borderBottom: "1px solid #2c2c35",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MessageSquarePlus size={16} color="#8a6bfe" />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
            New Message
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 4,
            borderRadius: 6,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 18px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#232329",
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Search size={13} color="#6b7280" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search co-interviewers..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#d1d5db",
              fontSize: 13,
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Subtitle */}
      <div style={{ padding: "0 18px 8px", flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: "#5a5a72", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Shared Interview Partners
        </span>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 12px" }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 30 }}>
            <div
              style={{
                width: 22,
                height: 22,
                border: "2px solid #5044E5",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin{ to{transform:rotate(360deg)} }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              paddingTop: 30,
              color: "#6b7280",
              fontSize: 13,
            }}
          >
            {peers.length === 0
              ? "Complete an interview session to unlock messaging."
              : "No results found."}
          </div>
        ) : (
          filtered.map((peer) => (
            <button
              key={peer.id}
              onClick={() => handleSelect(peer)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 8px",
                borderRadius: 10,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "background 0.15s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                {peer.avatar ? (
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "linear-gradient(135deg,#5044E5,#8a6bfe)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 700, color: "#fff",
                    }}
                  >
                    {peer.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {peer.isOnline && (
                  <div
                    style={{
                      position: "absolute", bottom: 1, right: 1,
                      width: 10, height: 10, borderRadius: "50%",
                      background: "#22c55e", border: "2px solid #1b1b1f",
                    }}
                  />
                )}
              </div>
              <div>
                <div style={{ color: "#e2e2e8", fontSize: 13.5, fontWeight: 600 }}>
                  {peer.name}
                </div>
                <div style={{ color: "#6b7280", fontSize: 11.5, marginTop: 1 }}>
                  {peer.isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
