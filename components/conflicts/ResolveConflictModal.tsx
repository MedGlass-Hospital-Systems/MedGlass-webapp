"use client";

import { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { weekHours } from "@/lib/planning/hours";
import { ROLE_LABELS, SEVERITY_LABELS, SEVERITY_TONES, SHIFT_LABELS, isDoctor } from "@/lib/utils/labels";
import { addDaysISO, fmt } from "@/lib/utils/dates";
import type { Conflict, Staff } from "@/lib/types/planning";

const canCover = (p: Staff, c: Conflict) =>
  p.role === c.requiredRole || (isDoctor(c.requiredRole) && isDoctor(p.role) && p.role !== "chef-service");

/** Propose les remplaçants compatibles (même métier, libres le jour J et sans poste de nuit la veille). */
export function ResolveConflictModal({ conflictId, onClose }: { conflictId: string | null; onClose: () => void }) {
  const conflict = useDemoStore((s) => s.conflicts.find((c) => c.id === conflictId));
  const staff = useDemoStore((s) => s.staff);
  const shifts = useDemoStore((s) => s.shifts);
  const openShifts = useDemoStore((s) => s.openShifts);
  const resolve = useDemoStore((s) => s.resolveConflict);
  const publish = useDemoStore((s) => s.publishConflictToBourse);

  const candidates = useMemo(() => {
    if (!conflict) return [];
    const prev = addDaysISO(conflict.date, -1);
    return staff
      .filter((p) => canCover(p, conflict) && (p.service === conflict.service || p.contract === "vacataire" || p.contract === "interimaire"))
      .map((p) => {
        const sameDay = shifts.find((s) => s.staffId === p.id && s.date === conflict.date);
        const nightBefore = shifts.some((s) => s.staffId === p.id && s.date === prev && (s.type === "nuit" || s.type === "garde"));
        return { p, sameDay, nightBefore, hours: weekHours(shifts, p.id, conflict.date) };
      })
      .sort((a, b) => Number(!!a.sameDay) - Number(!!b.sameDay) || Number(a.nightBefore) - Number(b.nightBefore) || a.hours - b.hours);
  }, [conflict, staff, shifts]);

  const inBourse = conflict && openShifts.some((o) => o.conflictId === conflict.id);

  return (
    <Modal
      open={!!conflict}
      onClose={onClose}
      icon="healing"
      title="Résoudre le conflit"
      description={
        conflict && (
          <>
            {conflict.label} · {fmt(conflict.date, "EEEE d MMMM")} · {conflict.reason}
          </>
        )
      }
      footer={
        conflict && (
          <Button
            variant="secondary"
            icon="campaign"
            disabled={inBourse}
            onClick={() => {
              publish(conflict.id);
              toast("Créneau publié dans la bourse au poste");
              onClose();
            }}
          >
            {inBourse ? "Déjà dans la bourse" : "Publier dans la bourse au poste"}
          </Button>
        )
      }
    >
      {conflict && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone={SEVERITY_TONES[conflict.severity]}>{SEVERITY_LABELS[conflict.severity]}</Badge>
            <Badge tone="neutral">
              {SHIFT_LABELS[conflict.slot.type]} {conflict.slot.startTime}–{conflict.slot.endTime}
            </Badge>
            <Badge tone="primary">Profil requis : {ROLE_LABELS[conflict.requiredRole]}</Badge>
          </div>
          {candidates.length ? (
            <ul className="space-y-2">
              {candidates.map(({ p, sameDay, nightBefore, hours }) => {
                const blocked = !!sameDay && sameDay.type !== "admin";
                return (
                  <li key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/5">
                    <Avatar initials={p.initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-semibold truncate">{fullName(p, true)}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">
                        {p.roleLabel} · {hours}h / {p.contractedHours}h cette semaine
                      </p>
                      {(sameDay || nightBefore) && (
                        <p className="text-[11px] text-warning flex items-center gap-1 mt-0.5">
                          <Icon name="info" className="text-[13px]" />
                          {sameDay ? `Déjà en ${SHIFT_LABELS[sameDay.type].toLowerCase()} ce jour` : "Garde ou nuit la veille (repos de sécurité)"}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={blocked || nightBefore ? "secondary" : "primary"}
                      onClick={() => {
                        resolve(conflict.id, p.id);
                        toast(`${p.firstName} ${p.lastName} positionné(e) — conflit résolu`);
                        onClose();
                      }}
                    >
                      Affecter
                    </Button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState icon="person_off" title="Aucun remplaçant compatible" description="Publiez le créneau dans la bourse au poste." />
          )}
        </>
      )}
    </Modal>
  );
}
