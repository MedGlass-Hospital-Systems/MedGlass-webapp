"use client";

import { useMemo } from "react";
import { useDemoStore, DEFAULT_NOTIFICATION_PREFS } from "./demoStore";
import type { Staff } from "@/lib/types/planning";

/** Utilisateur réellement connecté (jamais l'incarnation). */
export function useMe(): Staff {
  const meId = useDemoStore((s) => s.meId);
  const staff = useDemoStore((s) => s.staff);
  return staff.find((s) => s.id === meId) ?? staff[0];
}

/** Utilisateur « vu » par l'application : la personne incarnée si une incarnation est en cours. */
export function useCurrentUser(): Staff {
  const meId = useDemoStore((s) => s.meId);
  const imp = useDemoStore((s) => s.impersonatingId);
  const staff = useDemoStore((s) => s.staff);
  return staff.find((s) => s.id === (imp ?? meId)) ?? staff[0];
}

export function usePermissions() {
  const user = useCurrentUser();
  const me = useMe();
  const isAdmin = user.appRole === "admin";
  const isManager = isAdmin || user.appRole === "manager";
  return {
    isAdmin,
    isManager,
    /** Seul le vrai compte admin peut incarner (pas en cascade). */
    canImpersonate: me.appRole === "admin",
    canManageRoles: isAdmin,
  };
}

export function useStaffMap() {
  const staff = useDemoStore((s) => s.staff);
  return useMemo(() => new Map(staff.map((s) => [s.id, s])), [staff]);
}

export function useServiceName(serviceId: string) {
  return useDemoStore((s) => s.services.find((x) => x.id === serviceId)?.name ?? serviceId);
}

export function useMyNotifications() {
  const user = useCurrentUser();
  const all = useDemoStore((s) => s.notifications);
  return useMemo(
    () => all.filter((n) => n.userId === user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [all, user.id],
  );
}

export function useNotificationPrefs(userId: string) {
  return useDemoStore((s) => s.notificationPrefs[userId] ?? DEFAULT_NOTIFICATION_PREFS);
}

/** Plannings en collecte de souhaits qui attendent une réponse de l'utilisateur courant. */
export function usePendingWishRequests() {
  const user = useCurrentUser();
  const plannings = useDemoStore((s) => s.plannings);
  const wishes = useDemoStore((s) => s.wishes);
  return useMemo(
    () =>
      plannings.filter(
        (p) =>
          p.status === "collecte" &&
          p.requestedStaffIds.includes(user.id) &&
          !wishes.some((w) => w.planningId === p.id && w.staffId === user.id),
      ),
    [plannings, wishes, user.id],
  );
}

export const fullName = (s?: Pick<Staff, "firstName" | "lastName" | "role"> | null, withTitle = false) => {
  if (!s) return "—";
  const title = withTitle && (s.role === "praticien" || s.role === "interne" || s.role === "chef-service") ? "Dr " : "";
  return `${title}${s.firstName} ${s.lastName}`;
};
