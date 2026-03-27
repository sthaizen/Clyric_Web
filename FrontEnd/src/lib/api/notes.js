import axiosInstance from "../axios.js";

export const getNotes = async (problemId) => {
  const res = await axiosInstance.get(`/notes/${problemId}`);
  return res.data;
};

export const createNote = async (problemId) => {
  const res = await axiosInstance.post(`/notes/${problemId}`);
  return res.data;
};

export const updateNote = async (noteId, data) => {
  const res = await axiosInstance.put(`/notes/${noteId}`, data);
  return res.data;
};

export const deleteNote = async (noteId) => {
  const res = await axiosInstance.delete(`/notes/${noteId}`);
  return res.data;
};
