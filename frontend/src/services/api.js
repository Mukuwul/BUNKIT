import axios from 'axios';
import { showToast } from '../utils/toast';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
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
    const message = error.response?.data?.message || 'Something went wrong';
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      showToast.error('Session expired. Please login again.');
    } else if (error.response?.status >= 500) {
      showToast.error('Server error. Please try again later.');
    } else if (error.code === 'NETWORK_ERROR') {
      showToast.error('Network error. Check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
