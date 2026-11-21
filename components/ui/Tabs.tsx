"use client";

import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/layout/Icon";

export interface TabItem<T extends string> {
  id: T;
  label: string;
  icon?: string;
  count?: number;
}

/** Contrôle segmenté (onglets ou bascule de vue). */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
  size = "md",
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="tablist" className={cn("inline-flex flex-wrap gap-1 p-1 rounded-full glass-button", className)}>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(it.id)}
            className={cn(
              "flex items-center gap-2 rounded-full font-label-caps text-label-caps transition-colors focus-ring",
              size === "sm" ? "px-3 py-1.5" : "px-4 py-2",
              active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface hover:bg-white/5",
            )}
          >
            {it.icon && <Icon name={it.icon} className="text-[16px]" filled={active} />}
            {it.label}
            {it.count !== undefined && (
              <span
                className={cn(
                  "min-w-5 px-1.5 rounded-full text-[10px] tabular-nums",
                  active ? "bg-on-primary/20" : "bg-white/10",
                )}
              >
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Pastilles de filtre (sélection simple). */
export function FilterPills<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string; icon?: string; count?: number }[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((f) => {
        const active = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-label-caps transition-colors focus-ring",
              active
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-white/[0.03] text-on-surface-variant border-white/10 hover:bg-white/[0.06]",
            )}
          >
            {f.icon && <Icon name={f.icon} className="text-[14px]" filled={active} />}
            {f.label}
            {f.count !== undefined && <span className="tabular-nums opacity-70">{f.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
