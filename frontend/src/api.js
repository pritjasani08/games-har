import axios from 'axios';
import { API_BASE_URL } from './config/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getApps = () => api.get('/apps');
export const getRecentApps = () => api.get('/apps/recent');
export const addApp = (data, adminPassword) => api.post('/apps', data, {
  headers: { Authorization: `Bearer ${adminPassword}` }
});
export const deleteApp = (id, adminPassword) => api.delete(`/apps/${id}`, {
  headers: { Authorization: `Bearer ${adminPassword}` }
});
export const uploadLogo = (file, adminPassword) => {
  const formData = new FormData();
  formData.append('logo', file);
  return api.post('/upload', formData, {
    headers: { 
      Authorization: `Bearer ${adminPassword}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const sendContactMessage = (data) => api.post('/contact', data);

export default api;
