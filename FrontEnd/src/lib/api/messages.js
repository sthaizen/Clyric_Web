import axiosInstance from "../axios";

// ── Eligible Peers ───────────────────────────────────────────────────────────
export const fetchEligiblePeers = async () => {
  const res = await axiosInstance.get("/messages/eligible-peers");
  return res.data; // { peers: [...] }
};

// ── Conversations ────────────────────────────────────────────────────────────
export const fetchConversations = async () => {
  const res = await axiosInstance.get("/messages/conversations");
  return res.data; // { conversations: [...] }
};

export const openOrCreateConversation = async (peerId) => {
  const res = await axiosInstance.post("/messages/conversations", { peerId });
  return res.data; // { conversation }
};

// ── Messages ─────────────────────────────────────────────────────────────────
export const fetchMessages = async (conversationId, page = 1, limit = 40) => {
  const res = await axiosInstance.get(
    `/messages/conversations/${conversationId}?page=${page}&limit=${limit}`
  );
  return res.data; // { messages, page, totalPages, total }
};

export const postMessage = async (conversationId, content) => {
  const res = await axiosInstance.post(
    `/messages/conversations/${conversationId}/send`,
    { content }
  );
  return res.data; // { message }
};

export const markConversationRead = async (conversationId) => {
  const res = await axiosInstance.post(
    `/messages/conversations/${conversationId}/read`
  );
  return res.data;
};
