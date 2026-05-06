"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/planning", label: "Planning" },
  { href: "/skills", label: "Compétences" },
  { href: "/settings", label: "Paramètres" },
];

interface TopNavProps {
  variant?: "app" | "public";
}

export function TopNav({ variant = "app" }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/70 backdrop-blur-[20px] border-b border-white/10 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-primary" aria-label="Menu">
          <Icon name="menu" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Icon name="local_hospital" className="text-primary text-[20px]" filled />
          </span>
          <span className="text-headline-md font-bold text-primary tracking-tight">MedGlass</span>
        </Link>
      </div>

      {variant === "app" ? (
        <nav className="hidden md:flex items-center gap-8 h-full">
          {links.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "h-full flex items-center transition-colors duration-200 text-body-base",
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
      ) : (
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link href="/#fonctionnalites" className="text-on-surface-variant hover:text-primary transition-colors text-body-base">
            Fonctionnalités
          </Link>
          <Link href="/#metiers" className="text-on-surface-variant hover:text-primary transition-colors text-body-base">
            Métiers
          </Link>
          <Link href="/pricing" className="text-on-surface-variant hover:text-primary transition-colors text-body-base">
            Tarifs
          </Link>
          <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors text-body-base">
            Contact
          </Link>
        </nav>
      )}

      <div className="flex items-center gap-3">
        {variant === "app" ? (
          <>
            <button className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5" aria-label="Notifications">
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
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high shadow-sm bg-primary/20 flex items-center justify-center text-primary font-label-caps"
              aria-label="Profil"
            >
              SJ
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden sm:flex px-4 py-2 rounded-full text-on-surface-variant hover:text-primary text-body-sm transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:opacity-90 transition-opacity"
            >
              Démo gratuite
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
