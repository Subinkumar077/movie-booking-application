import api from './api';

export const bookingService = {
  create: (booking) => api.post('/api/booking/createbooking', booking),
  mine: () => api.get('/api/booking/getuserbooking'),
  byShow: (id) => api.get(`/api/booking/getshowbooking/${id}`),
  byStatus: (status) => api.get(`/api/booking/status/${status}`),
  confirm: (id) => api.put(`/api/booking/confirm/${id}`),
  cancel: (id) => api.put(`/api/booking/cancel/${id}`),
};
