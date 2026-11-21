"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/layout/Icon";
import { GlassPanel } from "./GlassPanel";

export interface QuickAction {
  icon: string;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

/** Panneau « Actions rapides » partagé par l'accueil, le planning, les conflits et le recrutement. */
export function QuickActions({
  title = "Actions rapides",
  actions,
  layout = "grid",
  className,
}: {
  title?: string;
  actions: QuickAction[];
  layout?: "grid" | "list";
  className?: string;
}) {
  return (
    <GlassPanel className={cn("p-6 bg-gradient-to-br from-background/70 to-primary/10 border-primary/20", className)}>
      <h2 className="font-label-caps text-label-caps text-primary mb-4">{title}</h2>
      <div className={layout === "grid" ? "grid grid-cols-2 gap-3" : "space-y-2"}>
        {actions.map((a) => {
          const cls = cn(
            "glass-button rounded-lg p-3 text-left hover:bg-white/10 transition-all focus-ring w-full",
            layout === "list" && "flex items-center gap-3",
          );
          const body = (
            <>
              <Icon name={a.icon} className={cn("text-primary text-[20px]", layout === "grid" && "mb-1 block")} />
              <span className="min-w-0">
                <span className="text-body-sm text-on-surface block">{a.label}</span>
                {a.description && <span className="text-[11px] text-on-surface-variant block">{a.description}</span>}
              </span>
            </>
          );
          return a.href ? (
            <Link key={a.label} href={a.href} className={cls}>
              {body}
            </Link>
          ) : (
            <button key={a.label} type="button" onClick={a.onClick} className={cls}>
              {body}
            </button>
          );
        })}
      </div>
    </GlassPanel>
  );
}
