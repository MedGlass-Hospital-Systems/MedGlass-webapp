"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils/cn";

const mainNav = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: "dashboard" },
  { href: "/planning", label: "Planning", icon: "calendar_month" },
  { href: "/wizard", label: "Assistant IA", icon: "auto_fix" },
  { href: "/skills", label: "Compétences", icon: "psychology" },
  { href: "/recruitment", label: "Recrutement", icon: "work_history" },
];

const footerNav = [
  { href: "/help", label: "Centre d'aide", icon: "help" },
  { href: "/logout", label: "Déconnexion", icon: "logout" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="h-screen w-64 left-0 top-0 fixed flex flex-col pt-20 pb-4 glass-strong border-r border-white/10 shadow-md z-40 hidden md:flex">
      <div className="px-6 pb-6 mb-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          
          <div>
            <h2 className="text-base font-semibold text-primary leading-tight">CHU Saint-Marie</h2>
            <p className="text-body-sm text-on-surface-variant">Chirurgie générale</p>
          </div>
        </div>
        <Link
          href="/planning/new"
          className="w-full py-2 px-4 rounded-lg bg-primary text-on-primary font-label-caps text-label-caps flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity"
        >
          <Icon name="add" className="text-[18px]" />
          Nouveau planning
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 flex items-center gap-3 rounded-lg font-label-caps text-label-caps transition-all duration-300",
                active
                  ? "bg-primary/10 text-primary border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface",
              )}
            >
              <Icon name={item.icon} className="text-[20px]" filled={active} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="px-2 pt-4 border-t border-white/10 flex flex-col gap-1 mt-auto">
        {footerNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-on-surface-variant px-4 py-3 flex items-center gap-3 rounded-lg hover:bg-white/5 hover:text-on-surface transition-all duration-300 font-label-caps text-label-caps"
          >
            <Icon name={item.icon} className="text-[20px]" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
