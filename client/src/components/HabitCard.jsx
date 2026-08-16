import { currentStreak, longestStreak, completionRate, lastNDays } from '../utils/streaks';

export default function HabitCard({ habit, onToggle, onDelete }) {
  const entries = habit.entries || [];
  const streak = currentStreak(entries);
  const longest = longestStreak(entries);
  const rate = completionRate(entries, 7);
  const days = lastNDays(14);
  const doneSet = new Set(entries.map((e) => e.date));

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>{habit.name}</h3>
        <button
          onClick={() => onDelete(habit._id)}
          style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }} className="gradient-text">
            🔥 {streak}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Current Streak</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{longest}</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Longest Streak</div>
        </div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>{rate}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Last 7 Days</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {days.map((d) => {
          const isDone = doneSet.has(d);
          return (
            <button
              key={d}
              onClick={() => onToggle(habit._id, d)}
              title={d}
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: isDone ? 'var(--gradient)' : 'var(--bg)',
                outline: isDone ? 'none' : '1px solid var(--border)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
