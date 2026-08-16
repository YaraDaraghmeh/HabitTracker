import { useState } from 'react';

export default function AddHabitForm({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
      <input
        type="text"
        placeholder="New habit... e.g. Drink water, Read, Exercise"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ flex: 1 }}
      />
      <button type="submit" className="btn btn-primary">+ Add</button>
    </form>
  );
}
