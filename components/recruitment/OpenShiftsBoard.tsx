"use client";

import { useMemo, useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Form";
import { EmptyState } from "@/components/ui/Layout";
import { FilterPills } from "@/components/ui/Tabs";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, usePermissions, useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { ROLE_LABELS, SHIFT_LABELS, SHIFT_STYLES, isDoctor } from "@/lib/utils/labels";
import { fmt, todayISO } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { OpenShift } from "@/lib/types/recruitment";
import type { Staff } from "@/lib/types/planning";

const compatible = (p: Staff, o: OpenShift) => p.role === o.requiredRole || (isDoctor(p.role) && isDoctor(o.requiredRole));

/** Bourse aux remplacements : créneaux vacants, volontariat, attribution. */
export function OpenShiftsBoard() {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const openShifts = useDemoStore((s) => s.openShifts);
  const services = useDemoStore((s) => s.services);
  const shifts = useDemoStore((s) => s.shifts);
  const toggleVolunteer = useDemoStore((s) => s.toggleVolunteer);
  const assign = useDemoStore((s) => s.assignOpenShift);
  const staffMap = useStaffMap();
  const [filter, setFilter] = useState<"ouverts" | "pour-moi" | "pourvus">(isManager ? "ouverts" : "pour-moi");
  const [choice, setChoice] = useState<Record<string, string>>({});
  const today = todayISO();

  const list = useMemo(
    () =>
      openShifts
        .filter((o) =>
          filter === "pourvus" ? o.status === "pourvu" : o.status === "ouvert" && o.date >= today && (filter === "ouverts" || compatible(user, o)),
        )
        .sort((a, b) => a.date.localeCompare(b.date)),
    [openShifts, filter, user, today],
  );

  return (
    <div className="space-y-4">
      <FilterPills
        value={filter}
        onChange={setFilter}
        items={[
          ...(!isManager ? [{ id: "pour-moi" as const, label: "Compatibles avec mon métier" }] : []),
          { id: "ouverts", label: "Tous les créneaux ouverts" },
          { id: "pourvus", label: "Pourvus" },
        ]}
      />
      {list.length === 0 ? (
        <GlassPanel>
          <EmptyState icon="event_available" title="Aucun créneau" description="Aucun créneau ne correspond à ce filtre." />
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.map((o) => {
            const volunteered = o.applicants.includes(user.id);
            const busy = shifts.some((s) => s.staffId === user.id && s.date === o.date);
            const canVolunteer = !isManager && compatible(user, o) && o.status === "ouvert";
            const taker = o.takenBy ? staffMap.get(o.takenBy) : null;
            return (
              <GlassPanel key={o.id} className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-center w-14 shrink-0 rounded-lg bg-white/5 py-2">
                    <p className="font-label-caps text-[10px] text-primary">{fmt(o.date, "EEE")}</p>
                    <p className="text-2xl font-bold leading-none">{fmt(o.date, "d")}</p>
                    <p className="text-[10px] text-on-surface-variant">{fmt(o.date, "MMM")}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={cn("inline-block px-2 py-0.5 rounded-md border text-[11px] mb-1", SHIFT_STYLES[o.type])}>
                      {SHIFT_LABELS[o.type]} · {o.startTime}–{o.endTime}
                    </span>
                    <p className="font-semibold">{ROLE_LABELS[o.requiredRole]}</p>
                    <p className="text-body-sm text-on-surface-variant truncate">{services.find((s) => s.id === o.service)?.name}</p>
                  </div>
                  {o.conflictId && <Badge tone="error">Conflit</Badge>}
                </div>
                {o.bonus && (
                  <p className="text-[12px] text-success flex items-center gap-1.5">
                    <Icon name="paid" className="text-[16px]" /> {o.bonus}
                  </p>
                )}
                <div className="flex items-center gap-2 text-[12px] text-on-surface-variant">
                  <Icon name="group" className="text-[16px]" />
                  {o.applicants.length ? (
                    <span className="flex items-center gap-1">
                      <span className="flex -space-x-2 mr-1">
                        {o.applicants.slice(0, 4).map((a) => (
                          <Avatar key={a} initials={staffMap.get(a)?.initials ?? "?"} size="sm" className="w-6 h-6 text-[9px]" />
                        ))}
                      </span>
                      {o.applicants.length} volontaire(s)
                    </span>
                  ) : (
                    "Aucun volontaire pour l'instant"
                  )}
                </div>

                <div className="mt-auto pt-3 border-t border-white/10">
                  {o.status === "pourvu" ? (
                    <p className="text-body-sm text-success flex items-center gap-2">
                      <Icon name="check_circle" className="text-[18px]" filled /> Pourvu par {fullName(taker)}
                    </p>
                  ) : isManager ? (
                    <div className="flex gap-2">
                      <Select
                        className="py-1.5 text-body-sm flex-1"
                        value={choice[o.id] ?? o.applicants[0] ?? ""}
                        onChange={(e) => setChoice({ ...choice, [o.id]: e.target.value })}
                        aria-label="Choisir le collaborateur"
                      >
                        <option value="">Attribuer à…</option>
                        {o.applicants.length > 0 && (
                          <optgroup label="Volontaires">
                            {o.applicants.map((a) => (
                              <option key={a} value={a}>
                                {fullName(staffMap.get(a))}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="Autres collaborateurs compatibles">
                          {[...staffMap.values()]
                            .filter((p) => compatible(p, o) && !o.applicants.includes(p.id))
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {fullName(p)}
                              </option>
                            ))}
                        </optgroup>
                      </Select>
                      <Button
                        size="sm"
                        disabled={!(choice[o.id] ?? o.applicants[0])}
                        onClick={() => {
                          const id = choice[o.id] ?? o.applicants[0];
                          assign(o.id, id);
                          toast(`Créneau attribué à ${fullName(staffMap.get(id))}`);
                        }}
                      >
                        Attribuer
                      </Button>
                    </div>
                  ) : canVolunteer ? (
                    <Button
                      className="w-full"
                      variant={volunteered ? "secondary" : "primary"}
                      icon={volunteered ? "undo" : "volunteer_activism"}
                      disabled={busy && !volunteered}
                      onClick={() => {
                        toggleVolunteer(o.id, user.id);
                        toast(volunteered ? "Candidature retirée" : "Vous êtes volontaire — votre cadre va confirmer");
                      }}
                    >
                      {volunteered ? "Retirer ma candidature" : busy ? "Déjà en poste ce jour" : "Je suis volontaire"}
                    </Button>
                  ) : (
                    <p className="text-[12px] text-on-surface-variant">Réservé aux profils {ROLE_LABELS[o.requiredRole]}</p>
                  )}
                </div>
              </GlassPanel>
            );
          })}
        </div>
      )}
    </div>
  );
}
