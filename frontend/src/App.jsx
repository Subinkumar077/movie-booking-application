import { Link, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/customer/HomePage';
import MovieDetailsPage from './pages/customer/MovieDetailsPage';
import SeatSelectionPage from './pages/customer/SeatSelectionPage';
import BookingConfirmationPage from './pages/customer/BookingConfirmationPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function Placeholder({ title, description }) {
  return (
    <main className="page-shell">
      <p className="eyebrow">ReelReserve</p>
      <h1>{title}</h1>
      <p className="muted">{description}</p>
      <Link className="button button-primary" to="/">Return home</Link>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies/:id" element={<MovieDetailsPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/booking/seats/:showId" element={<SeatSelectionPage />} />
        <Route path="/booking/confirmation/:bookingId" element={<BookingConfirmationPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/movies" element={<AdminDashboard section="movies" />} />
        <Route path="/admin/theaters" element={<AdminDashboard section="theaters" />} />
        <Route path="/admin/shows" element={<AdminDashboard section="shows" />} />
        <Route path="/admin/bookings" element={<AdminDashboard section="bookings" />} />
      </Route>
      <Route path="*" element={<Placeholder title="Page not found" description="That destination does not exist." />} />
    </Routes>
  );
}

export default App;
