function fmt(d) {
  return d.toISOString().split('T')[0];
}

function toDateSet(entries) {
  return new Set(entries.map((e) => e.date));
}

// الأيام المتتالية لحد اليوم (أو أمس لو اليوم لسا ما تسجل)
export function currentStreak(entries) {
  const dates = toDateSet(entries);
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!dates.has(fmt(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (dates.has(fmt(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// أطول سلسلة أيام متتالية بتاريخ العادة كله
export function longestStreak(entries) {
  if (entries.length === 0) return 0;
  const sorted = [...entries].map((e) => e.date).sort();
  let longest = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000;
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else if (diff > 1) {
      run = 1;
    }
  }
  return longest;
}

// نسبة الالتزام آخر N يوم
export function completionRate(entries, days = 7) {
  const dates = toDateSet(entries);
  let completed = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    if (dates.has(fmt(cursor))) completed++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return Math.round((completed / days) * 100);
}

// آخر N يوم كـ array من strings، من الأقدم للأحدث
export function lastNDays(n) {
  const days = [];
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    days.unshift(fmt(cursor));
    cursor.setDate(cursor.getDate() - 1);
  }
  return days;
}
