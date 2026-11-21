"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, Toggle } from "@/components/ui/Form";
import { EmptyState, PageHeader, PanelHeader } from "@/components/ui/Layout";
import { QuickActions } from "@/components/ui/QuickActions";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/components/layout/Icon";
import { ScheduleGrid } from "./ScheduleGrid";
import { DayTimeline } from "./DayTimeline";
import { ExportMenu } from "./ExportMenu";
import { PlanningsBoard } from "./PlanningsBoard";
import { ShiftDetailModal } from "./ShiftDetailModal";
import { ConflictItem } from "@/components/conflicts/ConflictItem";
import { ResolveConflictModal } from "@/components/conflicts/ResolveConflictModal";
import { SwapModal } from "@/components/requests/SwapModal";
import { LeaveModal } from "@/components/requests/LeaveModal";
import { CollaboratorModal } from "@/components/team/CollaboratorModal";
import { ProfileDrawer } from "@/components/directory/ProfileDrawer";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, usePermissions } from "@/lib/store/hooks";
import { LEGEND_TYPES, SEVERITY_ORDER, SHIFT_DOTS, SHIFT_LABELS } from "@/lib/utils/labels";
import {
  addDaysISO,
  addMonthsISO,
  fmt,
  fmtRange,
  isoWeekNumber,
  monthDates,
  rangeDates,
  todayISO,
  weekDates,
} from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { Planning, Staff } from "@/lib/types/planning";

type View = "jour" | "semaine" | "mois";
const ROLE_ORDER = ["chef-service", "praticien", "interne", "cadre", "ide", "as", "secretaire"];
const sortTeam = (a: Staff, b: Staff) =>
  ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) || a.lastName.localeCompare(b.lastName);

