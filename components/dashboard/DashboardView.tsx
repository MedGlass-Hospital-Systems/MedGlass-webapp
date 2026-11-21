"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState, PageHeader, PanelHeader, ProgressBar } from "@/components/ui/Layout";
import { QuickActions, type QuickAction } from "@/components/ui/QuickActions";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/layout/Icon";
import { TodayShifts } from "./TodayShifts";
import { WishRequestBanner } from "./WishRequestBanner";
import { LeaveRow, SwapRow } from "@/components/requests/RequestRows";
import { LeaveModal } from "@/components/requests/LeaveModal";
import { SwapModal } from "@/components/requests/SwapModal";
import { RulesModal } from "@/components/rules/RulesModal";
import { CollaboratorModal } from "@/components/team/CollaboratorModal";
import { RoleManagementModal } from "@/components/team/RoleManagementModal";
import { ImpersonateModal } from "@/components/team/ImpersonateModal";
import { ProfileDrawer } from "@/components/directory/ProfileDrawer";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, usePermissions, useServiceName } from "@/lib/store/hooks";
import { weekHours } from "@/lib/planning/hours";
import { ABSENCE_TYPES, SHIFT_LABELS, WORKED_TYPES, isDoctor } from "@/lib/utils/labels";
import { addDaysISO, fmt, todayISO } from "@/lib/utils/dates";

type ModalId = "leave" | "swap" | "rules" | "collaborator" | "roles" | "impersonate" | null;

export function DashboardView() {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const [modal, setModal] = useState<ModalId>(null);
  const close = () => setModal(null);

  return (
    <>
      <PageHeader
        eyebrow={`Bonjour, ${user.firstName}`}
        title={isManager ? "Vue d'ensemble" : "Ma journée"}
        description={fmt(todayISO(), "EEEE d MMMM yyyy")}
        actions={
          isManager ? (
            <>
              <Button href="/planning" variant="secondary" icon="calendar_month">
                Voir le planning
              </Button>
              <Button href="/wizard?nouveau=1" icon="auto_fix">
                Lancer l&apos;assistant
              </Button>
            </>
          ) : (
            <>
              <Button href="/planning" variant="secondary" icon="calendar_month">
                Mon planning
              </Button>
              <Button icon="edit_calendar" onClick={() => setModal("leave")}>
                Poser un congé
              </Button>
            </>
          )
        }
      />
      <WishRequestBanner />
      {isManager ? <ManagerDashboard openModal={setModal} /> : <StaffDashboard openModal={setModal} />}

      <LeaveModal open={modal === "leave"} onClose={close} />
      <SwapModal open={modal === "swap"} onClose={close} />
      <RulesModal open={modal === "rules"} onClose={close} />
      <CollaboratorModal open={modal === "collaborator"} onClose={close} />
      <RoleManagementModal open={modal === "roles"} onClose={close} />
      <ImpersonateModal open={modal === "impersonate"} onClose={close} />
    </>
  );
}

