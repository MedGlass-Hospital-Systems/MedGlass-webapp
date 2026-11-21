"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils/cn";
import { FOOTER_NAV, MAIN_NAV, VITRINE_URL, type NavBadge } from "@/lib/config/navigation";
import { useDemoStore } from "@/lib/store/demoStore";
import { useCurrentUser, usePendingWishRequests, usePermissions } from "@/lib/store/hooks";

function useBadges(): Record<NavBadge, number> {
  const user = useCurrentUser();
  const { isManager } = usePermissions();
  const wishes = usePendingWishRequests().length;
  const conflicts = useDemoStore((s) => s.conflicts.filter((c) => c.status === "ouvert").length);
  const leaves = useDemoStore((s) => s.leaves);
  const swaps = useDemoStore((s) => s.swaps);
  const requests = useMemo(() => {
    if (isManager) return leaves.filter((l) => l.status === "en-attente").length;
    return swaps.filter((s) => s.toStaffId === user.id && s.status === "en-attente").length;
  }, [isManager, leaves, swaps, user.id]);
  return { wishes, conflicts, requests };
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { isManager } = usePermissions();
  const badges = useBadges();

  const items = MAIN_NAV.filter((i) => !i.managerOnly || isManager).map((i) =>
    !isManager && i.staffVariant ? { ...i, ...i.staffVariant, icon: i.staffVariant.icon ?? i.icon } : i,
  );

  const linkCls = (active: boolean) =>
    cn(
      "px-4 py-3 flex items-center gap-3 rounded-lg font-label-caps text-label-caps transition-all duration-300",
      active
        ? "bg-primary/10 text-primary border-r-4 border-primary"
        : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
    );

  const isActive = (href: string) => {
    const path = href.split("?")[0];
    return pathname === path || pathname?.startsWith(path + "/");
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-1 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          const count = item.badge ? badges[item.badge] : 0;
          return (
            <Link key={item.label} href={item.href} onClick={onNavigate} className={linkCls(active)}>
              <Icon name={item.icon} className="text-[20px]" filled={active} />
              <span className="flex-1">{item.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center tabular-nums",
                    item.badge === "conflicts" ? "bg-error/25 text-error" : "bg-primary/25 text-primary",
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="px-2 pt-4 border-t border-white/10 flex flex-col gap-1 mt-auto">
        {FOOTER_NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={onNavigate} className={linkCls(isActive(item.href))}>
            <Icon name={item.icon} className="text-[20px]" filled={isActive(item.href)} />
            {item.label}
          </Link>
        ))}
        <a href={VITRINE_URL} className={linkCls(false)}>
          <Icon name="logout" className="text-[20px]" />
          Déconnexion
        </a>
      </div>
    </>
  );
}
