import api from './axios';

export const signup = (name, email, password) =>
  api.post('/auth/signup', { name, email, password }).then((r) => r.data);

export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data);

export const getMe = () => api.get('/auth/me').then((r) => r.data);
