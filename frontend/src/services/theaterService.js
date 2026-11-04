import api from './api';

export const theaterService = {
  list: () => api.get('/api/theater/getalltheaters'),
  byLocation: (location) => api.get('/api/theater/gettheaterbylocation', { params: { location } }),
  create: (theater) => api.post('/api/theater/addtheater', theater),
  update: (id, theater) => api.put(`/api/theater/updatetheater/${id}`, theater),
  remove: (id) => api.delete(`/api/theater/deletetheater/${id}`),
};
