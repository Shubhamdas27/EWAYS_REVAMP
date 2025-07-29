// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  CONTACT: `${API_BASE_URL}/contact`,
  PROJECTS: `${API_BASE_URL}/projects`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
} as const;

export { API_BASE_URL };
