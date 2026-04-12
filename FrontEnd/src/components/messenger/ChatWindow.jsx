import React, { useRef, useEffect, useState, useCallback } from "react";
import { ArrowLeft, X, Smile, Mic, Image, Send } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useChat } from "../../hooks/useChat";
import { useMessengerContext } from "../../context/MessengerContext";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ conversation, onBack, onClose }) {
  const { user } = useUser();
  const { messages, isLoading, isSending, isOtherTyping, hasMore, sendMessage, handleTyping, loadOlderMessages } =
    useChat(conversation?._id);

  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  // Determine the "other" participant
  const other =
    conversation?.participants?.find((p) => {
      return p.clerkId !== user?.id;
    }) || conversation?.participants?.[0];

  const otherName = other?.nickname || other?.name || "Unknown";
  const otherAvatar = other?.profileImage || "";
  const isOtherOnline = other?.isOnline || false;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOtherTyping]);

  // Infinite scroll — load older messages at top
  const handleScroll = useCallback(() => {
    if (!messagesRef.current) return;
    if (messagesRef.current.scrollTop === 0 && hasMore && !isLoading) {
      loadOlderMessages();
    }
  }, [hasMore, isLoading, loadOlderMessages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const val = inputValue;
    setInputValue("");
    await sendMessage(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
    handleTyping();
  };

  // Determine isMine for each message
  const getIsMine = (msg) => {
    const senderClerkId = msg.sender?.clerkId;
    if (senderClerkId && user?.id) {
      return senderClerkId === user.id;
    }
    // Fallback: compare Mongo ID if clerkId mapping is missing
    const senderMongoId = msg.sender?._id?.toString?.() || msg.sender?._id || msg.sender;
    const myMongoId = user?.unsafeMetadata?.mongoId;
    return myMongoId ? senderMongoId === myMongoId : false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: 4,
            borderRadius: 6,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          <ArrowLeft size={16} />
        </button>

        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {otherAvatar ? (
            <img
              src={otherAvatar}
              alt={otherName}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          ) : (
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#5044E5,#8a6bfe)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {otherName.charAt(0).toUpperCase()}
            </div>
          )}
          {isOtherOnline && (
            <div
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid #1b1b1f",
              }}
            />
          )}
        </div>

        {/* Name and status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: "#fff", fontSize: 13.5, fontWeight: 600, lineHeight: 1.2 }}>
            {otherName}
          </div>
          <div style={{ fontSize: 11, color: isOtherOnline ? "#22c55e" : "#6b7280", marginTop: 1 }}>
            {isOtherOnline ? "Online" : "Offline"}
          </div>
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
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Messages Area ──────────────────────────────────────────────────── */}
      <div
        ref={messagesRef}
        onScroll={handleScroll}
        className="messenger-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Load more trigger */}
        {hasMore && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <button
              onClick={loadOlderMessages}
              style={{
                fontSize: 11.5,
                color: "#8a6bfe",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Load older messages
            </button>
          </div>
        )}

        {isLoading && messages.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                width: 22,
                height: 22,
                border: "2px solid #5044E5",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "messengerSpin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes messengerSpin{ to{transform:rotate(360deg)} }`}</style>
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: 13,
              textAlign: "center",
              padding: "0 20px",
            }}
          >
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={getIsMine(msg)}
            />
          ))
        )}

        {isOtherTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Input Bar ──────────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "10px 12px 12px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#232329",
            borderRadius: 24,
            padding: "6px 12px",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e2e8",
              fontSize: 13.5,
              fontFamily: "Manrope, sans-serif",
              padding: "4px 8px"
            }}
          />

          {inputValue.trim() && (
            <button
              onClick={handleSend}
              disabled={isSending}
              style={{
                background: "linear-gradient(135deg,#6d5cf7,#5044E5)",
                border: "none",
                borderRadius: "50%",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                transition: "opacity 0.15s",
                opacity: isSending ? 0.6 : 1,
              }}
            >
              <Send size={13} color="#fff" />
            </button>
          )}
        </div>
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
