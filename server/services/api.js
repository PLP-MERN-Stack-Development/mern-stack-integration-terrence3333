// client/src/services/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ AUTH SERVICE
export const authService = {
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  login: async (data) => {
    const res = await api.post("/auth/login", data);
    if (res.data.token) localStorage.setItem("token", res.data.token);
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getProfile: async () => {
    const res = await api.get("/auth/profile");
    return res.data;
  },
};

// 📝 POSTS SERVICE
export const postService = {
  getAllPosts: async () => {
    const res = await api.get("/posts");
    return res.data;
  },
  getPost: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },
  createPost: async (data) => {
    const res = await api.post("/posts", data);
    return res.data;
  },
  updatePost: async (id, data) => {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },
  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },
};

// 💬 COMMENTS SERVICE
export const commentService = {
  addComment: async (postId, text) => {
    const res = await api.post(`/posts/${postId}/comments`, { text });
    return res.data;
  },
  deleteComment: async (postId, commentId) => {
    const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return res.data;
  },
};

export default api;
