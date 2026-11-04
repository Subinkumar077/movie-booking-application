import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link className="brand" to="/"><span className="brand-mark"><Film size={18} /></span>REELRESERVE</Link>
        <div className="auth-visual-copy">
          <p className="eyebrow">Cinema, curated for you</p>
          <h1>Make tonight<br /><em>remarkable.</em></h1>
          <p>Discover stories worth seeing on the biggest screen.</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <p className="eyebrow">Welcome to ReelReserve</p>
          <h2>{title}</h2>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
