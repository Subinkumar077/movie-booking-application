import api from './api';

export const showService = {
  list: () => api.get('/api/show/getallshows'),
  byMovie: (id) => api.get(`/api/show/getshowbymovie/${id}`),
  byTheater: (id) => api.get(`/api/show/getshowbytheater/${id}`),
  create: (show) => api.post('/api/show/createshow', show),
  update: (id, show) => api.put(`/api/show/updateshow/${id}`, show),
  remove: (id) => api.delete(`/api/show/deleteshow/${id}`),
};
