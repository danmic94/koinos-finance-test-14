// API configuration utility
// This centralizes API URL management and provides a fallback for local development

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const apiUrls = {
  items: `${API_BASE_URL}/items`,
  stats: `${API_BASE_URL}/stats`
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
};

export default API_BASE_URL;
