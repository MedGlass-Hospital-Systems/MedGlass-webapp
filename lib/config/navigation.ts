export const VITRINE_URL = "https://medglass.fr";
export const APP_NAME = "MedGlass";

export type NavBadge = "wishes" | "conflicts" | "requests";

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  /** Réservé aux managers / admins */
  managerOnly?: boolean;
  /** Variante affichée aux collaborateurs (sans droits manager) */
  staffVariant?: { href: string; label: string; icon?: string };
  badge?: NavBadge;
}

export const MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: "dashboard" },
  { href: "/planning", label: "Planning", icon: "calendar_month" },
  { href: "/souhaits", label: "Mes souhaits", icon: "favorite", badge: "wishes" },
  { href: "/wizard", label: "Assistant IA", icon: "auto_fix", managerOnly: true },
  { href: "/conflits", label: "Conflits", icon: "warning", managerOnly: true, badge: "conflicts" },
  { href: "/demandes", label: "Demandes", icon: "edit_calendar", badge: "requests" },
  { href: "/annuaire", label: "Annuaire", icon: "contacts" },
  {
    href: "/recruitment",
    label: "Recrutement",
    icon: "work_history",
    staffVariant: { href: "/recruitment?onglet=bourse", label: "Bourse au poste", icon: "swap_horizontal_circle" },
  },
];

export const FOOTER_NAV: NavItem[] = [
  { href: "/aide", label: "Tutos & aide", icon: "help" },
  { href: "/settings", label: "Réglages", icon: "settings" },
];

export const TOP_LINKS = [
  { href: "/dashboard", label: "Accueil" },
  { href: "/planning", label: "Planning" },
  { href: "/annuaire", label: "Annuaire" },
];
