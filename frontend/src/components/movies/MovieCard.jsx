import { CalendarDays, Clock3, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';

const posterPalette = ['#52263b', '#243e56', '#534021', '#263e35', '#3b2b54'];

export function movieImage(movie, index = 0) {
  const query = encodeURIComponent(movie?.title || movie?.name || 'cinema');
  return `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=80&sig=${query}-${index}`;
}

export default function MovieCard({ movie, index = 0 }) {
  const title = movie.title || movie.name || 'Untitled movie';
  return (
    <article className="movie-card">
      <div className="poster-wrap" style={{ '--poster-tint': posterPalette[index % posterPalette.length] }}>
        <img src={movieImage(movie, index)} alt={`${title} poster`} loading="lazy" />
        <span className="poster-tag">{movie.genre || 'Now showing'}</span>
      </div>
      <div className="movie-card-body">
        <h3>{title}</h3>
        <p className="movie-meta"><Languages size={14} /> {movie.language || 'Language TBA'} <span>•</span> <Clock3 size={14} /> {movie.duration ? `${movie.duration} min` : 'Runtime TBA'}</p>
        <p className="movie-release"><CalendarDays size={14} /> {movie.releaseDate ? new Date(`${movie.releaseDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Release date TBA'}</p>
        <Link className="text-link" to={`/movies/${movie.id}`}>View details <span>→</span></Link>
      </div>
    </article>
  );
}
