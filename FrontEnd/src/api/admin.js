import axiosInstance from "../lib/axios";

export const adminApi = {
  // Overview stats
  getStats: async () => {
    const res = await axiosInstance.get("/admin/stats");
    return res.data;
  },

  // Recent activity feed
  getRecentActivity: async () => {
    const res = await axiosInstance.get("/admin/recent-activity");
    return res.data;
  },

  // Users
  getUsers: async (params = {}) => {
    const res = await axiosInstance.get("/admin/users", { params });
    return res.data;
  },

  updateUser: async (id, updates) => {
    const res = await axiosInstance.patch(`/admin/users/${id}`, updates);
    return res.data;
  },

  // Problems
  getProblems: async (params = {}) => {
    const res = await axiosInstance.get("/admin/problems", { params });
    return res.data;
  },

  createProblem: async (data) => {
    const res = await axiosInstance.post("/admin/problems", data);
    return res.data;
  },

  updateProblem: async (slug, data) => {
    const res = await axiosInstance.put(`/admin/problems/${slug}`, data);
    return res.data;
  },

  deleteProblem: async (slug) => {
    const res = await axiosInstance.delete(`/admin/problems/${slug}`);
    return res.data;
  },

  // Sessions
  getActiveSessions: async () => {
    const res = await axiosInstance.get("/admin/sessions/active");
    return res.data;
  },

  // Quests
  getQuests: async (params = {}) => {
    const res = await axiosInstance.get("/admin/quests", { params });
    return res.data;
  },

  createQuest: async (data) => {
    const res = await axiosInstance.post("/admin/quests", data);
    return res.data;
  },
};
