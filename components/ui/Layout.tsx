import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/layout/Icon";

/** En-tête standard d'une page : surtitre, titre, description, actions à droite. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">{eyebrow}</p>}
        <h1 className="text-[32px] md:text-display-lg font-bold text-on-surface leading-tight">{title}</h1>
        {description && <p className="text-on-surface-variant mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

/** Titre d'un panneau avec lien « Tout voir » ou action. */
export function PanelHeader({
  title,
  subtitle,
  href,
  linkLabel = "Tout voir",
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  linkLabel?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex justify-between items-center gap-3 mb-4 pb-3 border-b border-white/10", className)}>
      <div className="min-w-0">
        <h2 className="font-headline-md text-[20px] md:text-headline-md text-on-surface">{title}</h2>
        {subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}
      </div>
      {action}
      {href && (
        <Link href={href} className="shrink-0 text-primary text-body-sm hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  description,
  action,
  className,
}: {
  icon?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-10 px-4", className)}>
      <span className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant mb-3">
        <Icon name={icon} className="text-[24px]" />
      </span>
      <p className="font-semibold text-on-surface">{title}</p>
      {description && <p className="text-body-sm text-on-surface-variant mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, tone = "primary", className }: { value: number; tone?: "primary" | "success" | "warning" | "error"; className?: string }) {
  const color = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", error: "bg-error" }[tone];
  return (
    <div className={cn("h-1.5 rounded-full bg-white/10 overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field rounded-full pl-10 py-2 text-body-sm"
      />
    </div>
  );
}

/** Étapes numérotées (assistant, souhaits, état d'avancement). */
export function Stepper({
  steps,
  current,
  onSelect,
  className,
}: {
  steps: { title: string; icon?: string }[];
  /** index 0-based de l'étape courante */
  current: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  return (
    <ol className={cn("flex items-center gap-2 overflow-x-auto scrollbar-thin", className)}>
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        const clickable = onSelect && i <= current;
        return (
          <li key={s.title} id={`step-target-${i}`} className="flex items-center gap-2 shrink-0 scroll-m-4">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelect?.(i)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-full transition-all",
                active && "bg-primary text-on-primary",
                done && "bg-primary/15 text-primary hover:bg-primary/25",
                !active && !done && "text-on-surface-variant",
                !clickable && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold",
                  active ? "bg-on-primary/20" : done ? "bg-primary/20" : "bg-white/5",
                )}
              >
                {done ? <Icon name="check" className="text-[16px]" /> : i + 1}
              </span>
              <span className="font-label-caps text-label-caps whitespace-nowrap">{s.title}</span>
            </button>
            {i < steps.length - 1 && <span className="w-6 h-px bg-white/10 hidden sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
