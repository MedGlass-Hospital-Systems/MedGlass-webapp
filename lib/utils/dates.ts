import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  formatDistanceToNow,
  getISOWeek,
  isWeekend,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";

/** Toutes les dates métier sont des chaînes "yyyy-MM-dd" interprétées en heure locale. */
export type ISODate = string;

export const toISODate = (d: Date): ISODate => format(d, "yyyy-MM-dd");
export const parseDate = (iso: string): Date => parseISO(iso);
export const todayISO = (): ISODate => toISODate(new Date());

export const addDaysISO = (iso: ISODate, n: number): ISODate => toISODate(addDays(parseISO(iso), n));
export const addMonthsISO = (iso: ISODate, n: number): ISODate => toISODate(addMonths(parseISO(iso), n));
export const daysBetween = (from: ISODate, to: ISODate) => differenceInCalendarDays(parseISO(to), parseISO(from));

export const weekStartISO = (iso: ISODate): ISODate => toISODate(startOfWeek(parseISO(iso), { weekStartsOn: 1 }));
export const monthStartISO = (iso: ISODate): ISODate => toISODate(startOfMonth(parseISO(iso)));
export const monthEndISO = (iso: ISODate): ISODate => toISODate(endOfMonth(parseISO(iso)));

/** 0 = lundi … 6 = dimanche */
export const weekdayIndex = (iso: ISODate) => (parseISO(iso).getDay() + 6) % 7;
export const isoWeekNumber = (iso: ISODate) => getISOWeek(parseISO(iso));

export const WEEKDAYS_SHORT = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];
export const WEEKDAYS_LONG = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export interface DayCell {
  date: ISODate;
  day: string;
  dayNum: string;
  isWeekend: boolean;
  isToday: boolean;
}

export function rangeDates(start: ISODate, end: ISODate): DayCell[] {
  const today = todayISO();
  return eachDayOfInterval({ start: parseISO(start), end: parseISO(end) }).map((d) => {
    const iso = toISODate(d);
    return {
      date: iso,
      day: WEEKDAYS_SHORT[(d.getDay() + 6) % 7],
      dayNum: format(d, "dd"),
      isWeekend: isWeekend(d),
      isToday: iso === today,
    };
  });
}

export const weekDates = (anyDay: ISODate) => {
  const start = weekStartISO(anyDay);
  return rangeDates(start, addDaysISO(start, 6));
};

export const monthDates = (anyDay: ISODate) => rangeDates(monthStartISO(anyDay), monthEndISO(anyDay));

/** Formatage français, ex. fmt("2026-05-04", "EEEE d MMMM") → "lundi 4 mai" */
export const fmt = (iso: string, pattern = "d MMM yyyy") => format(parseISO(iso), pattern, { locale: fr });

export function fmtRange(start: ISODate, end: ISODate) {
  if (start === end) return fmt(start, "d MMM yyyy");
  const sameYear = start.slice(0, 4) === end.slice(0, 4);
  return `${fmt(start, sameYear ? "d MMM" : "d MMM yyyy")} – ${fmt(end, "d MMM yyyy")}`;
}

export const fromNow = (iso: string) => formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: fr });

export const isBetween = (iso: ISODate, start: ISODate, end: ISODate) => iso >= start && iso <= end;

/** Durée d'un poste en heures (gère les postes de nuit qui passent minuit). */
export function durationHours(startTime: string, endTime: string) {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let diff = toMin(endTime) - toMin(startTime);
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
}
