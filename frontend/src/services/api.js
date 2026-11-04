import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem('movie-booking-user') || 'null');
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch {
    localStorage.removeItem('movie-booking-user');
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status)) {
      localStorage.removeItem('movie-booking-user');
      window.dispatchEvent(new CustomEvent('movie-booking-auth-failed'));
    }
    return Promise.reject(error);
  },
);

export default api;
