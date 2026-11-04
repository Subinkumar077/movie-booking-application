import api from './api';

export const authService = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (details) => api.post('/api/auth/registernormaluser', details),
};
