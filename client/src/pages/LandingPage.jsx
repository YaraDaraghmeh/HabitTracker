import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    { icon: '🔥', title: 'Streak Tracking', desc: 'Track your consecutive days and stay motivated to keep going' },
    { icon: '📊', title: 'Instant Stats', desc: 'Charts and details that show your commitment level at a glance' },
    { icon: '🔒', title: 'Your Own Account', desc: 'Your habits are saved just for you, behind a secure account' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="container" style={{ padding: '28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 20 }}>🔥 HabitTracker</div>
        {user ? (
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Dashboard</button>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" className="btn btn-ghost">Log In</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </nav>

      <section className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.2, marginBottom: 20, maxWidth: 700 }}>
          Build your habits, <span className="gradient-text">one day at a time</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-dim)', maxWidth: 520, marginBottom: 40 }}>
          A simple app to track your daily habits. It calculates your streak automatically and shows you exactly how consistent you've been.
        </p>
        <button className="btn btn-primary" onClick={() => navigate(user ? '/dashboard' : '/signup')}>
          Get Started →
        </button>
      </section>

      <section className="container" style={{ padding: '40px 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {features.map((f) => (
          <div key={f.title} className="card">
            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
