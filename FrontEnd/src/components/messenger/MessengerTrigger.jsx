import { Send } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMessengerContext } from "../../context/MessengerContext";

export default function MessengerTrigger() {
  const { user } = useUser();
  const { isOpen, setIsOpen, conversations, unreadTotal } = useMessengerContext();

  const myClerkId = user?.id;
  const myMongoId = user?.unsafeMetadata?.mongoId;

  // Pick top 3 conversation partners for avatar stack (excluding self)
  const avatarPeers = conversations
    .slice(0, 3)
    .map((conv) => {
      return conv.participants?.find((p) => {
        if (p.clerkId && myClerkId) return p.clerkId !== myClerkId;
        if (p._id && myMongoId) return p._id.toString() !== myMongoId;
        return false;
      }) || conv.participants?.[0];
    })
    .filter(Boolean);

  const toggle = () => setIsOpen((o) => !o);

  return (
    <button
      id="messenger-trigger"
      onClick={toggle}
      aria-label="Open Messages"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#1b1b1f",
        border: "1px solid #2c2c35",
        borderRadius: 999,
        padding: "10px 16px 10px 14px",
        cursor: "pointer",
        boxShadow: "0 6px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
        outline: "none",
        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.35)";
        e.currentTarget.style.background = "#212128";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3)";
        e.currentTarget.style.background = "#1b1b1f";
      }}
    >
      {/* Icon */}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Send size={16} color="#c4c4d0" />
        {unreadTotal > 0 && (
          <span
            style={{
              position: "absolute",
              top: -7,
              right: -8,
              background: "#ef4444",
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 999,
              minWidth: 15,
              height: 15,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 3px",
              border: "1.5px solid #1b1b1f",
            }}
          >
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        style={{
          color: "#e2e2e8",
          fontSize: 13.5,
          fontWeight: 600,
          letterSpacing: "-0.1px",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        Messages
      </span>

      {/* Avatar stack */}
      {avatarPeers.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
          {avatarPeers.map((peer, i) => (
            <div
              key={i}
              style={{
                marginLeft: i === 0 ? 0 : -8,
                zIndex: avatarPeers.length - i,
                position: "relative",
              }}
            >
              {peer?.profileImage ? (
                <img
                  src={peer.profileImage}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #1b1b1f",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#5044E5,#8a6bfe)",
                    border: "2px solid #1b1b1f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {(peer?.nickname || peer?.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
