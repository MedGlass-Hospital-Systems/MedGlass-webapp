"use client";

/**
 * Store de la démo : point d'accès unique aux données de l'application.
 * - Données initiales : /data/mocks/*.json (voir seed.ts)
 * - Persistance : localStorage (clé "medglass-demo"), réinitialisable depuis les Réglages.
 * - Pour brancher un vrai backend, remplacer le corps des actions par des appels API.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AppRole,
  LeaveRequest,
  Planning,
  Rule,
  Shift,
  Staff,
  SwapRequest,
  Wish,
} from "@/lib/types/planning";
import type { ApplicationStage, Candidate, JobRole, OpenShift } from "@/lib/types/recruitment";
import type { AppNotification, NotificationChannel, NotificationPrefs, NotificationType } from "@/lib/types/notifications";
import { ME_ID, SEED_VERSION, buildSeed, currentWeek, rebaseDates, type DemoData } from "./seed";
import { generatePlanningShifts, type GenerationStats } from "@/lib/planning/generator";
import { newId } from "@/lib/utils/id";
import { daysBetween, fmt, isBetween, rangeDates, todayISO } from "@/lib/utils/dates";

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  mail: { app: true, email: true },
  poste: { app: true, email: true },
  planning: { app: true, email: false },
  souhaits: { app: true, email: true },
  demande: { app: true, email: false },
};

interface DemoState extends DemoData {
  version: number;
  seedWeek: string;
  meId: string;
  impersonatingId: string | null;
  favorites: string[];
  notificationPrefs: Record<string, NotificationPrefs>;
  tutorials: { welcome: boolean; generation: boolean };
  lastGeneration: Record<string, GenerationStats>;
}

interface DemoActions {
  resetDemo: () => void;
  realignDates: () => void;
  impersonate: (staffId: string | null) => void;
  setTutorialSeen: (key: keyof DemoState["tutorials"], seen: boolean) => void;

  addStaff: (input: Omit<Staff, "id">) => string;
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  setAppRole: (id: string, role: AppRole) => void;

  addLeave: (input: Omit<LeaveRequest, "id" | "status" | "createdAt">, autoValidate?: boolean) => void;
  decideLeave: (id: string, status: "valide" | "refuse") => void;
  addSwap: (input: Omit<SwapRequest, "id" | "status" | "createdAt">) => void;
  decideSwap: (id: string, status: "accepte" | "refuse") => void;

  addRule: (input: Omit<Rule, "id">) => void;
  toggleRule: (id: string) => void;
  removeRule: (id: string) => void;

  resolveConflict: (conflictId: string, staffId: string) => void;
  publishConflictToBourse: (conflictId: string) => void;

  addOpenShift: (input: Omit<OpenShift, "id" | "status" | "postedAt" | "applicants" | "takenBy">) => void;
  toggleVolunteer: (openShiftId: string, staffId: string) => void;
  assignOpenShift: (openShiftId: string, staffId: string) => void;

  addJob: (input: Omit<JobRole, "id" | "status" | "postedAt">) => void;
  closeJob: (id: string) => void;
  moveCandidate: (id: string, stage: ApplicationStage) => void;
  updateCandidate: (id: string, patch: Partial<Candidate>) => void;
  toggleFavorite: (candidateId: string) => void;
  applyInternal: (jobId: string, staffId: string, message: string) => void;

  notify: (n: Omit<AppNotification, "id" | "createdAt" | "read">) => void;
  markNotificationRead: (id: string, read?: boolean) => void;
  markAllRead: (userId: string) => void;
  setNotificationPref: (userId: string, type: NotificationType, channel: NotificationChannel, value: boolean) => void;

  createPlanning: (input: Pick<Planning, "name" | "serviceId" | "period" | "startDate" | "endDate">) => string;
  updatePlanning: (id: string, patch: Partial<Planning>) => void;
  requestWishes: (planningId: string, staffIds: string[], deadline: string) => void;
  submitWish: (wish: Omit<Wish, "id" | "submittedAt">) => void;
  generatePlanning: (planningId: string) => GenerationStats | null;
  publishPlanning: (planningId: string) => void;
  deletePlanning: (planningId: string) => void;
}

export type DemoStore = DemoState & DemoActions;

const nowISO = () => new Date().toISOString().slice(0, 19);

function initialState(): DemoState {
  return {
    ...buildSeed(),
    version: SEED_VERSION,
    meId: ME_ID,
    impersonatingId: null,
    favorites: ["c1", "c6"],
    notificationPrefs: {},
    tutorials: { welcome: false, generation: false },
    lastGeneration: {},
  };
}

const fullName = (s?: Staff) => (s ? `${s.firstName} ${s.lastName}` : "Un collaborateur");

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => {
      const staffById = (id: string) => get().staff.find((s) => s.id === id);
      const managerOf = (serviceId: string) => get().services.find((s) => s.id === serviceId)?.managerId ?? get().meId;

      const pushNotification = (n: Omit<AppNotification, "id" | "createdAt" | "read">) =>
        set((st) => ({
          notifications: [{ ...n, id: newId("n"), createdAt: nowISO(), read: false }, ...st.notifications],
        }));

      /** Remplace les postes d'une personne sur une période par une absence. */
      const applyAbsence = (staffId: string, start: string, end: string, type: Shift["type"]) =>
        set((st) => {
          const person = st.staff.find((s) => s.id === staffId);
          const kept = st.shifts.filter((s) => !(s.staffId === staffId && isBetween(s.date, start, end)));
          const added: Shift[] = rangeDates(start, end).map((d) => ({
            id: newId("sh"),
            staffId,
            date: d.date,
            startTime: "00:00",
            endTime: "23:59",
            type,
            service: person?.service ?? "",
            planningId: null,
          }));
          return { shifts: [...kept, ...added] };
        });

      const addShiftFromSlot = (staffId: string, date: string, slot: { startTime: string; endTime: string; type: Shift["type"] }, service: string) =>
        set((st) => ({
          shifts: [
            ...st.shifts.filter((s) => !(s.staffId === staffId && s.date === date)),
            { id: newId("sh"), staffId, date, ...slot, service, planningId: null },
          ],
        }));

      return {
        ...initialState(),

        resetDemo: () => set(initialState()),

        realignDates: () => {
          const week = currentWeek();
          const offset = daysBetween(get().seedWeek, week);
          if (offset === 0) return;
          const st = get();
          const data: DemoData = {
            services: st.services,
            staff: st.staff,
            shifts: st.shifts,
            conflicts: st.conflicts,
            leaves: st.leaves,
            swaps: st.swaps,
            rules: st.rules,
            plannings: st.plannings,
            wishes: st.wishes,
            jobs: st.jobs,
            candidates: st.candidates,
            openShifts: st.openShifts,
            internalApplications: st.internalApplications,
            notifications: st.notifications,
          };
          set({ ...rebaseDates(data, offset), seedWeek: week });
        },

        impersonate: (staffId) => set({ impersonatingId: staffId && staffId !== get().meId ? staffId : null }),
        setTutorialSeen: (key, seen) => set((st) => ({ tutorials: { ...st.tutorials, [key]: seen } })),

        addStaff: (input) => {
          const id = newId("s");
          set((st) => ({ staff: [...st.staff, { ...input, id }] }));
          return id;
        },
        updateStaff: (id, patch) => set((st) => ({ staff: st.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
        setAppRole: (id, role) => set((st) => ({ staff: st.staff.map((s) => (s.id === id ? { ...s, appRole: role } : s)) })),

        addLeave: (input, autoValidate = false) => {
          const id = newId("lr");
          const leave: LeaveRequest = { ...input, id, status: "en-attente", createdAt: todayISO() };
          set((st) => ({ leaves: [leave, ...st.leaves] }));
          const person = staffById(input.staffId);
          if (autoValidate) {
            get().decideLeave(id, "valide");
            return;
          }
          pushNotification({
            userId: managerOf(person?.service ?? ""),
            type: "demande",
            title: "Nouvelle demande d'absence",
            body: `${fullName(person)} demande une absence du ${fmt(input.startDate, "d MMM")} au ${fmt(input.endDate, "d MMM")}.`,
            link: "/demandes",
          });
        },

        decideLeave: (id, status) => {
          const leave = get().leaves.find((l) => l.id === id);
          if (!leave) return;
          set((st) => ({ leaves: st.leaves.map((l) => (l.id === id ? { ...l, status } : l)) }));
          if (status === "valide") {
            applyAbsence(leave.staffId, leave.startDate, leave.endDate, leave.type === "rtt" ? "rtt" : leave.type === "formation" ? "formation" : "conges");
            if (leave.type === "conges" || leave.type === "rtt") {
              const days = rangeDates(leave.startDate, leave.endDate).filter((d) => !d.isWeekend).length;
              const person = staffById(leave.staffId);
              if (person) {
                const key = leave.type;
                get().updateStaff(person.id, {
                  leaveBalance: { ...person.leaveBalance, [key]: Math.max(0, person.leaveBalance[key] - days) },
                });
              }
            }
          }
          pushNotification({
            userId: leave.staffId,
            type: "demande",
            title: status === "valide" ? "Absence validée" : "Absence refusée",
            body: `Votre demande du ${fmt(leave.startDate, "d MMM")} au ${fmt(leave.endDate, "d MMM")} a été ${status === "valide" ? "validée" : "refusée"}.`,
            link: "/demandes",
          });
        },

        addSwap: (input) => {
          set((st) => ({ swaps: [{ ...input, id: newId("sw"), status: "en-attente", createdAt: todayISO() }, ...st.swaps] }));
          const shift = get().shifts.find((s) => s.id === input.shiftId);
          pushNotification({
            userId: input.toStaffId,
            type: "demande",
            title: "Demande d'échange",
            body: `${fullName(staffById(input.fromStaffId))} vous propose de reprendre son poste${shift ? ` du ${fmt(shift.date, "EEEE d MMM")}` : ""}.`,
            link: "/demandes",
          });
        },

        decideSwap: (id, status) => {
          const swap = get().swaps.find((s) => s.id === id);
          if (!swap) return;
          set((st) => ({
            swaps: st.swaps.map((s) => (s.id === id ? { ...s, status } : s)),
            shifts:
              status === "accepte"
                ? st.shifts.map((s) => (s.id === swap.shiftId ? { ...s, staffId: swap.toStaffId } : s))
                : st.shifts,
          }));
          pushNotification({
            userId: swap.fromStaffId,
            type: "demande",
            title: status === "accepte" ? "Échange accepté" : "Échange refusé",
            body: `${fullName(staffById(swap.toStaffId))} a ${status === "accepte" ? "accepté" : "refusé"} votre proposition d'échange.`,
            link: "/demandes",
          });
        },

        addRule: (input) => set((st) => ({ rules: [...st.rules, { ...input, id: newId("r") }] })),
        toggleRule: (id) => set((st) => ({ rules: st.rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)) })),
        removeRule: (id) => set((st) => ({ rules: st.rules.filter((r) => r.id !== id) })),

        resolveConflict: (conflictId, staffId) => {
          const c = get().conflicts.find((x) => x.id === conflictId);
          if (!c) return;
          addShiftFromSlot(staffId, c.date, c.slot, c.service);
          set((st) => ({
            conflicts: st.conflicts.map((x) => (x.id === conflictId ? { ...x, status: "resolu", resolvedBy: staffId } : x)),
            openShifts: st.openShifts.map((o) =>
              o.conflictId === conflictId ? { ...o, status: "pourvu", takenBy: staffId } : o,
            ),
          }));
          pushNotification({
            userId: staffId,
            type: "planning",
            title: "Nouveau poste attribué",
            body: `${c.label} le ${fmt(c.date, "EEEE d MMMM")} vous a été attribué.`,
            link: `/planning?date=${c.date}`,
          });
        },

        publishConflictToBourse: (conflictId) => {
          const c = get().conflicts.find((x) => x.id === conflictId);
          if (!c || get().openShifts.some((o) => o.conflictId === conflictId)) return;
          get().addOpenShift({
            conflictId,
            date: c.date,
            ...c.slot,
            service: c.service,
            requiredRole: c.requiredRole,
            bonus: c.severity === "critique" ? "Indemnité majorée" : null,
          });
        },

        addOpenShift: (input) => {
          set((st) => ({
            openShifts: [
              { ...input, id: newId("os"), status: "ouvert", postedAt: todayISO(), applicants: [], takenBy: null },
              ...st.openShifts,
            ],
          }));
          const targets = get().staff.filter((s) => s.service === input.service && s.role === input.requiredRole);
          targets.forEach((t) =>
            pushNotification({
              userId: t.id,
              type: "poste",
              title: "Nouveau créneau à pourvoir",
              body: `Un poste du ${fmt(input.date, "EEEE d MMM")} (${input.startTime}–${input.endTime}) est ouvert dans la bourse.`,
              link: "/recruitment?onglet=bourse",
            }),
          );
        },

        toggleVolunteer: (openShiftId, staffId) =>
          set((st) => ({
            openShifts: st.openShifts.map((o) =>
              o.id === openShiftId
                ? {
                    ...o,
                    applicants: o.applicants.includes(staffId)
                      ? o.applicants.filter((a) => a !== staffId)
                      : [...o.applicants, staffId],
                  }
                : o,
            ),
          })),

        assignOpenShift: (openShiftId, staffId) => {
          const o = get().openShifts.find((x) => x.id === openShiftId);
          if (!o) return;
          if (o.conflictId) {
            get().resolveConflict(o.conflictId, staffId);
          } else {
            addShiftFromSlot(staffId, o.date, { startTime: o.startTime, endTime: o.endTime, type: o.type }, o.service);
            pushNotification({
              userId: staffId,
              type: "planning",
              title: "Créneau attribué",
              body: `Le créneau du ${fmt(o.date, "EEEE d MMMM")} vous a été attribué.`,
              link: `/planning?date=${o.date}`,
            });
          }
          set((st) => ({
            openShifts: st.openShifts.map((x) => (x.id === openShiftId ? { ...x, status: "pourvu", takenBy: staffId } : x)),
          }));
        },

        addJob: (input) => set((st) => ({ jobs: [{ ...input, id: newId("j"), status: "ouvert", postedAt: todayISO() }, ...st.jobs] })),
        closeJob: (id) => set((st) => ({ jobs: st.jobs.map((j) => (j.id === id ? { ...j, status: "ferme" } : j)) })),
        moveCandidate: (id, stage) => {
          const before = get().candidates.find((c) => c.id === id);
          if (!before || before.stage === stage) return;
          set((st) => ({ candidates: st.candidates.map((c) => (c.id === id ? { ...c, stage } : c)) }));
          if (stage === "embauche") {
            pushNotification({
              userId: get().meId,
              type: "poste",
              title: "Embauche confirmée",
              body: `${before.firstName} ${before.lastName} a été marqué(e) comme embauché(e).`,
              link: "/recruitment",
            });
          }
        },
        updateCandidate: (id, patch) =>
          set((st) => ({ candidates: st.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
        toggleFavorite: (candidateId) =>
          set((st) => ({
            favorites: st.favorites.includes(candidateId)
              ? st.favorites.filter((f) => f !== candidateId)
              : [...st.favorites, candidateId],
          })),
        applyInternal: (jobId, staffId, message) => {
          if (get().internalApplications.some((a) => a.jobId === jobId && a.staffId === staffId)) return;
          set((st) => ({
            internalApplications: [...st.internalApplications, { id: newId("ia"), jobId, staffId, message, createdAt: todayISO() }],
          }));
          const job = get().jobs.find((j) => j.id === jobId);
          pushNotification({
            userId: managerOf(job?.service ?? ""),
            type: "poste",
            title: "Candidature interne",
            body: `${fullName(staffById(staffId))} postule à « ${job?.title ?? "une offre"} ».`,
            link: "/recruitment?onglet=bourse",
          });
        },

        notify: pushNotification,
        markNotificationRead: (id, read = true) =>
          set((st) => ({ notifications: st.notifications.map((n) => (n.id === id ? { ...n, read } : n)) })),
        markAllRead: (userId) =>
          set((st) => ({ notifications: st.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)) })),
        setNotificationPref: (userId, type, channel, value) =>
          set((st) => {
            const current = st.notificationPrefs[userId] ?? DEFAULT_NOTIFICATION_PREFS;
            return {
              notificationPrefs: {
                ...st.notificationPrefs,
                [userId]: { ...current, [type]: { ...current[type], [channel]: value } },
              },
            };
          }),

        createPlanning: (input) => {
          const id = newId("pl");
          const me = get().impersonatingId ?? get().meId;
          set((st) => ({
            plannings: [
              {
                ...input,
                id,
                status: "brouillon",
                createdBy: me,
                createdAt: todayISO(),
                publishedAt: null,
                wishesDeadline: null,
                requestedStaffIds: [],
                ruleIds: st.rules.filter((r) => r.enabled).map((r) => r.id),
              },
              ...st.plannings,
            ],
          }));
          return id;
        },
        updatePlanning: (id, patch) =>
          set((st) => ({ plannings: st.plannings.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),

        requestWishes: (planningId, staffIds, deadline) => {
          const planning = get().plannings.find((p) => p.id === planningId);
          if (!planning) return;
          get().updatePlanning(planningId, { status: "collecte", requestedStaffIds: staffIds, wishesDeadline: deadline });
          const author = fullName(staffById(planning.createdBy));
          staffIds.forEach((sid) =>
            pushNotification({
              userId: sid,
              type: "souhaits",
              title: "Vos souhaits sont attendus",
              body: `${author} prépare le planning « ${planning.name} » et attend vos souhaits avant le ${fmt(deadline, "d MMMM")}.`,
              link: `/souhaits?planning=${planningId}`,
            }),
          );
        },

        submitWish: (input) => {
          const existing = get().wishes.find((w) => w.planningId === input.planningId && w.staffId === input.staffId);
          const wish: Wish = { ...input, id: existing?.id ?? newId("w"), submittedAt: todayISO() };
          set((st) => ({ wishes: [...st.wishes.filter((w) => w.id !== wish.id), wish] }));
          const planning = get().plannings.find((p) => p.id === input.planningId);
          if (planning) {
            const received = get().wishes.filter((w) => w.planningId === planning.id).length;
            pushNotification({
              userId: planning.createdBy,
              type: "souhaits",
              title: "Souhaits reçus",
              body: `${fullName(staffById(input.staffId))} a envoyé ses souhaits (${received}/${planning.requestedStaffIds.length}).`,
              link: `/wizard?planning=${planning.id}`,
            });
          }
        },

        generatePlanning: (planningId) => {
          const st = get();
          const planning = st.plannings.find((p) => p.id === planningId);
          if (!planning) return null;
          const team = st.staff.filter((s) => s.service === planning.serviceId && s.contract !== "prestataire");
          const { shifts, stats } = generatePlanningShifts({ planning, team, wishes: st.wishes, leaves: st.leaves });
          set((s) => ({
            shifts: [...s.shifts.filter((sh) => sh.planningId !== planningId), ...shifts],
            plannings: s.plannings.map((p) => (p.id === planningId ? { ...p, status: "revision" } : p)),
            lastGeneration: { ...s.lastGeneration, [planningId]: stats },
          }));
          return stats;
        },

        publishPlanning: (planningId) => {
          const planning = get().plannings.find((p) => p.id === planningId);
          if (!planning) return;
          // Les postes publiés remplacent les anciens postes du service sur la période.
          set((st) => ({
            shifts: st.shifts.filter(
              (s) =>
                s.planningId === planningId ||
                !(s.service === planning.serviceId && isBetween(s.date, planning.startDate, planning.endDate)),
            ),
            plannings: st.plannings.map((p) =>
              p.id === planningId ? { ...p, status: "publie", publishedAt: todayISO() } : p,
            ),
          }));
          get()
            .staff.filter((s) => s.service === planning.serviceId)
            .forEach((s) =>
              pushNotification({
                userId: s.id,
                type: "planning",
                title: "Nouveau planning publié",
                body: `Le planning « ${planning.name} » est disponible. Vous pouvez demander des échanges.`,
                link: `/planning?date=${planning.startDate}`,
              }),
            );
        },

        deletePlanning: (planningId) =>
          set((st) => ({
            plannings: st.plannings.filter((p) => p.id !== planningId),
            shifts: st.shifts.filter((s) => s.planningId !== planningId),
            wishes: st.wishes.filter((w) => w.planningId !== planningId),
          })),
      };
    },
    {
      name: "medglass-demo",
      version: SEED_VERSION,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      // Nouvelle version des données JSON → on repart du seed.
      migrate: () => initialState() as unknown as DemoStore,
    },
  ),
);
