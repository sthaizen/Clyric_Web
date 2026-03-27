import axiosInstance from "../axios.js";

export const getCommentsForProblem = async (problemId) => {
  const { data } = await axiosInstance.get(`/comments/${problemId}`);
  return data;
};

export const addComment = async (problemId, payload) => {
  const { data } = await axiosInstance.post(`/comments/${problemId}`, payload);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await axiosInstance.delete(`/comments/${commentId}`);
  return data;
};

export const toggleLikeComment = async (commentId) => {
  const { data } = await axiosInstance.post(`/comments/${commentId}/like`);
  return data;
};
