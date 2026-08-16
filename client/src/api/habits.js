import api from './axios';

export const getHabits = () => api.get('/habits').then((r) => r.data);
export const createHabit = (name) => api.post('/habits', { name }).then((r) => r.data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`).then((r) => r.data);

export const getEntries = (habitId) =>
  api.get(`/habits/${habitId}/entries`).then((r) => r.data);

export const toggleEntry = (habitId, date) =>
  api.post(`/habits/${habitId}/entries`, { date }).then((r) => r.data);
