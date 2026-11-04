import { Film, LogIn, LogOut, Search, Ticket, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function CustomerNav({ searchValue = '', onSearch }) {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    signOut();
    toast.success('You have been signed out.');
    navigate('/');
  }

  return (
    <header className="site-nav">
      <Link className="brand" to="/"><span className="brand-mark"><Film size={18} /></span>REELRESERVE</Link>
      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <a href="#movies">Movies</a>
        {isAuthenticated && <Link to="/my-bookings"><Ticket size={16} /> My bookings</Link>}
      </nav>
      <div className="nav-actions">
        {onSearch && <label className="nav-search"><Search size={16} /><input value={searchValue} onChange={(event) => onSearch(event.target.value)} placeholder="Search movies" aria-label="Search movies" /></label>}
        {isAuthenticated ? (
          <>
            <span className="user-chip"><UserRound size={15} /> {user.username}</span>
            <button className="nav-icon-button" onClick={handleLogout} aria-label="Sign out"><LogOut size={18} /></button>
          </>
        ) : <Link className="nav-login" to="/login"><LogIn size={16} /> Sign in</Link>}
      </div>
    </header>
  );
}
