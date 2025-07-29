// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eways-backend-3bl6mj2h9-subhdas272004-gmailcoms-projects.vercel.app/api';

export const API_ENDPOINTS = {
  CONTACT: `${API_BASE_URL}/contact`,
  PROJECTS: `${API_BASE_URL}/projects`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
} as const;

export { API_BASE_URL };
