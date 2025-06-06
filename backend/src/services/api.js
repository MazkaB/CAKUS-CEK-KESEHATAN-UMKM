// backend/src/services/api.js (for frontend)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ML_API_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const umkmService = {
  createUMKM: (data) => api.post('/umkm', data),
  getAllUMKM: (params) => api.get('/umkm', { params }),
  getUMKMById: (id) => api.get(`/umkm/${id}`),
  updateUMKM: (id, data) => api.put(`/umkm/${id}`, data),
  deleteUMKM: (id) => api.delete(`/umkm/${id}`),
  getDashboardStats: () => api.get('/umkm/dashboard-stats'),
};

export const mlService = {
  checkHealth: (umkmId) => axios.get(`${ML_API_URL}/health-check/${umkmId}`),
  getRecommendations: (umkmId) => axios.get(`${ML_API_URL}/recommendations/${umkmId}`),
  getLocationRecommendations: (data) => axios.post(`${ML_API_URL}/location-recommendations`, data),
};

export default api;