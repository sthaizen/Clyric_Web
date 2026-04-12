import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { socket } from "../lib/socket";
import {
  fetchMessages,
  postMessage,
  markConversationRead,
} from "../lib/api/messages";
import { useMessengerContext } from "../context/MessengerContext";

/**
 * useChat — drives the active chat window.
 * Loads message history, joins/leaves the socket room,
 * handles real-time receive, typing indicator, and send.
 */
export function useChat(conversationId) {
  const { user } = useUser();
  const { markConversationReadLocally, updateConversationLastMessage } =
    useMessengerContext();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const typingTimerRef = useRef(null);
  const isTypingSentRef = useRef(false);

  // ── Load initial messages ──────────────────────────────────────────────────
  const loadMessages = useCallback(
    async (p = 1) => {
      if (!conversationId) return;
      setIsLoading(true);
      try {
        const data = await fetchMessages(conversationId, p, 40);
        if (p === 1) {
          setMessages(data.messages || []);
        } else {
          setMessages((prev) => [...(data.messages || []), ...prev]);
        }
        setHasMore(data.page < data.totalPages);
        setPage(p);
      } catch (e) {
        console.error("loadMessages error:", e);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId]
  );

  // ── Join room + load messages on mount ────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    setMessages([]);
    setPage(1);
    setIsOtherTyping(false);
    loadMessages(1);

    // Join socket room
    socket.emit("chat:join-room", { conversationId });

    // Mark as read
    markConversationRead(conversationId).catch(() => {});
    markConversationReadLocally(conversationId);

    return () => {
      socket.emit("chat:leave-room", { conversationId });
      // Stop typing if navigating away
      if (isTypingSentRef.current) {
        socket.emit("chat:typing-stop", { conversationId });
        isTypingSentRef.current = false;
      }
    };
  }, [conversationId]);

  // ── Socket: receive new messages ──────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;

    const handleNewMessage = ({ conversationId: cId, message }) => {
      if (cId !== conversationId) return;
      setMessages((prev) => {
        // Avoid duplicates (optimistic sends)
        const exists = prev.some((m) => m._id === message._id);
        return exists ? prev : [...prev, message];
      });
      // Mark read immediately since window is open
      markConversationRead(conversationId).catch(() => {});
      markConversationReadLocally(conversationId);
    };

    const handleTypingStart = ({ conversationId: cId, mongoId }) => {
      if (cId !== conversationId) return;
      // Don't show typing for our own messages
      if (mongoId && user?.id && mongoId !== user?.unsafeMetadata?.mongoId) {
        setIsOtherTyping(true);
      } else if (!mongoId) {
        setIsOtherTyping(true);
      }
    };

    const handleTypingStop = ({ conversationId: cId }) => {
      if (cId !== conversationId) return;
      setIsOtherTyping(false);
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:typing-start", handleTypingStart);
    socket.on("chat:typing-stop", handleTypingStop);

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:typing-start", handleTypingStart);
      socket.off("chat:typing-stop", handleTypingStop);
    };
  }, [conversationId, user?.id]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim() || !conversationId || isSending) return;
      setIsSending(true);

      // Stop typing indicator
      if (isTypingSentRef.current) {
        socket.emit("chat:typing-stop", { conversationId });
        isTypingSentRef.current = false;
      }
      clearTimeout(typingTimerRef.current);

      try {
        const data = await postMessage(conversationId, content.trim());
        // Message will arrive via socket; but also optimistically append
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === data.message._id);
          return exists ? prev : [...prev, data.message];
        });
        updateConversationLastMessage(conversationId, content.trim());
      } catch (e) {
        console.error("sendMessage error:", e);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, isSending, updateConversationLastMessage]
  );

  // ── Typing indicator debounce ─────────────────────────────────────────────
  const handleTyping = useCallback(() => {
    if (!conversationId) return;
    if (!isTypingSentRef.current) {
      socket.emit("chat:typing-start", { conversationId });
      isTypingSentRef.current = true;
    }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("chat:typing-stop", { conversationId });
      isTypingSentRef.current = false;
    }, 2000);
  }, [conversationId]);

  // ── Load older messages ───────────────────────────────────────────────────
  const loadOlderMessages = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMessages(page + 1);
    }
  }, [hasMore, isLoading, loadMessages, page]);

  return {
    messages,
    isLoading,
    isSending,
    isOtherTyping,
    hasMore,
    sendMessage,
    handleTyping,
    loadOlderMessages,
  };
}
