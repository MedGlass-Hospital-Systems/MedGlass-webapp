/**
 * Couche API centralisée. Aujourd'hui : retourne les mocks.
 * Demain : remplacer par fetch vers le backend (REST/tRPC), sans toucher aux pages.
 */
import { staff, services } from "@/lib/mocks/staff";
import { currentWeekShifts, planningGaps, leaveRequests, swapRequests } from "@/lib/mocks/shifts";

export const api = {
  staff: {
    list: async () => staff,
    byId: async (id: string) => staff.find((s) => s.id === id) ?? null,
    byService: async (serviceId: string) => staff.filter((s) => s.service === serviceId),
  },
  services: {
    list: async () => services,
    byId: async (id: string) => services.find((s) => s.id === id) ?? null,
  },
  planning: {
    weekShifts: async (_serviceId: string, _weekStart: string) => currentWeekShifts,
    gaps: async (_serviceId: string) => planningGaps,
  },
  leaves: {
    list: async () => leaveRequests,
  },
  swaps: {
    list: async () => swapRequests,
  },
  auth: {
    me: async () => ({
      id: "u1",
      email: "contact@paulrobain.fr",
      firstName: "Sarah",
      lastName: "Jenkins",
      role: "chef-service" as const,
      service: "chir-gen",
      hospital: "CHU Saint-Marie",
    }),
  },
};

export type ApiClient = typeof api;
