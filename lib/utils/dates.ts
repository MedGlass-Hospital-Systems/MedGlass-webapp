const dayLabels = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

export function getWeekDates(weekStart: Date) {
  const dates: { date: string; day: string; dayNum: string; isWeekend: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const dow = d.getDay();
    dates.push({
      date: iso,
      day: dayLabels[dow],
      dayNum: String(d.getDate()).padStart(2, "0"),
      isWeekend: dow === 0 || dow === 6,
    });
  }
  return dates;
}

export function getWeekStart(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export function formatWeekRange(weekStart: Date) {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  return `${fmt(weekStart)} – ${fmt(end)}`;
}

export function getISOWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
