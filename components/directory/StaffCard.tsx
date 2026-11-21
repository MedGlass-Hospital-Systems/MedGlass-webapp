import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/layout/Icon";
import { fullName } from "@/lib/store/hooks";
import { CONTRACT_LABELS, CONTRACT_TONES } from "@/lib/utils/labels";
import type { Staff } from "@/lib/types/planning";

export function StaffCard({ person, serviceName, onOpen }: { person: Staff; serviceName: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="glass-panel rounded-xl p-5 text-left hover:border-white/20 hover:-translate-y-0.5 transition-all focus-ring flex flex-col gap-4"
    >
      <div className="flex items-start gap-3">
        <Avatar initials={person.initials} size="lg" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">{fullName(person, true)}</p>
          <p className="text-body-sm text-on-surface-variant truncate">{person.roleLabel}</p>
          <p className="text-[11px] text-on-surface-variant truncate">{serviceName}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Badge tone={CONTRACT_TONES[person.contract]}>{CONTRACT_LABELS[person.contract]}</Badge>
        {person.company && <Badge tone="neutral">{person.company}</Badge>}
      </div>
      <div className="flex flex-wrap gap-1">
        {person.skills.slice(0, 3).map((s) => (
          <span key={s.name} className="text-[11px] text-on-surface-variant px-2 py-1 rounded-md bg-white/[0.03] border border-white/5">
            {s.name}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-3 border-t border-white/10 flex items-center justify-between text-[12px] text-on-surface-variant">
        <span className="flex items-center gap-1 truncate">
          <Icon name="call" className="text-[14px]" /> {person.phone}
        </span>
        <span className="text-primary flex items-center gap-1">
          Profil <Icon name="arrow_forward" className="text-[14px]" />
        </span>
      </div>
    </button>
  );
}
