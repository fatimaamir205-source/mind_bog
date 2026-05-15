import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', config.url);
  console.log('Token from localStorage:', token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-redirect, just log the error
    if (error.response?.status === 401 || error.response?.status === 422) {
      console.error('Auth error:', error.response?.data);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Blogs API
export const blogsAPI = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (id) => api.get(`/blogs/${id}`),
  createBlog: (data) => api.post('/blogs', data),
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
  likeBlog: (id) => api.post(`/blogs/${id}/like`),
  bookmarkBlog: (id) => api.post(`/blogs/${id}/bookmark`),
  getMyBlogs: () => api.get('/blogs/my-blogs'),
  getBookmarks: () => api.get('/blogs/bookmarks'),
};

// Comments API
export const commentsAPI = {
  createComment: (data) => api.post('/comments', data),
  getComments: (blogId) => api.get(`/comments/blog/${blogId}`),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

// AI API
export const aiAPI = {
  analyzeContent: (data) => api.post('/ai/analyze', data),
  getBlogAnalysis: (blogId) => api.get(`/ai/blog/${blogId}/analysis`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file, type = 'blogs') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUserActive: (userId) => api.put(`/admin/users/${userId}/toggle-active`),
  getAllBlogs: () => api.get('/admin/blogs'),
  deleteBlog: (blogId) => api.delete(`/admin/blogs/${blogId}`),
};

// Trending API
export const trendingAPI = {
  getTrendingBlogs: (params) => api.get('/trending/blogs', { params }),
  getTrendingTopics: () => api.get('/trending/topics'),
  getRecommendedAuthors: () => api.get('/trending/authors'),
  getAllTrending: () => api.get('/trending/all'),
};

export default api;
