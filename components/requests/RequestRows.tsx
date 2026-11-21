"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useStaffMap } from "@/lib/store/hooks";
import { toast } from "@/lib/store/toastStore";
import { LEAVE_LABELS, REQUEST_STATUS_LABELS, REQUEST_STATUS_TONES, SHIFT_LABELS } from "@/lib/utils/labels";
import { fmt, fmtRange } from "@/lib/utils/dates";
import type { LeaveRequest, SwapRequest } from "@/lib/types/planning";

/** Ligne de demande d'absence ; `canDecide` affiche Valider / Refuser. */
export function LeaveRow({ leave, canDecide, compact }: { leave: LeaveRequest; canDecide: boolean; compact?: boolean }) {
  const staffMap = useStaffMap();
  const decide = useDemoStore((s) => s.decideLeave);
  const person = staffMap.get(leave.staffId);
  const pending = leave.status === "en-attente";

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5 transition-colors">
      <Avatar initials={person?.initials ?? "??"} size="sm" tone="neutral" />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold truncate">{fullName(person)}</p>
        <p className="text-[11px] text-on-surface-variant truncate">
          {LEAVE_LABELS[leave.type]} · {fmtRange(leave.startDate, leave.endDate)}
          {!compact && leave.reason ? ` · ${leave.reason}` : ""}
        </p>
      </div>
      {canDecide && pending ? (
        <div className="flex gap-2 ml-auto">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              decide(leave.id, "refuse");
              toast("Demande refusée", "warning");
            }}
          >
            Refuser
          </Button>
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              decide(leave.id, "valide");
              toast("Absence validée — planning mis à jour");
            }}
          >
            Valider
          </Button>
        </div>
      ) : (
        <Badge tone={REQUEST_STATUS_TONES[leave.status]}>{REQUEST_STATUS_LABELS[leave.status]}</Badge>
      )}
    </div>
  );
}

/** Ligne d'échange ; le destinataire (ou un manager) peut accepter / refuser. */
export function SwapRow({ swap, canDecide }: { swap: SwapRequest; canDecide: boolean }) {
  const staffMap = useStaffMap();
  const shift = useDemoStore((s) => s.shifts.find((x) => x.id === swap.shiftId));
  const decide = useDemoStore((s) => s.decideSwap);
  const from = staffMap.get(swap.fromStaffId);
  const to = staffMap.get(swap.toStaffId);
  const pending = swap.status === "en-attente";

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-lg hover:bg-white/5 border border-white/5 transition-colors">
      <div className="flex -space-x-2">
        <Avatar initials={from?.initials ?? "?"} size="sm" />
        <Avatar initials={to?.initials ?? "?"} size="sm" tone="tertiary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-semibold truncate flex items-center gap-1">
          {fullName(from)} <Icon name="arrow_forward" className="text-[14px] text-on-surface-variant" /> {fullName(to)}
        </p>
        <p className="text-[11px] text-on-surface-variant truncate">
          {shift ? `${SHIFT_LABELS[shift.type]} · ${fmt(shift.date, "EEE d MMM")} · ${shift.startTime}–${shift.endTime}` : "Poste supprimé"}
          {swap.message ? ` · « ${swap.message} »` : ""}
        </p>
      </div>
      {canDecide && pending ? (
        <div className="flex gap-2 ml-auto">
          <Button size="sm" variant="danger" onClick={() => decide(swap.id, "refuse")}>
            Refuser
          </Button>
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              decide(swap.id, "accepte");
              toast("Échange accepté — le poste a été réattribué");
            }}
          >
            Accepter
          </Button>
        </div>
      ) : (
        <Badge tone={REQUEST_STATUS_TONES[swap.status]}>{REQUEST_STATUS_LABELS[swap.status]}</Badge>
      )}
    </div>
  );
}
