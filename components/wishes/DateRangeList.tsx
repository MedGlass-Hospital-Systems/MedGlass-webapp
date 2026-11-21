"use client";

import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { EmptyState } from "@/components/ui/Layout";
import { Icon } from "@/components/layout/Icon";
import { rangeDates } from "@/lib/utils/dates";

export interface RangeItem {
  startDate: string;
  endDate: string;
  extra: string;
}

/** Liste éditable de périodes (congés ou absences) bornée à la période du planning. */
export function DateRangeList({
  items,
  onChange,
  min,
  max,
  extraLabel,
  extraOptions,
  extraPlaceholder,
  emptyTitle,
  addLabel,
}: {
  items: RangeItem[];
  onChange: (items: RangeItem[]) => void;
  min: string;
  max: string;
  extraLabel: string;
  /** Si fourni : liste déroulante, sinon champ texte */
  extraOptions?: { value: string; label: string }[];
  extraPlaceholder?: string;
  emptyTitle: string;
  addLabel: string;
}) {
  const update = (i: number, patch: Partial<RangeItem>) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  return (
    <div className="space-y-3">
      {items.length === 0 && <EmptyState icon="event_available" title={emptyTitle} className="py-6" />}
      {items.map((it, i) => {
        const days = it.endDate >= it.startDate ? rangeDates(it.startDate, it.endDate).filter((d) => !d.isWeekend).length : 0;
        return (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-lg border border-white/10 bg-white/[0.02]">
            <Field label="Du">
              <Input type="date" min={min} max={max} value={it.startDate} onChange={(e) => update(i, { startDate: e.target.value, endDate: e.target.value > it.endDate ? e.target.value : it.endDate })} />
            </Field>
            <Field label="Au" hint={`${days} jour(s) ouvré(s)`}>
              <Input type="date" min={it.startDate} max={max} value={it.endDate} onChange={(e) => update(i, { endDate: e.target.value })} />
            </Field>
            <Field label={extraLabel}>
              {extraOptions ? (
                <Select value={it.extra} onChange={(e) => update(i, { extra: e.target.value })}>
                  {extraOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input value={it.extra} placeholder={extraPlaceholder} onChange={(e) => update(i, { extra: e.target.value })} />
              )}
            </Field>
            <button
              type="button"
              aria-label="Supprimer"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="h-11 w-11 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10"
            >
              <Icon name="delete" className="text-[20px]" />
            </button>
          </div>
        );
      })}
      <Button
        variant="secondary"
        size="sm"
        icon="add"
        onClick={() => onChange([...items, { startDate: min, endDate: min, extra: extraOptions?.[0]?.value ?? "" }])}
      >
        {addLabel}
      </Button>
    </div>
  );
}
