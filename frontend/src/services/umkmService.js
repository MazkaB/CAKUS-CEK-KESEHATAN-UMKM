// frontend/src/services/umkmService.js (Simplified)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const umkmService = {
  createUMKM: (data) => api.post('/umkm', data),
  getAllUMKM: (params) => api.get('/umkm', { params }),
  getUMKMById: (id) => api.get(`/umkm/${id}`),
  updateUMKM: (id, data) => api.put(`/umkm/${id}`, data),
  deleteUMKM: (id) => api.delete(`/umkm/${id}`),
  getDashboardStats: () => api.get('/umkm/dashboard-stats'),
};

export default api;