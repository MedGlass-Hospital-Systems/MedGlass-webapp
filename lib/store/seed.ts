/**
 * Chargement des données de démo depuis /data/mocks/*.json.
 *
 * Les JSON sont écrits autour d'une semaine de référence (meta.anchorWeek).
 * Au chargement, toutes les dates sont décalées pour que cette semaine
 * corresponde à la semaine courante : la démo a toujours du contenu « aujourd'hui ».
 */
import meta from "@/data/mocks/meta.json";
import servicesJson from "@/data/mocks/services.json";
import staffJson from "@/data/mocks/staff.json";
import shiftsJson from "@/data/mocks/shifts.json";
import conflictsJson from "@/data/mocks/conflicts.json";
import leavesJson from "@/data/mocks/leaves.json";
import swapsJson from "@/data/mocks/swaps.json";
import rulesJson from "@/data/mocks/rules.json";
import planningsJson from "@/data/mocks/plannings.json";
import wishesJson from "@/data/mocks/wishes.json";
import jobsJson from "@/data/mocks/jobs.json";
import candidatesJson from "@/data/mocks/candidates.json";
import openShiftsJson from "@/data/mocks/openShifts.json";
import notificationsJson from "@/data/mocks/notifications.json";

import type {
  Conflict,
  LeaveRequest,
  Planning,
  Rule,
  Service,
  Shift,
  Staff,
  SwapRequest,
  Wish,
} from "@/lib/types/planning";
import type { Candidate, InternalApplication, JobRole, OpenShift } from "@/lib/types/recruitment";
import type { AppNotification } from "@/lib/types/notifications";
import { addDaysISO, daysBetween, todayISO, weekStartISO } from "@/lib/utils/dates";

export const SEED_VERSION = meta.version;
export const ME_ID = meta.meId;
export const HOSPITAL = meta.hospital;

export interface DemoData {
  services: Service[];
  staff: Staff[];
  shifts: Shift[];
  conflicts: Conflict[];
  leaves: LeaveRequest[];
  swaps: SwapRequest[];
  rules: Rule[];
  plannings: Planning[];
  wishes: Wish[];
  jobs: JobRole[];
  candidates: Candidate[];
  openShifts: OpenShift[];
  internalApplications: InternalApplication[];
  notifications: AppNotification[];
}

const ISO_PREFIX = /^\d{4}-\d{2}-\d{2}/;

/** Décale récursivement toutes les dates ISO ("yyyy-MM-dd…") d'un objet. */
export function rebaseDates<T>(value: T, offsetDays: number): T {
  if (offsetDays === 0) return value;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string" && ISO_PREFIX.test(v)) {
      return addDaysISO(v.slice(0, 10), offsetDays) + v.slice(10);
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, walk(val)]));
    }
    return v;
  };
  return walk(value) as T;
}

export const currentWeek = () => weekStartISO(todayISO());

export function buildSeed(): DemoData & { seedWeek: string } {
  const raw: DemoData = {
    services: servicesJson as Service[],
    staff: staffJson as Staff[],
    shifts: shiftsJson as Shift[],
    conflicts: conflictsJson as Conflict[],
    leaves: leavesJson as LeaveRequest[],
    swaps: swapsJson as SwapRequest[],
    rules: rulesJson as Rule[],
    plannings: planningsJson as Planning[],
    wishes: wishesJson as Wish[],
    jobs: jobsJson as JobRole[],
    candidates: candidatesJson as Candidate[],
    openShifts: openShiftsJson as OpenShift[],
    internalApplications: [],
    notifications: notificationsJson as AppNotification[],
  };
  const week = currentWeek();
  return { ...rebaseDates(raw, daysBetween(meta.anchorWeek, week)), seedWeek: week };
}
