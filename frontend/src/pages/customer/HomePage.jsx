import { ArrowRight, Clapperboard, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomerNav from '../../components/layout/CustomerNav';
import MovieCard from '../../components/movies/MovieCard';
import { movieService } from '../../services/movieService';
import { getApiErrorMessage } from '../../utils/apiError';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [language, setLanguage] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    movieService.list().then(({ data }) => {
      if (active) setMovies(Array.isArray(data) ? data : []);
    }).catch((requestError) => {
      if (active) setError(getApiErrorMessage(requestError, 'Could not load movies.'));
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, []);

  const genres = useMemo(() => ['All', ...new Set(movies.map((movie) => movie.genre).filter(Boolean))], [movies]);
  const languages = useMemo(() => ['All', ...new Set(movies.map((movie) => movie.language).filter(Boolean))], [movies]);
  const filteredMovies = useMemo(() => movies.filter((movie) => {
    const title = `${movie.title || ''} ${movie.name || ''}`.toLowerCase();
    return title.includes(search.toLowerCase()) && (genre === 'All' || movie.genre === genre) && (language === 'All' || movie.language === language);
  }), [movies, search, genre, language]);
  const featuredMovie = movies[0];

  function retry() {
    setError('');
    setIsLoading(true);
    movieService.list().then(({ data }) => setMovies(Array.isArray(data) ? data : [])).catch((requestError) => setError(getApiErrorMessage(requestError, 'Could not load movies.'))).finally(() => setIsLoading(false));
  }

  return (
    <div className="customer-page">
      <CustomerNav searchValue={search} onSearch={setSearch} />
      <main>
        <section className="hero-section">
          <div className="hero-backdrop" />
          <div className="hero-content">
            <p className="eyebrow"><Sparkles size={14} /> Your cinema, your way</p>
            <h1>Stories that stay<br /><em>with you.</em></h1>
            <p>Find the perfect seat for your next cinematic escape. Browse what's playing and make your night count.</p>
            <a className="button button-primary" href="#movies">Explore movies <ArrowRight size={17} /></a>
          </div>
          {featuredMovie && <div className="featured-poster"><img src={`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85&sig=featured`} alt="" /></div>}
        </section>
        <section className="content-section" id="movies">
          <div className="section-heading">
            <div><p className="eyebrow">On the big screen</p><h2>Now showing</h2></div>
            <span className="result-count">{filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}</span>
          </div>
          <div className="filter-bar">
            <label className="filter-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by title..." /></label>
            <select value={genre} onChange={(event) => setGenre(event.target.value)} aria-label="Filter by genre">{genres.map((item) => <option key={item}>{item}</option>)}</select>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter by language">{languages.map((item) => <option key={item}>{item}</option>)}</select>
          </div>
          {isLoading && <div className="movie-grid">{[1, 2, 3, 4].map((item) => <div className="skeleton-card" key={item}><div className="skeleton poster-skeleton" /><div className="skeleton line-skeleton" /><div className="skeleton short-skeleton" /></div>)}</div>}
          {!isLoading && error && <div className="state-card"><Clapperboard size={32} /><h3>We couldn't load the lineup</h3><p>{error}</p><button className="button button-primary" onClick={retry}>Try again</button></div>}
          {!isLoading && !error && !filteredMovies.length && <div className="state-card"><Search size={32} /><h3>No movies found</h3><p>Try a different title, genre, or language.</p></div>}
          {!isLoading && !error && Boolean(filteredMovies.length) && <div className="movie-grid">{filteredMovies.map((movie, index) => <MovieCard key={movie.id || `${movie.title}-${index}`} movie={movie} index={index} />)}</div>}
        </section>
        <section className="promo-section"><div><p className="eyebrow">The ReelReserve promise</p><h2>Less scrolling.<br />More <em>magic.</em></h2></div><p>One place to discover films, find your favorite theater, and make every screening memorable.</p></section>
      </main>
      <footer className="site-footer"><Link className="brand" to="/"><span className="brand-mark"><Clapperboard size={16} /></span>REELRESERVE</Link><span>Made for movie people.</span></footer>
    </div>
  );
}
