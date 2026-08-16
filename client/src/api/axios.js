import axios from 'axios';

const rawApiUrl =
  import.meta.env.VITE_API_URL || 'https://habittracker-hvk4.onrender.com/api';

const API_URL = rawApiUrl.endsWith('/api')
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({ baseURL: API_URL });

// كل طلب بيضيف التوكن أوتوماتيك (لو موجود بالـ localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// لو رجع 401 (توكن منتهي/غير صالح)، بنسجل خروج المستخدم أوتوماتيك
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
