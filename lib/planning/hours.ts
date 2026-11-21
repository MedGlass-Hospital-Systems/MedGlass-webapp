import type { Shift } from "@/lib/types/planning";
import { WORKED_TYPES } from "@/lib/utils/labels";
import { addDaysISO, durationHours, isBetween, weekStartISO } from "@/lib/utils/dates";

/** Heures comptabilisées pour un poste (les congés, RTT et astreintes non déplacées comptent 0). */
export const shiftHours = (s: Pick<Shift, "type" | "startTime" | "endTime">) =>
  WORKED_TYPES.includes(s.type) ? durationHours(s.startTime, s.endTime) : 0;

export function hoursInRange(shifts: Shift[], staffId: string, start: string, end: string) {
  return shifts
    .filter((s) => s.staffId === staffId && isBetween(s.date, start, end))
    .reduce((sum, s) => sum + shiftHours(s), 0);
}

export const weekHours = (shifts: Shift[], staffId: string, anyDay: string) => {
  const start = weekStartISO(anyDay);
  return hoursInRange(shifts, staffId, start, addDaysISO(start, 6));
};

/** Heures par semaine sur une période, pour les graphiques de décompte. */
export function hoursByWeek(shifts: Shift[], staffId: string, start: string, end: string) {
  const weeks: { weekStart: string; hours: number }[] = [];
  for (let w = weekStartISO(start); w <= end; w = addDaysISO(w, 7)) {
    weeks.push({ weekStart: w, hours: hoursInRange(shifts, staffId, w, addDaysISO(w, 6)) });
  }
  return weeks;
}
