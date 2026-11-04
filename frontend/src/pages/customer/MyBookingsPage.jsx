import { CalendarDays, CheckCircle2, Clock3, Film, MapPin, Ticket, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomerNav from '../../components/layout/CustomerNav';
import { bookingService } from '../../services/bookingService';
import { getApiErrorMessage } from '../../utils/apiError';

function statusLabel(status) {
  return String(status || 'PENDING').toLowerCase();
}

function BookingCard({ booking, onCancel }) {
  const show = booking.show;
  const title = show?.movie?.title || show?.movie?.name || 'Movie details unavailable';
  const showTime = show?.showTime ? new Date(show.showTime) : null;
  const isCancelled = booking.bookingStatus === 'CANCELLED';
  return (
    <article className="booking-card">
      <div className="booking-card-top">
        <div className="booking-movie-icon"><Film size={23} /></div>
        <div className="booking-card-title"><p className="eyebrow">Booking #{booking.id}</p><h2>{title}</h2><span className={`status-badge status-${statusLabel(booking.bookingStatus)}`}>{booking.bookingStatus === 'CONFIRMED' ? <CheckCircle2 size={13} /> : booking.bookingStatus === 'CANCELLED' ? <XCircle size={13} /> : <Clock3 size={13} />}{booking.bookingStatus || 'PENDING'}</span></div>
      </div>
      <div className="booking-card-details">
        <span><MapPin size={15} /><strong>{show?.theater?.theaterName || 'Theater TBA'}</strong><small>{show?.theater?.theaterLocation || 'Location TBA'}</small></span>
        <span><CalendarDays size={15} /><strong>{showTime ? showTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date TBA'}</strong><small>{showTime ? showTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : 'Time TBA'}</small></span>
        <span><Ticket size={15} /><strong>{Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : 'Seats unavailable'}</strong><small>{booking.noOfSeats || booking.seatNumbers?.length || 0} tickets</small></span>
      </div>
      <div className="booking-card-footer"><span>Total <strong>₹{Number(booking.price || 0).toFixed(2)}</strong></span>{!isCancelled && <button className="cancel-button" onClick={() => onCancel(booking)}>Cancel booking</button>}</div>
    </article>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const loadBookings = useCallback(() => {
    setIsLoading(true);
    setError('');
    bookingService.mine().then(({ data }) => setBookings(Array.isArray(data) ? data : [])).catch((requestError) => setError(getApiErrorMessage(requestError, 'Could not load your bookings.'))).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const visibleBookings = filter === 'ALL' ? bookings : bookings.filter((booking) => booking.bookingStatus === filter);

  async function cancelBooking() {
    if (!bookingToCancel) return;
    setIsCancelling(true);
    try {
      await bookingService.cancel(bookingToCancel.id);
      toast.success('Booking cancelled successfully.');
      setBookingToCancel(null);
      loadBookings();
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, 'The backend could not cancel this booking. It may be within the two-hour cancellation window.'));
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="customer-page">
      <CustomerNav />
      <main className="content-section bookings-page">
        <div className="section-heading"><div><p className="eyebrow">Your cinema history</p><h1>My bookings</h1><p className="muted">Keep track of every story you chose to see.</p></div><Link className="button button-primary browse-button" to="/">Browse movies</Link></div>
        <div className="booking-filters" role="tablist" aria-label="Filter bookings">{['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item === 'ALL' ? 'All bookings' : item.charAt(0) + item.slice(1).toLowerCase()}</button>)}</div>
        {isLoading && <div className="state-card"><div className="spinner" />Loading your bookings…</div>}
        {!isLoading && error && <div className="state-card"><XCircle size={32} /><h3>Unable to load bookings</h3><p>{error}</p><button className="button button-primary" onClick={loadBookings}>Try again</button></div>}
        {!isLoading && !error && !visibleBookings.length && <div className="state-card"><Ticket size={32} /><h3>{filter === 'ALL' ? 'No bookings yet' : `No ${filter.toLowerCase()} bookings`}</h3><p>When you book a movie, it will appear here.</p><Link className="button button-primary" to="/">Find a movie</Link></div>}
        {!isLoading && !error && Boolean(visibleBookings.length) && <div className="booking-list">{visibleBookings.map((booking) => <BookingCard key={booking.id} booking={booking} onCancel={setBookingToCancel} />)}</div>}
      </main>
      {bookingToCancel && <div className="modal-backdrop" role="presentation"><section className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title"><button className="modal-close" onClick={() => setBookingToCancel(null)} aria-label="Close"><X size={18} /></button><div className="modal-icon"><XCircle size={23} /></div><h2 id="cancel-title">Cancel this booking?</h2><p>This action cannot be undone. The backend will verify whether this booking is still eligible for cancellation.</p><div className="modal-actions"><button className="button button-secondary" onClick={() => setBookingToCancel(null)}>Keep booking</button><button className="button button-danger" disabled={isCancelling} onClick={cancelBooking}>{isCancelling ? 'Cancelling…' : 'Yes, cancel'}</button></div></section></div>}
    </div>
  );
}
