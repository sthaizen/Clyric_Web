import React, { useEffect, useRef } from "react";
import { X, Maximize2 } from "lucide-react";
import { useMessengerContext } from "../../context/MessengerContext";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";

export default function MessengerPanel() {
  const {
    isOpen,
    view,
    activeConversation,
    closePanel,
    goBackToList,
  } = useMessengerContext();

  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        // Don't close when clicking trigger (it toggles itself)
        const trigger = document.getElementById("messenger-trigger");
        if (trigger && trigger.contains(e.target)) return;
        closePanel();
      }
    };
    // Small delay so the opening click doesn't immediately close
    const t = setTimeout(() => document.addEventListener("mousedown", handleClick), 150);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, closePanel]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        bottom: 80,
        right: 24,
        width: 360,
        height: 520,
        zIndex: 9999,
        pointerEvents: isOpen ? "all" : "none",
        transform: isOpen ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
        opacity: isOpen ? 1 : 0,
        transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease",
        transformOrigin: "bottom right",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1b1b1f",
          border: "1px solid #2c2c35",
          borderRadius: 16,
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.55), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Panel Header ─────────────────────────────────────────────────── */}
        {view === "list" && (
          <div
            style={{
              padding: "14px 18px 12px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.3px",
              }}
            >
              Messages
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

              <button
                onClick={closePanel}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: 6,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.15s, background 0.15s",
                }}
                title="Close"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6b7280";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          {view === "list" ? (
            <ConversationList />
          ) : (
            <ChatWindow
              conversation={activeConversation}
              onBack={goBackToList}
              onClose={closePanel}
            />
          )}
        </div>
      </div>
    </div>
  );
}
