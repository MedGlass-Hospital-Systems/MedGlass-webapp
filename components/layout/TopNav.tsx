"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils/cn";

const VITRINE_URL = "https://medglass.fr";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/planning", label: "Planning" },
  { href: "/skills", label: "Compétences" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/70 backdrop-blur-[20px] border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-primary" aria-label="Menu">
          <Icon name="menu" />
        </button>
        {/* Logo pointe vers le site vitrine */}
        <a href={VITRINE_URL} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Icon name="local_hospital" className="text-primary text-[20px]" filled />
          </span>
          <span className="text-xl font-bold text-primary tracking-tight">Nexivia</span>
        </a>
      </div>

      <nav className="hidden md:flex items-center gap-8 h-full">
        {links.map((link) => {
          const active = pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "h-full flex items-center transition-colors duration-200 text-sm",
                active
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : "text-on-surface-variant hover:text-primary",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <button
          className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5"
          aria-label="Notifications"
        >
          <Icon name="notifications" />
        </button>
        <Link
          href="/settings"
          className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5"
          aria-label="Paramètres"
        >
          <Icon name="settings" />
        </Link>
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full border-2 border-surface-container-high bg-primary/20 flex items-center justify-center text-primary text-xs font-bold"
          aria-label="Profil"
        >
          SJ
        </Link>
      </div>
    </header>
  );
}
