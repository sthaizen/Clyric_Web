import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useUser } from "@clerk/clerk-react";
import { socket } from "../lib/socket";
import {
  fetchConversations,
  openOrCreateConversation,
} from "../lib/api/messages";

const MessengerContext = createContext(null);

export function MessengerProvider({ children }) {
  const { user, isSignedIn } = useUser();

  // ── Panel state ────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list"); // "list" | "chat"
  const [activeConversation, setActiveConversation] = useState(null);

  // ── Conversations list ─────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [convsLoading, setConvsLoading] = useState(false);

  // ── New chat modal ─────────────────────────────────────────────────────────
  const [showNewChat, setShowNewChat] = useState(false);

  // ── Total unread badge ─────────────────────────────────────────────────────
  const unreadTotal = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  // ── Load conversations ─────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    if (!isSignedIn) return;
    setConvsLoading(true);
    try {
      const data = await fetchConversations();
      setConversations(data.conversations || []);
    } catch (e) {
      console.error("loadConversations error:", e);
    } finally {
      setConvsLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) loadConversations();
  }, [isSignedIn, loadConversations]);

  // ── Socket: listen for conversation updates (unread badge) ─────────────────
  useEffect(() => {
    if (!isSignedIn) return;

    const handleConvUpdate = ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === conversationId);
        if (idx === -1) {
          loadConversations();
          return prev;
        }
        // Create updated version
        const updated = {
          ...prev[idx],
          lastMessage,
          lastMessageAt,
          unreadCount: (prev[idx].unreadCount || 0) + 1,
        };
        // Move to top: filter out old one, prepend new one
        return [updated, ...prev.filter((c) => c._id !== conversationId)];
      });
    };

    socket.on("chat:conversation-updated", handleConvUpdate);
    return () => socket.off("chat:conversation-updated", handleConvUpdate);
  }, [isSignedIn, loadConversations]);

  // ── Open panel, open chat window with a peer ───────────────────────────────
  const openChatWith = useCallback(
    async (peer) => {
      setIsOpen(true);
      try {
        const data = await openOrCreateConversation(peer.id || peer._id);
        const conv = data.conversation;
        // Merge into conversations list (or update if exists)
        setConversations((prev) => {
          const filtered = prev.filter((c) => c._id !== conv._id);
          return [conv, ...filtered];
        });
        setActiveConversation(conv);
        setView("chat");
      } catch (e) {
        console.error("openChatWith error:", e);
      }
    },
    []
  );

  // ── Select existing conversation from list ─────────────────────────────────
  const openConversation = useCallback((conv) => {
    setActiveConversation(conv);
    setView("chat");
  }, []);

  // ── Back to list ───────────────────────────────────────────────────────────
  const goBackToList = useCallback(() => {
    setActiveConversation(null);
    setView("list");
  }, []);

  // ── Close panel ───────────────────────────────────────────────────────────
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setView("list");
    setActiveConversation(null);
  }, []);

  // ── Update unread to 0 after opening a conversation ───────────────────────
  const markConversationReadLocally = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
  }, []);

  // ── Update last message in list after sending ─────────────────────────────
  const updateConversationLastMessage = useCallback((conversationId, content) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c._id === conversationId);
      if (idx === -1) return prev;
      const updated = {
        ...prev[idx],
        lastMessage: content,
        lastMessageAt: new Date().toISOString(),
      };
      return [updated, ...prev.filter((c) => c._id !== conversationId)];
    });
  }, []);

  return (
    <MessengerContext.Provider
      value={{
        isOpen,
        setIsOpen,
        view,
        activeConversation,
        conversations,
        convsLoading,
        unreadTotal,
        showNewChat,
        setShowNewChat,
        openChatWith,
        openConversation,
        goBackToList,
        closePanel,
        loadConversations,
        markConversationReadLocally,
        updateConversationLastMessage,
      }}
    >
      {children}
    </MessengerContext.Provider>
  );
}

// Safe hook — returns context or null-safe defaults if used outside MessengerProvider.
// This allows components like RecommendedConnections to call the hook unconditionally
// without violating React's Rules of Hooks, and simply get no-op functions when the
// provider is not present.
const EMPTY_CTX = {
  isOpen: false,
  setIsOpen: () => {},
  view: "list",
  activeConversation: null,
  conversations: [],
  convsLoading: false,
  unreadTotal: 0,
  showNewChat: false,
  setShowNewChat: () => {},
  openChatWith: null,
  openConversation: () => {},
  goBackToList: () => {},
  closePanel: () => {},
  loadConversations: () => {},
  markConversationReadLocally: () => {},
  updateConversationLastMessage: () => {},
};

export function useMessengerContext() {
  const ctx = useContext(MessengerContext);
  return ctx ?? EMPTY_CTX;
}
