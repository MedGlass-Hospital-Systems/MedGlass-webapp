import type { Shift, PlanningGap, LeaveRequest, SwapRequest } from "@/lib/types/planning";

export const currentWeekShifts: Shift[] = [
  // Dr. Jenkins (s1) — Practitioner
  { id: "sh1", staffId: "s1", date: "2026-05-04", startTime: "07:00", endTime: "19:00", type: "jour", service: "chir-gen" },
  { id: "sh2", staffId: "s1", date: "2026-05-05", startTime: "07:00", endTime: "19:00", type: "jour", service: "chir-gen" },
  { id: "sh3", staffId: "s1", date: "2026-05-07", startTime: "09:00", endTime: "17:00", type: "admin", service: "chir-gen" },
  { id: "sh4", staffId: "s1", date: "2026-05-08", startTime: "07:00", endTime: "19:00", type: "jour", service: "chir-gen" },

  // Dr. Wei (s2) — Intern
  { id: "sh5", staffId: "s2", date: "2026-05-05", startTime: "19:00", endTime: "07:00", type: "nuit", service: "chir-gen" },
  { id: "sh6", staffId: "s2", date: "2026-05-06", startTime: "19:00", endTime: "07:00", type: "nuit", service: "chir-gen" },
  { id: "sh7", staffId: "s2", date: "2026-05-09", startTime: "00:00", endTime: "23:59", type: "garde", service: "chir-gen" },

  // Élise Kovacs (s3) — Head Nurse
  { id: "sh8", staffId: "s3", date: "2026-05-04", startTime: "07:00", endTime: "15:00", type: "jour", service: "chir-gen" },
  { id: "sh9", staffId: "s3", date: "2026-05-05", startTime: "07:00", endTime: "15:00", type: "jour", service: "chir-gen" },
  { id: "sh10", staffId: "s3", date: "2026-05-06", startTime: "07:00", endTime: "15:00", type: "jour", service: "chir-gen" },

  // Camille Roux (s6) — Nurse
  { id: "sh11", staffId: "s6", date: "2026-05-04", startTime: "15:00", endTime: "23:00", type: "jour", service: "chir-gen" },
  { id: "sh12", staffId: "s6", date: "2026-05-05", startTime: "15:00", endTime: "23:00", type: "jour", service: "chir-gen" },
  { id: "sh13", staffId: "s6", date: "2026-05-08", startTime: "00:00", endTime: "23:59", type: "conges", service: "chir-gen" },
  { id: "sh14", staffId: "s6", date: "2026-05-09", startTime: "00:00", endTime: "23:59", type: "conges", service: "chir-gen" },

  // Nathan Berger (s7) — Nursing Assistant
  { id: "sh15", staffId: "s7", date: "2026-05-04", startTime: "07:00", endTime: "15:00", type: "jour", service: "chir-gen" },
  { id: "sh16", staffId: "s7", date: "2026-05-06", startTime: "07:00", endTime: "15:00", type: "jour", service: "chir-gen" },
  { id: "sh17", staffId: "s7", date: "2026-05-07", startTime: "23:00", endTime: "07:00", type: "nuit", service: "chir-gen" },
];

export const planningGaps: PlanningGap[] = [
  {
    id: "g1",
    date: "2026-05-07",
    service: "chir-gen",
    shift: "Garde 19h-07h",
    severity: "critique",
    reason: "Aucun praticien disponible",
  },
  {
    id: "g2",
    date: "2026-05-08",
    service: "chir-gen",
    shift: "Bloc opératoire matin",
    severity: "elevee",
    reason: "1 IDE manquant",
  },
  {
    id: "g3",
    date: "2026-05-10",
    service: "chir-gen",
    shift: "Astreinte weekend",
    severity: "moyenne",
    reason: "Couverture incomplète",
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: "lr1",
    staffId: "s6",
    startDate: "2026-05-08",
    endDate: "2026-05-09",
    type: "conges",
    status: "valide",
  },
  {
    id: "lr2",
    staffId: "s5",
    startDate: "2026-05-12",
    endDate: "2026-05-16",
    type: "conges",
    status: "en-attente",
    reason: "Congés annuels",
  },
  {
    id: "lr3",
    staffId: "s2",
    startDate: "2026-05-20",
    endDate: "2026-05-20",
    type: "formation",
    status: "valide",
    reason: "DPC échographie",
  },
];

export const swapRequests: SwapRequest[] = [
  {
    id: "sw1",
    fromStaffId: "s2",
    toStaffId: "s8",
    shiftId: "sh7",
    status: "en-attente",
    createdAt: "2026-05-02",
  },
];

export function getShiftsForStaff(staffId: string, dates: string[]) {
  return currentWeekShifts.filter(
    (s) => s.staffId === staffId && dates.includes(s.date),
  );
}
