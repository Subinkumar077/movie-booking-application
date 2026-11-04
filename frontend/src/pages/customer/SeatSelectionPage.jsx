import { ArrowLeft, Armchair, Info, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import CustomerNav from '../../components/layout/CustomerNav';
import { bookingService } from '../../services/bookingService';
import { showService } from '../../services/showService';
import { useAuth } from '../../context/AuthContext';
import { getApiErrorMessage } from '../../utils/apiError';

const ROWS = 'ABCDEFGHIJ'.split('');
const SEATS_PER_ROW = 10;

function createSeatLayout(capacity) {
  const count = Math.max(1, Math.min(Number(capacity) || 50, 100));
  return Array.from({ length: Math.ceil(count / SEATS_PER_ROW) }, (_, rowIndex) => (
    Array.from({ length: Math.min(SEATS_PER_ROW, count - (rowIndex * SEATS_PER_ROW)) }, (_, seatIndex) => `${ROWS[rowIndex]}${seatIndex + 1}`)
  ));
}

export default function SeatSelectionPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([showService.list(), bookingService.byShow(showId)]).then(([showResponse, bookingResponse]) => {
      if (!active) return;
      const currentShow = (showResponse.data || []).find((item) => String(item.id) === String(showId));
      setShow(currentShow || null);
      const seats = (bookingResponse.data || [])
        .filter((booking) => booking.bookingStatus !== 'CANCELLED')
        .flatMap((booking) => Array.isArray(booking.seatNumbers) ? booking.seatNumbers : []);
      setOccupiedSeats(new Set(seats));
      if (!currentShow) setError('Show not found.');
    }).catch((requestError) => {
      if (active) setError(getApiErrorMessage(requestError, 'Could not load seat availability.'));
    }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [showId]);

  const layout = useMemo(() => createSeatLayout(show?.theater?.theaterCapacity), [show]);
  const total = (show?.price || 0) * selectedSeats.length;

  function toggleSeat(seat) {
    if (occupiedSeats.has(seat)) return;
    setSelectedSeats((current) => current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]);
  }

  async function createBooking() {
    if (!selectedSeats.length) return toast.error('Select at least one seat to continue.');
    if (!user?.userId) {
      return toast.error('Your account ID is not available. The backend must include userId in the login response before booking can be submitted.');
    }
    setIsBooking(true);
    try {
      const { data } = await bookingService.create({
        showId: Number(showId),
        userId: user.userId,
        noOfSeats: selectedSeats.length,
        seatNumbers: selectedSeats,
        bookingTime: new Date().toISOString().slice(0, 19),
        bookingStatus: 'PENDING',
      });
      navigate(`/booking/confirmation/${data.id}`, { state: { booking: data, show, selectedSeats } });
    } catch (requestError) {
      toast.error(getApiErrorMessage(requestError, 'Those seats could not be booked. They may have just been taken.'));
      setSelectedSeats([]);
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) return <div className="customer-page"><CustomerNav /><main className="page-shell"><div className="state-card"><div className="spinner" />Loading seats…</div></main></div>;
  if (error || !show) return <div className="customer-page"><CustomerNav /><main className="page-shell"><div className="state-card"><h2>{error || 'Show not found.'}</h2><Link className="button button-primary" to="/">Back to movies</Link></div></main></div>;

  return (
    <div className="customer-page">
      <CustomerNav />
      <main className="booking-page">
        <div className="booking-heading"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to showtimes</button><p className="eyebrow">Choose your seats</p><h1>{show.movie?.title || show.movie?.name || 'Movie'} <span>at {show.theater?.theaterName || 'the theater'}</span></h1><p className="muted">{show.showTime ? new Date(show.showTime).toLocaleString(undefined, { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Show time TBA'}</p></div>
        <div className="availability-note"><Info size={16} /> Availability is provisional. The backend confirms seats when you submit the booking.</div>
        <section className="seat-layout-card">
          <div className="screen"><span>SCREEN</span></div>
          <div className="seat-legend"><span><i className="seat available" /> Available</span><span><i className="seat selected" /> Selected</span><span><i className="seat unavailable" /> Unavailable</span></div>
          <div className="seat-grid">{layout.map((row, rowIndex) => <div className="seat-row" key={ROWS[rowIndex]}><span className="row-label">{ROWS[rowIndex]}</span>{row.map((seat) => <button key={seat} className={`seat ${occupiedSeats.has(seat) ? 'unavailable' : selectedSeats.includes(seat) ? 'selected' : 'available'}`} disabled={occupiedSeats.has(seat)} onClick={() => toggleSeat(seat)} aria-label={`${seat} ${occupiedSeats.has(seat) ? 'unavailable' : selectedSeats.includes(seat) ? 'selected' : 'available'}`}>{seat.slice(1)}</button>)}</div>)}</div>
        </section>
        <aside className="booking-summary"><div><p className="eyebrow">Your selection</p><h2><Ticket size={20} /> {selectedSeats.length} {selectedSeats.length === 1 ? 'ticket' : 'tickets'}</h2><p className="selected-seat-list">{selectedSeats.length ? selectedSeats.join(', ') : 'No seats selected'}</p></div><div className="summary-total"><span>Estimated total</span><strong>₹{total.toFixed(2)}</strong><small>Final price is calculated by the backend.</small></div><button className="button button-primary continue-booking" onClick={createBooking} disabled={isBooking}>{isBooking ? 'Confirming…' : 'Continue to booking'}</button></aside>
      </main>
    </div>
  );
}
