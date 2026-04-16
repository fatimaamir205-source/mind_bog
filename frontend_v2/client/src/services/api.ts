import axios, { AxiosInstance } from 'axios';

// With Vite proxy, use relative /api path in dev; override via VITE_API_URL for production
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth — /api/auth/*
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// AI — /api/ai/*
export const blogAPI = {
  getBlogs: (params?: { page?: number; per_page?: number; search?: string; sort_by?: string; tags?: string }) =>
    api.get('/blogs', { params }),
  getBlogById: (id: string | number) => api.get(`/blogs/${id}`),
  createBlog: (data: { title: string; content: string; tags?: string; status?: string; image_url?: string }) =>
    api.post('/blogs', data),
  updateBlog: (id: string | number, data: any) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id: string | number) => api.delete(`/blogs/${id}`),
  toggleLike: (id: string | number) => api.post(`/blogs/${id}/like`),
  toggleBookmark: (id: string | number) => api.post(`/blogs/${id}/bookmark`),
  getMyBlogs: () => api.get('/blogs/my-blogs'),
  getBookmarks: () => api.get('/blogs/bookmarks'),
  analyzeContent: (title: string, content: string, blogId?: number) =>
    api.post('/ai/analyze', { title, content, blog_id: blogId }),
  factCheckContent: (title: string, content: string) =>
    api.post('/ai/fact-check', { title, content }),
};

// Comments — /api/comments/*
export const commentAPI = {
  getComments: (blogId: string | number) => api.get(`/comments/blog/${blogId}`),
  createComment: (blogId: string | number, content: string) =>
    api.post('/comments', { blog_id: blogId, content }),
  deleteComment: (commentId: string | number) => api.delete(`/comments/${commentId}`),
  likeComment: (commentId: string | number) => api.post(`/comments/${commentId}/like`),
};

// Users — /api/users/*
export const userAPI = {
  getUserProfile: (userId: string | number) => api.get(`/users/${userId}`),
  getUserBlogs: (userId: string | number) => api.get(`/users/${userId}/blogs`),
  followUser: (userId: string | number) => api.post(`/users/${userId}/follow`),
  unfollowUser: (userId: string | number) => api.delete(`/users/${userId}/follow`),
  getFollowingBlogs: (params?: { page?: number; per_page?: number }) =>
    api.get('/users/following/blogs', { params }),
  getTrendingAuthors: () => api.get('/users/trending'),
};

// AI — /api/ai/*
export const aiAPI = {
  analyzeContent: (title: string, content: string, blogId?: number) =>
    api.post('/ai/analyze', { title, content, blog_id: blogId }),
  getBlogAnalysis: (blogId: string | number) => api.get(`/ai/blog/${blogId}/analysis`),
  factCheckContent: (title: string, content: string) =>
    api.post('/ai/fact-check', { title, content }),
};

// Analytics — /api/analytics/*
export const analyticsAPI = {
  getUserAnalytics: () => api.get('/analytics/user'),
  getBlogAnalytics: (blogId: string | number) => api.get(`/analytics/blogs/${blogId}`),
  getAdminAnalytics: (period = '30d') => api.get('/analytics/admin', { params: { period } }),
};

// Admin — /api/admin/*
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  // Users
  getUsers: (search?: string) => api.get('/admin/users', { params: { search } }),
  toggleUserActive: (userId: string | number) => api.put(`/admin/users/${userId}/toggle-active`),
  updateUserRole: (userId: string | number, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId: string | number) => api.delete(`/admin/users/${userId}`),
  // Blogs
  getBlogs: (status?: string) => api.get('/admin/blogs', { params: { status } }),
  approveBlog: (blogId: string | number) => api.post(`/admin/blogs/${blogId}/approve`),
  rejectBlog: (blogId: string | number) => api.post(`/admin/blogs/${blogId}/reject`),
  deleteBlogAsAdmin: (blogId: string | number) => api.delete(`/admin/blogs/${blogId}`),
  // Reports
  getReports: () => api.get('/admin/reports'),
  resolveReport: (reportId: string | number, action: string) =>
    api.post(`/admin/reports/${reportId}/resolve`, { action }),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: Record<string, any>) => api.put('/admin/settings', data),
};

// Upload — /api/upload/*
export const uploadAPI = {
  uploadImage: (file: File, type: 'blogs' | 'avatars' = 'blogs') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Trending — /api/trending/*
export const trendingAPI = {
  getTrendingTopics: () => api.get('/trending/topics'),
  getRecommendedAuthors: () => api.get('/trending/authors'),
  getTrendingBlogs: () => api.get('/trending/blogs'),
  getAllTrending: () => api.get('/trending/all'),
};

export default api;
