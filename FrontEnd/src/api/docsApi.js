import axiosInstance from "../lib/axios";

export const docsApi = {
  getCategories: async () => {
    const res = await axiosInstance.get("/docs/categories");
    return res.data;
  },

  upsertCategory: async (data) => {
    const res = await axiosInstance.post("/docs/categories", data);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await axiosInstance.delete(`/docs/categories/${id}`);
    return res.data;
  },

  getPages: async (status = "") => {
    const params = status ? { status } : {};
    const res = await axiosInstance.get("/docs/pages", { params });
    return res.data;
  },

  upsertPage: async (data) => {
    const res = await axiosInstance.post("/docs/pages", data);
    return res.data;
  },

  deletePage: async (id) => {
    const res = await axiosInstance.delete(`/docs/pages/${id}`);
    return res.data;
  },
  
  bulkDeletePages: async (ids) => {
    const res = await axiosInstance.post("/docs/pages/bulk-delete", { ids });
    return res.data;
  },

  duplicatePage: async (id) => {
    const res = await axiosInstance.post(`/docs/pages/${id}/duplicate`);
    return res.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post("/docs/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  }
};
