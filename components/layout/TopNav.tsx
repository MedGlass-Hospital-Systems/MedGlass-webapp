"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";
import { MobileNav } from "./Sidebar";
import { cn } from "@/lib/utils/cn";
import { APP_NAME, TOP_LINKS, VITRINE_URL } from "@/lib/config/navigation";
import { Menu, MenuItem } from "@/components/ui/Menu";
import { Avatar } from "@/components/ui/Avatar";
import { useDemoStore } from "@/lib/store/demoStore";
import { fullName, useCurrentUser, useMyNotifications, usePermissions } from "@/lib/store/hooks";
import { NOTIFICATION_ICONS } from "@/lib/utils/labels";
import { fromNow } from "@/lib/utils/dates";
import { ImpersonateModal } from "@/components/team/ImpersonateModal";
import { RoleManagementModal } from "@/components/team/RoleManagementModal";
import { APP_ROLE_LABELS } from "@/lib/utils/labels";
import { toast } from "@/lib/store/toastStore";

function NotificationsMenu() {
  const router = useRouter();
  const notifications = useMyNotifications();
  const user = useCurrentUser();
  const markRead = useDemoStore((s) => s.markNotificationRead);
  const markAll = useDemoStore((s) => s.markAllRead);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Menu
      className="w-[min(380px,calc(100vw-2rem))] py-0"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5 focus-ring"
          aria-label={`Notifications (${unread} non lues)`}
        >
          <Icon name="notifications" filled={unread > 0} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="font-semibold text-on-surface">Notifications</p>
            {unread > 0 && (
              <button type="button" onClick={() => markAll(user.id)} className="text-primary text-[12px] hover:underline">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
            {notifications.length === 0 && (
              <p className="px-4 py-8 text-center text-body-sm text-on-surface-variant">Aucune notification</p>
            )}
            {notifications.slice(0, 8).map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  markRead(n.id);
                  close();
                  if (n.link) router.push(n.link);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 flex gap-3 hover:bg-white/5 transition-colors border-b border-white/5",
                  !n.read && "bg-primary/[0.04]",
                )}
              >
                <span className="w-8 h-8 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Icon name={NOTIFICATION_ICONS[n.type]} className="text-[16px]" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-body-sm font-semibold text-on-surface truncate">{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                  </span>
                  <span className="block text-[12px] text-on-surface-variant line-clamp-2">{n.body}</span>
                  <span className="block text-[10px] text-on-surface-variant/70 mt-1">{fromNow(n.createdAt)}</span>
                </span>
              </button>
            ))}
          </div>
          <Link
            href="/settings#notifications"
            onClick={close}
            className="block text-center py-3 text-primary text-body-sm hover:bg-white/5 rounded-b-xl"
          >
            Voir toutes les notifications
          </Link>
        </div>
      )}
    </Menu>
  );
}

function UserMenu() {
  const user = useCurrentUser();
  const { canImpersonate, canManageRoles } = usePermissions();
  const impersonating = useDemoStore((s) => s.impersonatingId);
  const impersonate = useDemoStore((s) => s.impersonate);
  const resetDemo = useDemoStore((s) => s.resetDemo);
  const router = useRouter();
  const [modal, setModal] = useState<"impersonate" | "roles" | null>(null);

  return (
    <>
      <Menu
        trigger={({ toggle }) => (
          <button type="button" onClick={toggle} className="rounded-full focus-ring" aria-label="Menu du compte">
            <Avatar initials={user.initials} size="md" className="border-2 border-surface-container-high" />
          </button>
        )}
      >
        {(close) => (
          <>
            <div className="px-4 pb-3 mb-1 border-b border-white/10">
              <p className="font-semibold text-on-surface">{fullName(user, true)}</p>
              <p className="text-[12px] text-on-surface-variant">
                {user.roleLabel} · {APP_ROLE_LABELS[user.appRole]}
              </p>
            </div>
            <MenuItem
              icon={<Icon name="person" className="text-[18px] text-primary" />}
              onClick={() => {
                close();
                router.push("/settings#profile");
              }}
            >
              Mon profil
            </MenuItem>
            {canImpersonate && (
              <MenuItem
                icon={<Icon name="supervised_user_circle" className="text-[18px] text-primary" />}
                description="Voir l'application comme un collaborateur"
                onClick={() => {
                  close();
                  setModal("impersonate");
                }}
              >
                Incarner une personne
              </MenuItem>
            )}
            {impersonating && (
              <MenuItem
                icon={<Icon name="undo" className="text-[18px] text-warning" />}
                onClick={() => {
                  close();
                  impersonate(null);
                  toast("Retour à votre compte");
                }}
              >
                Revenir à mon compte
              </MenuItem>
            )}
            {canManageRoles && (
              <MenuItem
                icon={<Icon name="admin_panel_settings" className="text-[18px] text-primary" />}
                onClick={() => {
                  close();
                  setModal("roles");
                }}
              >
                Gestion des rôles
              </MenuItem>
            )}
            <div className="my-1 border-t border-white/10" />
            <MenuItem
              icon={<Icon name="restart_alt" className="text-[18px] text-on-surface-variant" />}
              description="Recharge les données de départ"
              onClick={() => {
                close();
                resetDemo();
                toast("Démo réinitialisée");
              }}
            >
              Réinitialiser la démo
            </MenuItem>
          </>
        )}
      </Menu>
      <ImpersonateModal open={modal === "impersonate"} onClose={() => setModal(null)} />
      <RoleManagementModal open={modal === "roles"} onClose={() => setModal(null)} />
    </>
  );
}

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-background/70 backdrop-blur-[20px] border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden text-primary w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-white/5"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Icon name={mobileOpen ? "close" : "menu"} />
          </button>
          {/* Le logo pointe vers le site vitrine */}
          <a href={VITRINE_URL} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Icon name="local_hospital" className="text-primary text-[20px]" filled />
            </span>
            <span className="text-xl font-bold text-primary tracking-tight">{APP_NAME}</span>
          </a>
        </div>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {TOP_LINKS.map((link) => {
            const active = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "h-full flex items-center transition-colors duration-200 text-sm border-b-2",
                  active ? "text-primary font-bold border-primary" : "text-on-surface-variant hover:text-primary border-transparent",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NotificationsMenu />
          <Link
            href="/settings"
            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-on-surface-variant hover:text-primary transition-colors hover:bg-white/5"
            aria-label="Réglages"
          >
            <Icon name="settings" />
          </Link>
          <UserMenu />
        </div>
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