export function PlanningView() {
  const params = useSearchParams();
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const staff = useDemoStore((s) => s.staff);
  const services = useDemoStore((s) => s.services);
  const shifts = useDemoStore((s) => s.shifts);
  const conflicts = useDemoStore((s) => s.conflicts);
  const plannings = useDemoStore((s) => s.plannings);

  const [tab, setTab] = useState<"actuel" | "preparation">("actuel");
  const [view, setView] = useState<View>("semaine");
  const [date, setDate] = useState(todayISO());
  const [serviceId, setServiceId] = useState(user.service);
  const [onlyMe, setOnlyMe] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [shiftId, setShiftId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: "swap"; shiftId?: string } | { type: "leave" } | { type: "collaborator" } | null>(null);

  // Synchronisation avec l'URL (liens depuis notifications, accueil, conflits…)
  useEffect(() => {
    const v = params.get("vue");
    if (v === "jour" || v === "semaine" || v === "mois") setView(v);
    const d = params.get("date");
    if (d) setDate(d);
    if (params.get("onglet") === "preparation" && isManager) setTab("preparation");
    const c = params.get("conflit") ?? params.get("gap");
    if (c) {
      const conflict = conflicts.find((x) => x.id === c);
      if (conflict) {
        setTab("actuel");
        setServiceId(conflict.service);
        setDate(conflict.date);
        setHighlight(conflict.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    setServiceId(user.service);
  }, [user.service]);

  const statusById = useMemo(() => new Map(plannings.map((p) => [p.id, p.status])), [plannings]);
  const team = useMemo(() => {
    const list = staff.filter((s) => s.service === serviceId).sort(sortTeam);
    if (onlyMe) return list.filter((s) => s.id === user.id);
    const me = list.find((s) => s.id === user.id);
    return me && !isManager ? [me, ...list.filter((s) => s.id !== user.id)] : list;
  }, [staff, serviceId, onlyMe, user.id, isManager]);

  const days = view === "jour" ? rangeDates(date, date) : view === "semaine" ? weekDates(date) : monthDates(date);
  const start = days[0].date;
  const end = days[days.length - 1].date;

  const visibleShifts = useMemo(
    () =>
      shifts.filter(
        (s) =>
          s.date >= addDaysISO(start, -1) &&
          s.date <= end &&
          (!s.planningId || statusById.get(s.planningId) === "publie" || s.planningId === draftId || !statusById.has(s.planningId)),
      ),
    [shifts, start, end, statusById, draftId],
  );
  const serviceConflicts = useMemo(
    () => conflicts.filter((c) => c.service === serviceId).sort((a, b) => a.date.localeCompare(b.date) || SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
    [conflicts, serviceId],
  );
  const conflictsInRange = serviceConflicts.filter((c) => c.date >= start && c.date <= end);
  const openConflicts = serviceConflicts.filter((c) => c.status === "ouvert");
  const highlighted = conflicts.find((c) => c.id === highlight);
  const draft = plannings.find((p) => p.id === draftId);
  const serviceName = services.find((s) => s.id === serviceId)?.name ?? "";
  const activePlanning = plannings.find(
    (p) => p.serviceId === serviceId && p.status === "publie" && p.startDate <= end && p.endDate >= start,
  );

  const move = (dir: 1 | -1) => {
    setHighlight(null);
    setDate((d) => (view === "jour" ? addDaysISO(d, dir) : view === "semaine" ? addDaysISO(d, 7 * dir) : addMonthsISO(d, dir)));
  };
  const periodLabel =
    view === "jour" ? fmt(date, "EEEE d MMMM yyyy") : view === "semaine" ? `Semaine ${isoWeekNumber(start)} · ${fmtRange(start, end)}` : fmt(date, "MMMM yyyy");

  const selectConflict = (id: string) => {
    const c = conflicts.find((x) => x.id === id);
    if (!c) return;
    if (highlight === id) return setResolveId(id);
    setHighlight(id);
    setDate(c.date);
    if (view === "mois") setView("semaine");
  };

  const showDraft = (p: Planning) => {
    setDraftId(p.status === "publie" ? null : p.id);
    setServiceId(p.serviceId);
    setDate(p.startDate);
    setView("semaine");
    setTab("actuel");
  };

  const gridProps = {
    staff: team,
    shifts: visibleShifts,
    conflicts: conflictsInRange,
    highlightConflictId: highlight,
    highlightStaffId: user.id,
    onShiftClick: (s: { id: string }) => setShiftId(s.id),
    onConflictClick: (c: { id: string }) => (isManager ? selectConflict(c.id) : setHighlight(c.id)),
    onStaffClick: setProfileId,
  };

  return (
    <>
      <PageHeader
        title="Planning"
        description={isManager ? "Gérez les rotations, gardes et affectations de votre service." : "Consultez vos postes et ceux de votre équipe."}
        actions={
          <>
            <ExportMenu shifts={visibleShifts} team={team} start={start} end={end} serviceName={serviceName} myId={user.id} />
            {isManager && (
              <Button icon="auto_fix" href="/wizard?nouveau=1">
                Nouveau planning
              </Button>
            )}
          </>
        }
      />

      {isManager && (
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: "actuel", label: "Planning actuel", icon: "calendar_month" },
            { id: "preparation", label: "En préparation", icon: "pending_actions", count: plannings.filter((p) => p.status !== "publie").length },
          ]}
        />
      )}

      {tab === "preparation" ? (
        <PlanningsBoard onShow={showDraft} />
      ) : (
        <>
          {draft && (
            <div className="rounded-xl border border-tertiary/30 bg-tertiary/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <Icon name="visibility" className="text-tertiary" />
              <p className="flex-1 text-body-sm">
                Aperçu du brouillon <strong>{draft.name}</strong> — non visible par l&apos;équipe tant qu&apos;il n&apos;est pas publié.
              </p>
              <Button size="sm" variant="secondary" href={`/wizard?planning=${draft.id}`}>
                Reprendre dans l&apos;assistant
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDraftId(null)}>
                Fermer l&apos;aperçu
              </Button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
            <span className="text-body-sm text-on-surface-variant">Légende :</span>
            {LEGEND_TYPES.map((t) => (
              <span key={t} className="flex items-center gap-2 text-body-sm">
                <span className={cn("w-3 h-3 rounded", SHIFT_DOTS[t])} />
                {SHIFT_LABELS[t]}
              </span>
            ))}
            <span className="flex items-center gap-2 text-body-sm">
              <span className="w-3 h-3 rounded border border-dashed border-error" />
              Besoin non couvert
            </span>
          </div>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <GlassPanel className="xl:col-span-9 flex flex-col overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-white/10 bg-background/40 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <button type="button" aria-label="Période précédente" onClick={() => move(-1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-on-surface-variant">
                    <Icon name="chevron_left" className="text-[20px]" />
                  </button>
                  <button type="button" aria-label="Période suivante" onClick={() => move(1)} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-on-surface-variant">
                    <Icon name="chevron_right" className="text-[20px]" />
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => { setDate(todayISO()); setHighlight(null); }}>
                    Aujourd&apos;hui
                  </Button>
                  <h3 className="font-semibold text-on-surface first-letter:uppercase ml-1">{periodLabel}</h3>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Select value={serviceId} onChange={(e) => { setServiceId(e.target.value); setHighlight(null); }} className="w-52 py-1.5 rounded-full text-body-sm" aria-label="Service">
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                  <Tabs
                    size="sm"
                    value={view}
                    onChange={(v) => setView(v)}
                    items={[
                      { id: "jour", label: "Jour" },
                      { id: "semaine", label: "Semaine" },
                      { id: "mois", label: "Mois" },
                    ]}
                  />
                </div>
              </div>
              <div className="px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-white/5">
                <span className="text-[12px] text-on-surface-variant flex items-center gap-2">
                  {activePlanning ? (
                    <>
                      <Badge tone="success">Publié</Badge> {activePlanning.name}
                    </>
                  ) : (
                    "Aucun planning publié sur cette période"
                  )}
                </span>
                {user.service === serviceId && (
                  <label className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                    Uniquement mes postes
                    <Toggle label="Uniquement mes postes" checked={onlyMe} onChange={setOnlyMe} />
                  </label>
                )}
              </div>
              <div className="p-4">
                {team.length === 0 ? (
                  <EmptyState icon="group_off" title="Aucun collaborateur dans ce service" />
                ) : view === "jour" ? (
                  <DayTimeline {...gridProps} date={date} />
                ) : (
                  <ScheduleGrid {...gridProps} days={days} density={view === "mois" ? "month" : "week"} />
                )}
              </div>
            </GlassPanel>

            <div className="xl:col-span-3 space-y-6">
              <GlassPanel className="p-5">
                <PanelHeader
                  title="Conflits"
                  action={<Badge tone={openConflicts.length ? "error" : "success"}>{openConflicts.length}</Badge>}
                  className="mb-3"
                />
                {highlighted && (
                  <div className="mb-3 p-3 rounded-lg border border-error/30 bg-error/[0.06]">
                    <p className="text-body-sm font-semibold">{highlighted.label}</p>
                    <p className="text-[11px] text-on-surface-variant mb-3">
                      {fmt(highlighted.date, "EEEE d MMMM")} · {highlighted.reason}
                    </p>
                    <div className="flex gap-2">
                      {isManager && highlighted.status === "ouvert" && (
                        <Button size="sm" icon="healing" onClick={() => setResolveId(highlighted.id)}>
                          Résoudre
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setHighlight(null)}>
                        Masquer
                      </Button>
                    </div>
                  </div>
                )}
                <div className="space-y-1 max-h-[420px] overflow-y-auto scrollbar-thin">
                  {serviceConflicts.length ? (
                    serviceConflicts.map((c) => (
                      <ConflictItem key={c.id} conflict={c} compact active={c.id === highlight} onSelect={() => selectConflict(c.id)} />
                    ))
                  ) : (
                    <EmptyState icon="verified" title="Aucun conflit" className="py-4" />
                  )}
                </div>
              </GlassPanel>

              <QuickActions
                title="Actions"
                layout="list"
                actions={[
                  { icon: "swap_horiz", label: "Échanger une garde", onClick: () => setModal({ type: "swap" }) },
                  { icon: "edit_calendar", label: "Saisir un congé", onClick: () => setModal({ type: "leave" }) },
                  ...(isManager
                    ? [
                        { icon: "person_add", label: "Ajouter un vacataire", onClick: () => setModal({ type: "collaborator" }) },
                        { icon: "campaign", label: "Publier un créneau", href: "/recruitment?onglet=bourse&nouveau=1" },
                        { icon: "pending_actions", label: "Plannings en préparation", onClick: () => setTab("preparation") },
                      ]
                    : [{ icon: "favorite", label: "Saisir mes souhaits", href: "/souhaits" }]),
                ]}
              />
            </div>
          </section>
        </>
      )}

      <ShiftDetailModal
        shiftId={shiftId}
        onClose={() => setShiftId(null)}
        onSwap={(id) => {
          setShiftId(null);
          setModal({ type: "swap", shiftId: id });
        }}
        onProfile={(id) => {
          setShiftId(null);
          setProfileId(id);
        }}
      />
      <ResolveConflictModal conflictId={resolveId} onClose={() => setResolveId(null)} />
      <SwapModal open={modal?.type === "swap"} shiftId={modal?.type === "swap" ? modal.shiftId : undefined} onClose={() => setModal(null)} />
      <LeaveModal open={modal?.type === "leave"} onClose={() => setModal(null)} />
      <CollaboratorModal open={modal?.type === "collaborator"} onClose={() => setModal(null)} />
      <ProfileDrawer staffId={profileId} onClose={() => setProfileId(null)} />
    </>
  );
}
