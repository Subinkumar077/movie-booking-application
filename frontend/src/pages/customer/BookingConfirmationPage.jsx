import { CheckCircle2, Clock3, MapPin, Ticket } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import CustomerNav from '../../components/layout/CustomerNav';

export default function BookingConfirmationPage() {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const booking = state?.booking;
  const show = state?.show || booking?.show;
  const seats = state?.selectedSeats || booking?.seatNumbers || [];

  return (
    <div className="customer-page"><CustomerNav /><main className="confirmation-page"><div className="confirmation-icon"><CheckCircle2 size={38} /></div><p className="eyebrow">Booking received</p><h1>Your seats are waiting.</h1><p className="muted">Your booking has been submitted to the theater. Keep this reference for your records.</p><section className="confirmation-card"><div className="confirmation-header"><span>Booking reference</span><strong>#{booking?.id || bookingId}</strong></div><div className="confirmation-details"><div><Ticket size={17} /><span><small>Seats</small><strong>{seats.length ? seats.join(', ') : 'See booking details'}</strong></span></div><div><MapPin size={17} /><span><small>Theater</small><strong>{show?.theater?.theaterName || 'Theater details unavailable'}</strong></span></div><div><Clock3 size={17} /><span><small>Status</small><strong>{booking?.bookingStatus || 'PENDING'}</strong></span></div></div>{booking?.price != null && <div className="confirmation-total"><span>Total</span><strong>₹{Number(booking.price).toFixed(2)}</strong></div>}</section><div className="confirmation-actions"><Link className="button button-primary" to="/my-bookings">View my bookings</Link><Link className="text-link" to="/">Discover more movies <span>→</span></Link></div></main></div>
  );
}
