import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { completionRate, currentStreak } from '../utils/streaks';

export default function StatsOverview({ habits }) {
  const data = habits.map((h) => ({
    name: h.name.length > 10 ? h.name.slice(0, 10) + '…' : h.name,
    rate: completionRate(h.entries || [], 7),
  }));

  const totalStreakDays = habits.reduce((sum, h) => sum + currentStreak(h.entries || []), 0);
  const avgRate = data.length ? Math.round(data.reduce((s, d) => s + d.rate, 0) / data.length) : 0;

  return (
    <div className="card" style={{ marginBottom: 32 }}>
      <h3 style={{ fontSize: 16, marginBottom: 20, color: 'var(--text-dim)' }}>Overview</h3>

      <div style={{ display: 'flex', gap: 32, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }} className="gradient-text">{habits.length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Active Habits</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{totalStreakDays}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Total Streak Days</div>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{avgRate}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Avg. Completion</div>
        </div>
      </div>

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a38" />
            <XAxis dataKey="name" stroke="#9a9aa8" fontSize={12} />
            <YAxis stroke="#9a9aa8" fontSize={12} unit="%" />
            <Tooltip
              contentStyle={{ background: '#1a1a24', border: '1px solid #2a2a38', borderRadius: 8 }}
              labelStyle={{ color: '#f4f4f6' }}
            />
            <Bar dataKey="rate" fill="#f72585" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
