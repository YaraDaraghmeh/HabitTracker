import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getHabits, createHabit, deleteHabit, getEntries, toggleEntry } from '../api/habits';
import { useAuth } from '../context/AuthContext';
import AddHabitForm from '../components/AddHabitForm';
import HabitCard from '../components/HabitCard';
import StatsOverview from '../components/StatsOverview';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    const habitsData = await getHabits();
    const withEntries = await Promise.all(
      habitsData.map(async (h) => ({ ...h, entries: await getEntries(h._id) }))
    );
    setHabits(withEntries);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (name) => {
    await createHabit(name);
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteHabit(id);
    loadData();
  };

  const handleToggle = async (habitId, date) => {
    await toggleEntry(habitId, date);
    loadData();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav className="container" style={{ padding: '28px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 20 }}>🔥 HabitTracker</Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>Hi, {user?.name}</span>
          <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '8px 18px', fontSize: 14 }}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="container" style={{ padding: '0 24px 80px', maxWidth: 700 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>My Habits</h1>

        <AddHabitForm onAdd={handleAdd} />

        {loading ? (
          <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
        ) : habits.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            You haven't added any habits yet. Add your first one above 👆
          </div>
        ) : (
          <>
            <StatsOverview habits={habits} />
            {habits.map((h) => (
              <HabitCard key={h._id} habit={h} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