function ManagerDashboard({ openModal }: { openModal: (m: ModalId) => void }) {
  const user = useCurrentUser();
  const { isAdmin, canImpersonate } = usePermissions();
  const serviceName = useServiceName(user.service);
  const staff = useDemoStore((s) => s.staff);
  const shifts = useDemoStore((s) => s.shifts);
  const leaves = useDemoStore((s) => s.leaves);
  const swaps = useDemoStore((s) => s.swaps);
  const conflicts = useDemoStore((s) => s.conflicts);
  const [profileId, setProfileId] = useState<string | null>(null);
  const today = todayISO();

  const team = useMemo(() => staff.filter((s) => s.service === user.service), [staff, user.service]);
  const teamIds = useMemo(() => new Set(team.map((t) => t.id)), [team]);
  const todayShifts = shifts.filter((s) => s.date === today && s.service === user.service);
  const working = todayShifts.filter((s) => WORKED_TYPES.includes(s.type)).length;
  const absent = todayShifts.filter((s) => ABSENCE_TYPES.includes(s.type)).length;
  const available = team.length - todayShifts.length;
  const pendingLeaves = leaves.filter((l) => l.status === "en-attente" && teamIds.has(l.staffId));
  const pendingSwaps = swaps.filter((s) => s.status === "en-attente" && teamIds.has(s.fromStaffId));
  const openConflicts = conflicts.filter((c) => c.status === "ouvert" && c.service === user.service);
  const critical = openConflicts.filter((c) => c.severity === "critique").length;

  const actions: QuickAction[] = [
    { icon: "swap_horiz", label: "Échange", onClick: () => openModal("swap") },
    { icon: "edit_calendar", label: "Congé", onClick: () => openModal("leave") },
    { icon: "rule", label: "Règles", onClick: () => openModal("rules") },
    { icon: "person_add", label: "Collaborateur", onClick: () => openModal("collaborator") },
    ...(isAdmin ? [{ icon: "admin_panel_settings", label: "Rôles", onClick: () => openModal("roles") }] : []),
    ...(canImpersonate ? [{ icon: "supervised_user_circle", label: "Incarner", onClick: () => openModal("impersonate") }] : []),
  ];

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Postes aujourd'hui" value={working} icon="group" href="/planning?vue=jour" hint={`${absent} absent(s)`} />
        <StatCard label="Soignants disponibles" value={Math.max(0, available)} icon="local_hospital" hint="Sans poste ni absence aujourd'hui" href="/annuaire" />
        <StatCard label="Demandes en attente" value={pendingLeaves.length + pendingSwaps.length} icon="pending_actions" href="/demandes" />
        <StatCard
          label="Conflits détectés"
          value={openConflicts.length}
          icon="warning"
          tone={openConflicts.length ? "alert" : "success"}
          badge={critical ? `${critical} critique${critical > 1 ? "s" : ""}` : undefined}
          href="/conflits"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <PanelHeader title="Postes d'aujourd'hui" subtitle={serviceName} href="/planning?vue=jour" />
          <TodayShifts serviceId={user.service} />
        </GlassPanel>

        <GlassPanel className="p-6">
          <PanelHeader title="Demandes" href="/demandes" />
          <div className="space-y-2">
            {pendingLeaves.slice(0, 3).map((l) => (
              <LeaveRow key={l.id} leave={l} canDecide compact />
            ))}
            {pendingSwaps.slice(0, 2).map((s) => (
              <SwapRow key={s.id} swap={s} canDecide />
            ))}
            {!pendingLeaves.length && !pendingSwaps.length && (
              <EmptyState icon="task_alt" title="Tout est traité" description="Aucune demande en attente." />
            )}
          </div>
        </GlassPanel>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <PanelHeader title={`Équipe — ${serviceName}`} subtitle="Heures planifiées cette semaine" href="/annuaire" linkLabel="Annuaire" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {team.map((s) => {
              const h = weekHours(shifts, s.id, today);
              const ratio = s.contractedHours ? (h / s.contractedHours) * 100 : 0;
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setProfileId(s.id)}
                  className="text-center p-3 rounded-lg hover:bg-white/5 transition-colors focus-ring"
                >
                  <Avatar initials={s.initials} size="lg" className="mx-auto mb-2" />
                  <p className="text-body-sm font-semibold truncate">
                    {isDoctor(s.role) ? "Dr " : ""}
                    {s.lastName}
                  </p>
                  <p className="text-[10px] text-on-surface-variant truncate">{s.roleLabel}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1 tabular-nums">
                    {h}h / {s.contractedHours}h
                  </p>
                  <ProgressBar value={ratio} tone={ratio > 100 ? "warning" : "primary"} className="mt-1" />
                </button>
              );
            })}
          </div>
        </GlassPanel>
        <QuickActions actions={actions} />
      </section>

      <ProfileDrawer staffId={profileId} onClose={() => setProfileId(null)} />
    </>
  );
}

