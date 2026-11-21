/**
 * Générateur de planning de démonstration.
 * Applique des cycles de travail réalistes par métier, puis les congés validés,
 * les souhaits (congés, absences, préférences) saisis par l'équipe.
 * Ce n'est pas un solveur : il sert à illustrer le parcours de l'assistant.
 */
import type { LeaveRequest, Planning, Shift, ShiftType, Staff, Wish, WishSlot } from "@/lib/types/planning";
import { isDoctor } from "@/lib/utils/labels";
import { daysBetween, isBetween, rangeDates, weekStartISO, weekdayIndex } from "@/lib/utils/dates";
import { hoursByWeek, shiftHours } from "./hours";

type Template = { startTime: string; endTime: string; type: ShiftType; slot: WishSlot };

const T: Record<string, Template> = {
  J12: { startTime: "07:00", endTime: "19:00", type: "jour", slot: "matin" },
  N12: { startTime: "19:00", endTime: "07:00", type: "nuit", slot: "nuit" },
  M8: { startTime: "07:00", endTime: "15:00", type: "jour", slot: "matin" },
  S8: { startTime: "13:00", endTime: "21:00", type: "jour", slot: "apres-midi" },
  N8: { startTime: "21:00", endTime: "07:00", type: "nuit", slot: "nuit" },
  MED: { startTime: "08:00", endTime: "18:00", type: "jour", slot: "matin" },
  CAD: { startTime: "08:00", endTime: "16:00", type: "jour", slot: "matin" },
  ADM: { startTime: "09:00", endTime: "17:00", type: "admin", slot: "matin" },
  SEC: { startTime: "08:30", endTime: "16:30", type: "admin", slot: "matin" },
  GARDE: { startTime: "18:30", endTime: "08:30", type: "garde", slot: "nuit" },
  ASTR: { startTime: "08:00", endTime: "20:00", type: "astreinte", slot: "matin" },
};

const IDE_CYCLE = ["J12", "J12", null, null, "N12", "N12", null, null, "J12", "J12", "J12", null, null, null];
const AS_CYCLE = ["M8", "M8", "S8", "S8", null, null, "M8"];
const mod = (a: number, n: number) => ((a % n) + n) % n;

function baseTemplate(person: Staff, index: number, dayOffset: number): string | null {
  const w = mod(dayOffset, 7);
  const k = Math.floor(dayOffset / 7);
  if (person.role === "ide") return IDE_CYCLE[mod(dayOffset + index * 3, 14)];
  if (person.role === "as") return AS_CYCLE[mod(dayOffset + index * 3, 7)];
  if (person.role === "secretaire") return w <= 4 ? "SEC" : null;
  if (person.role === "cadre") return w === 2 ? "ADM" : w <= 4 ? "CAD" : null;
  if (isDoctor(person.role)) {
    if (w <= 4) return w === mod(k + index, 5) ? "GARDE" : "MED";
    return w === 5 + mod(k + index, 2) && mod(k + index, 2) === 0 ? "ASTR" : null;
  }
  return null;
}

function templateForSlot(person: Staff, slot: WishSlot): string {
  if (slot === "nuit") return isDoctor(person.role) ? "GARDE" : person.role === "as" ? "N8" : "N12";
  if (slot === "apres-midi") return person.role === "as" ? "S8" : person.role === "ide" ? "J12" : "MED";
  return person.role === "as" ? "M8" : person.role === "ide" ? "J12" : isDoctor(person.role) ? "MED" : "CAD";
}

export interface GenerationStats {
  staffCount: number;
  shiftCount: number;
  plannedHours: number;
  overtimeHours: number;
  coverage: number;
  equity: number;
  wishesApplied: number;
}

export interface GenerationInput {
  planning: Planning;
  team: Staff[];
  wishes: Wish[];
  leaves: LeaveRequest[];
}

export function generatePlanningShifts({ planning, team, wishes, leaves }: GenerationInput) {
  const days = rangeDates(planning.startDate, planning.endDate);
  const shifts: Shift[] = [];
  let wishesApplied = 0;

  team.forEach((person, index) => {
    const wish = wishes.find((w) => w.staffId === person.id && w.planningId === planning.id);
    const validatedLeaves = leaves.filter((l) => l.staffId === person.id && l.status === "valide");

    for (const day of days) {
      const offset = daysBetween(weekStartISO(planning.startDate), day.date);
      const id = `sh-${planning.id}-${person.id}-${day.date}`;
      const push = (t: Template | { startTime: string; endTime: string; type: ShiftType }) =>
        shifts.push({
          id,
          staffId: person.id,
          date: day.date,
          startTime: t.startTime,
          endTime: t.endTime,
          type: t.type,
          service: planning.serviceId,
          planningId: planning.id,
        });

      const onLeave =
        validatedLeaves.some((l) => isBetween(day.date, l.startDate, l.endDate)) ||
        wish?.leaves.some((l) => isBetween(day.date, l.startDate, l.endDate));
      if (onLeave) {
        push({ startTime: "00:00", endTime: "23:59", type: "conges" });
        continue;
      }
      if (wish?.absences.some((a) => isBetween(day.date, a.startDate, a.endDate))) {
        wishesApplied++;
        continue;
      }

      const key = baseTemplate(person, index, offset);
      const tpl = key ? T[key] : null;
      const prefs = wish?.preferences.filter((p) => p.weekday === weekdayIndex(day.date)) ?? [];

      if (tpl && prefs.some((p) => p.level === "eviter" && p.slot === tpl.slot)) {
        wishesApplied++;
        continue;
      }
      if (!tpl) {
        const wanted = prefs.find((p) => p.level === "prioritaire");
        if (wanted) {
          wishesApplied++;
          push(T[templateForSlot(person, wanted.slot)]);
        }
        continue;
      }
      push(tpl);
    }
  });

  return { shifts, stats: computeStats(shifts, team, planning, wishesApplied) };
}

export function computeStats(shifts: Shift[], team: Staff[], planning: Planning, wishesApplied = 0): GenerationStats {
  const plannedHours = shifts.reduce((s, sh) => s + shiftHours(sh), 0);

  let overtimeHours = 0;
  for (const person of team) {
    for (const w of hoursByWeek(shifts, person.id, planning.startDate, planning.endDate)) {
      overtimeHours += Math.max(0, w.hours - person.contractedHours);
    }
  }

  const days = rangeDates(planning.startDate, planning.endDate);
  const covered = days.filter((d) => {
    const dayShifts = shifts.filter((s) => s.date === d.date);
    return dayShifts.some((s) => s.type === "jour") && dayShifts.some((s) => s.type === "nuit" || s.type === "garde");
  }).length;

  const gardes = team
    .filter((p) => isDoctor(p.role))
    .map((p) => shifts.filter((s) => s.staffId === p.id && s.type === "garde").length);
  const max = Math.max(0, ...gardes);
  const min = gardes.length ? Math.min(...gardes) : 0;

  return {
    staffCount: team.length,
    shiftCount: shifts.filter((s) => s.type !== "conges").length,
    plannedHours: Math.round(plannedHours),
    overtimeHours: Math.round(overtimeHours),
    coverage: days.length ? Math.round((covered / days.length) * 100) : 0,
    equity: max === 0 ? 100 : Math.round(100 - ((max - min) / max) * 100),
    wishesApplied,
  };
}
