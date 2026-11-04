import { ArrowLeft, CalendarDays, Clock3, Languages, MapPin, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomerNav from '../../components/layout/CustomerNav';
import { movieService } from '../../services/movieService';
import { showService } from '../../services/showService';
import { movieImage } from '../../components/movies/MovieCard';
import { getApiErrorMessage } from '../../utils/apiError';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([movieService.list(), showService.byMovie(id)]).then(([movieResponse, showResponse]) => {
      if (!active) return;
      const foundMovie = (movieResponse.data || []).find((item) => String(item.id) === String(id));
      setMovie(foundMovie || null);
      setShows(Array.isArray(showResponse.data) ? showResponse.data : []);
      if (!foundMovie) setError('Movie not found.');
    }).catch((requestError) => { if (active) setError(getApiErrorMessage(requestError, 'Could not load this movie.')); }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (isLoading) return <div className="customer-page"><CustomerNav /><main className="page-shell"><div className="state-card"><div className="spinner" />Loading movie details…</div></main></div>;
  if (error || !movie) return <div className="customer-page"><CustomerNav /><main className="page-shell"><div className="state-card"><h2>{error || 'Movie not found.'}</h2><Link className="button button-primary" to="/">Back to movies</Link></div></main></div>;
  const title = movie.title || movie.name;

  return (
    <div className="customer-page">
      <CustomerNav />
      <main>
        <section className="detail-hero">
          <div className="detail-backdrop" />
          <div className="detail-content">
            <button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
            <p className="eyebrow">{movie.genre || 'Feature presentation'}</p>
            <h1>{title}</h1>
            <p className="detail-description">{movie.description || 'A new story is waiting for you on the big screen.'}</p>
            <div className="detail-facts"><span><Languages size={16} /> {movie.language || 'Language TBA'}</span><span><Clock3 size={16} /> {movie.duration ? `${movie.duration} min` : 'Runtime TBA'}</span><span><CalendarDays size={16} /> {movie.releaseDate || 'Release date TBA'}</span></div>
          </div>
          <img className="detail-poster" src={movieImage(movie, 2)} alt={`${title} poster`} />
        </section>
        <section className="content-section show-section">
          <div className="section-heading"><div><p className="eyebrow">Choose your moment</p><h2>Available shows</h2></div><span className="result-count">{shows.length} shows</span></div>
          {!shows.length ? <div className="state-card"><Ticket size={32} /><h3>No shows scheduled yet</h3><p>Check back soon for upcoming screenings.</p></div> : <div className="show-list">{shows.map((show) => <article className="show-card" key={show.id}><div><h3>{show.theater?.theaterName || 'Theater'}</h3><p><MapPin size={14} /> {show.theater?.theaterLocation || 'Location TBA'}{show.theater?.theaterScreenType ? ` • ${show.theater.theaterScreenType}` : ''}</p></div><div className="show-time"><strong>{show.showTime ? new Date(show.showTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBA'}</strong><span>{show.showTime ? new Date(show.showTime).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : 'Time TBA'}</span></div><div className="show-price">₹{show.price ?? '—'}</div><Link className="button button-primary select-show" to={`/booking/seats/${show.id}`}>Select show</Link></article>)}</div>}
        </section>
      </main>
    </div>
  );
}
