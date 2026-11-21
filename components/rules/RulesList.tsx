"use client";

import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Form";
import { Icon } from "@/components/layout/Icon";
import { useDemoStore } from "@/lib/store/demoStore";
import { toast } from "@/lib/store/toastStore";
import { RULE_CATEGORY_LABELS } from "@/lib/utils/labels";

/** Liste des règles avec activation ; `editable` ajoute la suppression. */
export function RulesList({ editable = false }: { editable?: boolean }) {
  const rules = useDemoStore((s) => s.rules);
  const toggleRule = useDemoStore((s) => s.toggleRule);
  const removeRule = useDemoStore((s) => s.removeRule);

  return (
    <ul className="space-y-2">
      {rules.map((r) => (
        <li
          key={r.id}
          className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <p className="text-on-surface flex flex-wrap items-center gap-2">
              {r.label}
              <Badge tone={r.category === "legal" ? "primary" : r.category === "equite" ? "tertiary" : "neutral"}>
                {RULE_CATEGORY_LABELS[r.category]}
              </Badge>
            </p>
            {r.description && <p className="text-[12px] text-on-surface-variant mt-1">{r.description}</p>}
          </div>
          {editable && (
            <button
              type="button"
              aria-label={`Supprimer la règle ${r.label}`}
              onClick={() => {
                removeRule(r.id);
                toast("Règle supprimée");
              }}
              className="p-2 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
            >
              <Icon name="delete" className="text-[18px]" />
            </button>
          )}
          <Toggle label={r.label} checked={r.enabled} onChange={() => toggleRule(r.id)} />
        </li>
      ))}
    </ul>
  );
}
