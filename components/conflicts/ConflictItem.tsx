"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/layout/Icon";
import { SEVERITY_DOTS, SEVERITY_LABELS, SEVERITY_TONES } from "@/lib/utils/labels";
import { fmt } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { Conflict } from "@/lib/types/planning";

/** Conflit en version liste (page Conflits) ou compacte (panneau latéral du planning). */
export function ConflictItem({
  conflict,
  compact,
  active,
  onSelect,
  onResolve,
  showOnPlanningHref,
}: {
  conflict: Conflict;
  compact?: boolean;
  active?: boolean;
  onSelect?: () => void;
  onResolve?: () => void;
  showOnPlanningHref?: string;
}) {
  const resolved = conflict.status === "resolu";

  if (compact) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full text-left p-2.5 rounded-lg transition-colors focus-ring",
          active ? "bg-error/10 ring-1 ring-error/40" : "hover:bg-white/5",
          resolved && "opacity-50",
        )}
      >
        <div className="flex items-start gap-2">
          <span className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", resolved ? "bg-success" : SEVERITY_DOTS[conflict.severity])} />
          <div className="min-w-0 flex-1">
            <p className="text-body-sm font-semibold">{conflict.label}</p>
            <p className="text-[11px] text-on-surface-variant">{fmt(conflict.date, "EEE d MMM")}</p>
            <p className="text-[11px] text-on-surface-variant">{resolved ? "Résolu" : conflict.reason}</p>
          </div>
          <Icon name="my_location" className="text-[16px] text-on-surface-variant mt-0.5" />
        </div>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-wrap md:flex-nowrap items-center gap-4 p-3 rounded-lg border border-white/5 hover:bg-white/5 transition-colors",
        resolved && "opacity-60",
      )}
    >
      <span
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
          resolved
            ? "bg-success/15 text-success"
            : conflict.severity === "critique"
              ? "bg-error/20 text-error"
              : conflict.severity === "elevee"
                ? "bg-warning/15 text-warning"
                : "bg-white/5 text-on-surface-variant",
        )}
      >
        <Icon name={resolved ? "check_circle" : "warning"} filled={conflict.severity === "critique" || resolved} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-on-surface">{conflict.label}</p>
        <p className="text-body-sm text-on-surface-variant">
          {fmt(conflict.date, "EEEE d MMMM")} · {resolved ? "Résolu" : conflict.reason}
        </p>
      </div>
      <Badge tone={resolved ? "success" : SEVERITY_TONES[conflict.severity]}>{resolved ? "Résolu" : SEVERITY_LABELS[conflict.severity]}</Badge>
      <div className="flex gap-2">
        {showOnPlanningHref && (
          <Button href={showOnPlanningHref} variant="ghost" size="sm" icon="my_location">
            Voir
          </Button>
        )}
        {!resolved && onResolve && (
          <Button onClick={onResolve} variant="secondary" size="sm" icon="healing">
            Résoudre
          </Button>
        )}
      </div>
    </div>
  );
}
