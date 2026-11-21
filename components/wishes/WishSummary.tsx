import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/layout/Icon";
import { LEAVE_LABELS, WISH_LEVEL_LABELS, WISH_SLOT_LABELS } from "@/lib/utils/labels";
import { WEEKDAYS_LONG, fmtRange } from "@/lib/utils/dates";
import type { Wish } from "@/lib/types/planning";

type WishContent = Pick<Wish, "leaves" | "preferences" | "absences" | "comment">;

/** Récapitulatif lisible d'une saisie de souhaits (manager et collaborateur). */
export function WishSummary({ wish }: { wish: WishContent }) {
  const prio = wish.preferences.filter((p) => p.level === "prioritaire");
  const avoid = wish.preferences.filter((p) => p.level === "eviter");
  const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div>
      <p className="font-label-caps text-[10px] text-on-surface-variant mb-1.5 flex items-center gap-1.5">
        <Icon name={icon} className="text-[14px]" /> {title}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
  const none = <span className="text-[12px] text-on-surface-variant">Aucun</span>;

  return (
    <div className="space-y-3">
      <Section icon="beach_access" title="Congés">
        {wish.leaves.length
          ? wish.leaves.map((l, i) => (
              <Badge key={i} tone="success">
                {LEAVE_LABELS[l.type]} · {fmtRange(l.startDate, l.endDate)}
              </Badge>
            ))
          : none}
      </Section>
      <Section icon="star" title={WISH_LEVEL_LABELS.prioritaire}>
        {prio.length
          ? prio.map((p, i) => (
              <Badge key={i} tone="primary">
                {WEEKDAYS_LONG[p.weekday]} · {WISH_SLOT_LABELS[p.slot]}
              </Badge>
            ))
          : none}
      </Section>
      <Section icon="do_not_disturb_on" title={WISH_LEVEL_LABELS.eviter}>
        {avoid.length
          ? avoid.map((p, i) => (
              <Badge key={i} tone="warning">
                {WEEKDAYS_LONG[p.weekday]} · {WISH_SLOT_LABELS[p.slot]}
              </Badge>
            ))
          : none}
      </Section>
      <Section icon="event_busy" title="Absences">
        {wish.absences.length
          ? wish.absences.map((a, i) => (
              <Badge key={i} tone="neutral">
                {fmtRange(a.startDate, a.endDate)}
                {a.reason ? ` · ${a.reason}` : ""}
              </Badge>
            ))
          : none}
      </Section>
      {wish.comment && <p className="text-body-sm text-on-surface-variant italic">« {wish.comment} »</p>}
    </div>
  );
}
