import { CalendarDays, Film, LayoutDashboard, LogOut, MapPin, Pencil, Plus, Search, ShieldCheck, Ticket, Trash2, Users, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { movieService } from '../../services/movieService';
import { theaterService } from '../../services/theaterService';
import { showService } from '../../services/showService';
import { bookingService } from '../../services/bookingService';
import { getApiErrorMessage } from '../../utils/apiError';

const emptyMovie = { name: '', title: '', description: '', genre: '', language: '', duration: '', releaseDate: '' };
const emptyTheater = { theaterName: '', theaterLocation: '', theaterCapacity: '', theaterScreenType: '' };
const emptyShow = { showTime: '', price: '', movieId: '', theaterId: '' };

function AdminShell({ active, children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  return <div className="admin-page"><aside className="admin-sidebar"><Link className="brand" to="/admin/dashboard"><span className="brand-mark"><ShieldCheck size={18} /></span>REELRESERVE</Link><p className="admin-label">Administration</p><nav>{[['dashboard', 'Dashboard', LayoutDashboard], ['movies', 'Movies', Film], ['theaters', 'Theaters', MapPin], ['shows', 'Shows', CalendarDays], ['bookings', 'Bookings', Ticket]].map(([key, label, Icon]) => <Link className={active === key ? 'active' : ''} key={key} to={`/admin/${key === 'dashboard' ? 'dashboard' : key}`}><Icon size={17} />{label}</Link>)}</nav><div className="admin-sidebar-footer"><span><Users size={15} />{user?.username}</span><button onClick={() => { signOut(); navigate('/'); }}><LogOut size={15} />Sign out</button></div></aside><main className="admin-content"><header className="admin-topbar"><div><p className="eyebrow">Control room</p><h1>{active === 'dashboard' ? 'Dashboard overview' : `${active.charAt(0).toUpperCase()}${active.slice(1)} management`}</h1></div><span className="admin-status"><span /> System online</span></header>{children}</main></div>;
}

function StatCard({ icon: Icon, label, value }) {
  return <div className="stat-card"><span className="stat-icon"><Icon size={19} /></span><div><small>{label}</small><strong>{value}</strong></div></div>;
}

function DataTable({ columns, rows, empty = 'No records found.' }) {
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{rows.length ? rows : <tr><td colSpan={columns.length} className="table-empty">{empty}</td></tr>}</tbody></table></div>;
}

function FormModal({ title, children, onClose }) {
  return <div className="modal-backdrop"><section className="admin-form-modal"><button className="modal-close" onClick={onClose}><X size={18} /></button><h2>{title}</h2>{children}</section></div>;
}

function DashboardHome({ movies, theaters, shows, bookings }) {
  return <><div className="stats-grid"><StatCard icon={Film} label="Total movies" value={movies.length} /><StatCard icon={MapPin} label="Total theaters" value={theaters.length} /><StatCard icon={CalendarDays} label="Scheduled shows" value={shows.length} /><StatCard icon={Ticket} label="Pending bookings" value={bookings.length} /></div><section className="admin-panel"><div className="panel-heading"><div><p className="eyebrow">Recently scheduled</p><h2>Show pipeline</h2></div><Link to="/admin/shows">Manage shows →</Link></div><DataTable columns={['Movie', 'Theater', 'Show time', 'Price']} rows={shows.slice(0, 5).map((show) => <tr key={show.id}><td>{show.movie?.title || show.movie?.name || 'Movie'}</td><td>{show.theater?.theaterName || 'Theater'}</td><td>{show.showTime ? new Date(show.showTime).toLocaleString() : '—'}</td><td>₹{show.price ?? '—'}</td></tr>)} /></section></>;
}

function MoviesPanel({ movies, refresh }) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const filtered = movies.filter((movie) => `${movie.title} ${movie.name} ${movie.genre}`.toLowerCase().includes(query.toLowerCase()));
  async function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    data.duration = Number(data.duration);
    try { if (editing.id) await movieService.update(editing.id, data); else await movieService.create(data); toast.success(editing.id ? 'Movie updated.' : 'Movie added.'); setEditing(null); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not save movie.')); }
  }
  async function remove(id) { if (!window.confirm('Delete this movie?')) return; try { await movieService.remove(id); toast.success('Movie deleted.'); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not delete movie.')); } }
  return <><div className="admin-toolbar"><label className="admin-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies" /></label><button className="button button-primary admin-add" onClick={() => setEditing(emptyMovie)}><Plus size={16} /> Add movie</button></div><DataTable columns={['Title', 'Genre', 'Language', 'Duration', 'Release date', 'Actions']} rows={filtered.map((movie) => <tr key={movie.id}><td><strong>{movie.title || movie.name}</strong></td><td>{movie.genre || '—'}</td><td>{movie.language || '—'}</td><td>{movie.duration ? `${movie.duration} min` : '—'}</td><td>{movie.releaseDate || '—'}</td><td className="table-actions"><button onClick={() => setEditing(movie)}><Pencil size={15} /></button><button onClick={() => remove(movie.id)}><Trash2 size={15} /></button></td></tr>)} />{editing && <FormModal title={editing.id ? 'Edit movie' : 'Add movie'} onClose={() => setEditing(null)}><form className="admin-form" onSubmit={save}>{[['title', 'Title'], ['name', 'Name'], ['genre', 'Genre'], ['language', 'Language'], ['duration', 'Duration (minutes)'], ['releaseDate', 'Release date']].map(([name, label]) => <label key={name}>{label}<input name={name} defaultValue={editing[name] || ''} required={['title', 'genre', 'language'].includes(name)} type={name === 'duration' ? 'number' : name === 'releaseDate' ? 'date' : 'text'} /></label>)}<label>Description<textarea name="description" defaultValue={editing.description || ''} rows="3" /></label><button className="button button-primary" type="submit">Save movie</button></form></FormModal>}</>;
}

function TheatersPanel({ theaters, refresh }) {
  const [editing, setEditing] = useState(null);
  async function save(event) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); data.theaterCapacity = Number(data.theaterCapacity); try { if (editing.id) await theaterService.update(editing.id, data); else await theaterService.create(data); toast.success(editing.id ? 'Theater updated.' : 'Theater added.'); setEditing(null); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not save theater.')); } }
  async function remove(id) { if (!window.confirm('Delete this theater?')) return; try { await theaterService.remove(id); toast.success('Theater deleted.'); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not delete theater.')); } }
  return <><div className="admin-toolbar"><span className="muted">Manage venues and screen capacity.</span><button className="button button-primary admin-add" onClick={() => setEditing(emptyTheater)}><Plus size={16} /> Add theater</button></div><DataTable columns={['Theater', 'Location', 'Capacity', 'Screen type', 'Actions']} rows={theaters.map((theater) => <tr key={theater.id}><td><strong>{theater.theaterName}</strong></td><td>{theater.theaterLocation}</td><td>{theater.theaterCapacity}</td><td>{theater.theaterScreenType || '—'}</td><td className="table-actions"><button onClick={() => setEditing(theater)}><Pencil size={15} /></button><button onClick={() => remove(theater.id)}><Trash2 size={15} /></button></td></tr>)} />{editing && <FormModal title={editing.id ? 'Edit theater' : 'Add theater'} onClose={() => setEditing(null)}><form className="admin-form" onSubmit={save}>{[['theaterName', 'Theater name'], ['theaterLocation', 'Location'], ['theaterCapacity', 'Capacity'], ['theaterScreenType', 'Screen type']].map(([name, label]) => <label key={name}>{label}<input name={name} defaultValue={editing[name] || ''} required type={name === 'theaterCapacity' ? 'number' : 'text'} /></label>)}<button className="button button-primary" type="submit">Save theater</button></form></FormModal>}</>;
}

function ShowsPanel({ shows, movies, theaters, refresh }) {
  const [editing, setEditing] = useState(null);
  async function save(event) { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); data.price = Number(data.price); data.movieId = Number(data.movieId); data.theaterId = Number(data.theaterId); try { if (editing.id) await showService.update(editing.id, data); else await showService.create(data); toast.success(editing.id ? 'Show updated.' : 'Show created.'); setEditing(null); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not save show.')); } }
  async function remove(id) { if (!window.confirm('Delete this show?')) return; try { await showService.remove(id); toast.success('Show deleted.'); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Could not delete show. Active bookings may prevent deletion.')); } }
  return <><div className="admin-toolbar"><span className="muted">Schedule screenings across your venues.</span><button className="button button-primary admin-add" onClick={() => setEditing(emptyShow)}><Plus size={16} /> Create show</button></div><DataTable columns={['Movie', 'Theater', 'Show time', 'Price', 'Actions']} rows={shows.map((show) => <tr key={show.id}><td><strong>{show.movie?.title || show.movie?.name || 'Movie'}</strong></td><td>{show.theater?.theaterName || 'Theater'}</td><td>{show.showTime ? new Date(show.showTime).toLocaleString() : '—'}</td><td>₹{show.price ?? '—'}</td><td className="table-actions"><button onClick={() => setEditing({ ...show, showTime: show.showTime?.slice(0, 16), movieId: show.movie?.id, theaterId: show.theater?.id })}><Pencil size={15} /></button><button onClick={() => remove(show.id)}><Trash2 size={15} /></button></td></tr>)} />{editing && <FormModal title={editing.id ? 'Edit show' : 'Create show'} onClose={() => setEditing(null)}><form className="admin-form" onSubmit={save}><label>Movie<select name="movieId" defaultValue={editing.movieId || ''} required><option value="">Select movie</option>{movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title || movie.name}</option>)}</select></label><label>Theater<select name="theaterId" defaultValue={editing.theaterId || ''} required><option value="">Select theater</option>{theaters.map((theater) => <option key={theater.id} value={theater.id}>{theater.theaterName}</option>)}</select></label><label>Show date and time<input name="showTime" type="datetime-local" defaultValue={editing.showTime || ''} required /></label><label>Ticket price<input name="price" type="number" step="0.01" defaultValue={editing.price || ''} required /></label><button className="button button-primary" type="submit">Save show</button></form></FormModal>}</>;
}

function BookingsPanel({ refresh }) {
  const [status, setStatus] = useState('PENDING');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const loadBookings = () => {
    setIsLoading(true);
    setLoadError('');
    const request = status === 'ALL'
      ? Promise.all(['PENDING', 'CONFIRMED', 'CANCELLED'].map((item) => bookingService.byStatus(item))).then((responses) => responses.flatMap(({ data }) => Array.isArray(data) ? data : []))
      : bookingService.byStatus(status).then(({ data }) => Array.isArray(data) ? data : []);
    request.then(setBookings).catch((error) => setLoadError(getApiErrorMessage(error, 'Could not load bookings for this status.'))).finally(() => setIsLoading(false));
  };
  useEffect(() => { loadBookings(); }, [status]);
  async function action(id, type) { try { await (type === 'confirm' ? bookingService.confirm(id) : bookingService.cancel(id)); toast.success(`Booking ${type}ed.`); loadBookings(); refresh(); } catch (error) { toast.error(getApiErrorMessage(error, 'Booking action failed.')); } }
  return <><div className="admin-toolbar"><span className="muted">Each filter uses the backend status endpoint.</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>ALL</option><option>PENDING</option><option>CONFIRMED</option><option>CANCELLED</option></select></div>{isLoading && <div className="state-card"><div className="spinner" />Loading bookings…</div>}{!isLoading && loadError && <div className="state-card"><p>{loadError}</p><button className="button button-primary" onClick={loadBookings}>Try again</button></div>}{!isLoading && !loadError && <DataTable columns={['Booking', 'Movie', 'Seats', 'Status', 'Actions']} rows={bookings.map((booking) => <tr key={booking.id}><td>#{booking.id}</td><td>{booking.show?.movie?.title || booking.show?.movie?.name || 'Movie'}</td><td>{booking.seatNumbers?.join(', ') || booking.noOfSeats}</td><td><span className={`status-badge status-${String(booking.bookingStatus).toLowerCase()}`}>{booking.bookingStatus}</span></td><td className="table-actions">{booking.bookingStatus === 'PENDING' && <><button title="Confirm" onClick={() => action(booking.id, 'confirm')}>Confirm</button><button title="Cancel" onClick={() => action(booking.id, 'cancel')}>Cancel</button></>}</td></tr>)} empty="No booking records returned." />}</>;
}

export default function AdminDashboard({ section = 'dashboard' }) {
  const [movies, setMovies] = useState([]); const [theaters, setTheaters] = useState([]); const [shows, setShows] = useState([]); const [bookings, setBookings] = useState([]); const [error, setError] = useState('');
  const load = () => Promise.all([movieService.list(), showService.list(), theaterService.list(), bookingService.byStatus('PENDING')]).then(([movieResponse, showResponse, theaterResponse, bookingResponse]) => { setMovies(movieResponse.data || []); setShows(showResponse.data || []); setTheaters(theaterResponse.data || []); setBookings(bookingResponse.data || []); }).catch((requestError) => setError(getApiErrorMessage(requestError, 'Some dashboard data could not be loaded.')));
  useEffect(() => { load(); }, []);
  const content = error ? <div className="state-card"><h3>Dashboard data unavailable</h3><p>{error}</p><button className="button button-primary" onClick={() => { setError(''); load(); }}>Try again</button></div> : section === 'dashboard' ? <DashboardHome movies={movies} theaters={theaters} shows={shows} bookings={bookings} /> : section === 'movies' ? <MoviesPanel movies={movies} refresh={load} /> : section === 'theaters' ? <TheatersPanel theaters={theaters} refresh={load} /> : section === 'shows' ? <ShowsPanel shows={shows} movies={movies} theaters={theaters} refresh={load} /> : <BookingsPanel refresh={load} />;
  return <AdminShell active={section}>{content}</AdminShell>;
}