function StaffDashboard({ openModal }: { openModal: (m: ModalId) => void }) {
  const user = useCurrentUser();
  const shifts = useDemoStore((s) => s.shifts);
  const leaves = useDemoStore((s) => s.leaves);
  const swaps = useDemoStore((s) => s.swaps);
  const openShifts = useDemoStore((s) => s.openShifts);
  const today = todayISO();

  const upcoming = shifts
    .filter((s) => s.staffId === user.id && s.date >= today && s.date <= addDaysISO(today, 7))
    .sort((a, b) => a.date.localeCompare(b.date));
  const next = upcoming.find((s) => WORKED_TYPES.includes(s.type));
  const hours = weekHours(shifts, user.id, today);
  const myLeaves = leaves.filter((l) => l.staffId === user.id).slice(0, 3);
  const mySwaps = swaps.filter((s) => s.toStaffId === user.id || s.fromStaffId === user.id).slice(0, 3);
  const bourse = openShifts.filter((o) => o.status === "ouvert" && o.service === user.service && o.requiredRole === user.role).length;

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Heures cette semaine" value={`${hours}h`} icon="schedule" hint={`Contrat : ${user.contractedHours}h`} />
        <StatCard
          label="Prochain poste"
          value={next ? fmt(next.date, "EEE d") : "—"}
          icon="event"
          hint={next ? `${SHIFT_LABELS[next.type]} · ${next.startTime}–${next.endTime}` : "Aucun poste planifié"}
        />
        <StatCard label="Solde congés" value={`${user.leaveBalance.conges} j`} icon="beach_access" hint={`RTT : ${user.leaveBalance.rtt} j`} />
        <StatCard label="Créneaux à pourvoir" value={bourse} icon="swap_horizontal_circle" href="/recruitment?onglet=bourse" tone={bourse ? "success" : "default"} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 p-6">
          <PanelHeader title="Mes 7 prochains jours" href="/planning?vue=semaine" />
          {upcoming.length ? (
            <ul className="space-y-2">
              {upcoming.map((s) => (
                <li key={s.id} className="flex items-center gap-4 p-3 rounded-lg border border-white/5 hover:bg-white/5">
                  <div className="w-14 text-center">
                    <p className="font-label-caps text-[10px] text-primary">{fmt(s.date, "EEE")}</p>
                    <p className="text-xl font-bold">{fmt(s.date, "d")}</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{SHIFT_LABELS[s.type]}</p>
                    <p className="text-body-sm text-on-surface-variant">
                      {ABSENCE_TYPES.includes(s.type) ? "Journée d'absence" : `${s.startTime} – ${s.endTime}`}
                    </p>
                  </div>
                  {s.date === today && <Badge tone="primary">Aujourd&apos;hui</Badge>}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="event_available" title="Rien de prévu" />
          )}
        </GlassPanel>
        <QuickActions
          actions={[
            { icon: "swap_horiz", label: "Échange", onClick: () => openModal("swap") },
            { icon: "edit_calendar", label: "Congé", onClick: () => openModal("leave") },
            { icon: "favorite", label: "Mes souhaits", href: "/souhaits" },
            { icon: "swap_horizontal_circle", label: "Bourse au poste", href: "/recruitment?onglet=bourse" },
          ]}
        />
      </section>

      <GlassPanel className="p-6">
        <PanelHeader title="Mes demandes" href="/demandes" />
        <div className="space-y-2">
          {myLeaves.map((l) => (
            <LeaveRow key={l.id} leave={l} canDecide={false} />
          ))}
          {mySwaps.map((s) => (
            <SwapRow key={s.id} swap={s} canDecide={s.toStaffId === user.id} />
          ))}
          {!myLeaves.length && !mySwaps.length && (
            <EmptyState
              icon="inbox"
              title="Aucune demande"
              action={
                <Button size="sm" variant="secondary" icon="edit_calendar" onClick={() => openModal("leave")}>
                  Poser une absence
                </Button>
              }
            />
          )}
        </div>
      </GlassPanel>
      <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
        <Icon name="info" className="text-[14px]" /> Connecté en tant que {fullName(user)}.
      </p>
    </>
  );
}
