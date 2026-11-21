"use client";

import { Modal } from "@/components/ui/Modal";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, usePermissions } from "@/lib/store/hooks";
import { shiftHours } from "@/lib/planning/hours";
import { ABSENCE_TYPES, SHIFT_LABELS, WORKED_TYPES } from "@/lib/utils/labels";
import { fmt, todayISO } from "@/lib/utils/dates";

export function ShiftDetailModal({
  shiftId,
  onClose,
  onSwap,
  onProfile,
}: {
  shiftId: string | null;
  onClose: () => void;
  onSwap: (shiftId: string) => void;
  onProfile: (staffId: string) => void;
}) {
  const shift = useDemoStore((s) => s.shifts.find((x) => x.id === shiftId));
  const person = useDemoStore((s) => s.staff.find((x) => x.id === shift?.staffId));
  const planning = useDemoStore((s) => s.plannings.find((p) => p.id === shift?.planningId));
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const canSwap = shift && WORKED_TYPES.includes(shift.type) && shift.date >= todayISO() && (isManager || shift.staffId === user.id);

  return (
    <Modal
      open={!!shift}
      onClose={onClose}
      size="sm"
      icon="event"
      title={shift ? SHIFT_LABELS[shift.type] : ""}
      description={shift ? fmt(shift.date, "EEEE d MMMM yyyy") : ""}
      footer={
        shift &&
        person && (
          <>
            <Button variant="ghost" icon="person" onClick={() => onProfile(person.id)}>
              Profil
            </Button>
            {canSwap && (
              <Button icon="swap_horiz" onClick={() => onSwap(shift.id)}>
                Proposer un échange
              </Button>
            )}
          </>
        )
      }
    >
      {shift && person && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar initials={person.initials} />
            <div>
              <p className="font-semibold">{fullName(person, true)}</p>
              <p className="text-body-sm text-on-surface-variant">{person.roleLabel}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-body-sm">
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
              <dt className="text-[11px] text-on-surface-variant">Horaires</dt>
              <dd className="font-semibold tabular-nums">
                {ABSENCE_TYPES.includes(shift.type) ? "Journée" : `${shift.startTime} – ${shift.endTime}`}
              </dd>
            </div>
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
              <dt className="text-[11px] text-on-surface-variant">Durée comptabilisée</dt>
              <dd className="font-semibold tabular-nums">{shiftHours(shift)} h</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">{planning ? planning.name : "Hors planning (ajout manuel)"}</Badge>
            {shift.endTime <= shift.startTime && !ABSENCE_TYPES.includes(shift.type) && <Badge tone="tertiary">Se termine le lendemain</Badge>}
          </div>
        </div>
      )}
    </Modal>
  );
}
