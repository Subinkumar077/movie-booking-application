import api from './api';

export const movieService = {
  list: () => api.get('/api/movies/getallmovies'),
  byGenre: (genre) => api.get('/api/movies/getmoviesbygenre', { params: { genre } }),
  byLanguage: (language) => api.get('/api/movies/getmoviesbylanguage', { params: { language } }),
  byTitle: (title) => api.get('/api/movies/getmoviesbytitle', { params: { title } }),
  create: (movie) => api.post('/api/movies/addmovies', movie),
  update: (id, movie) => api.put(`/api/movies/updatemovie/${id}`, movie),
  remove: (id) => api.delete(`/api/movies/deletemovie/${id}`),
};
