/**
 * Libellés et tons visuels centralisés : un seul endroit pour les traductions
 * des énumérations métier et leur couleur (Badge tone / classes Tailwind).
 */
import type {
  AppRole,
  ContractKind,
  LeaveType,
  PlanningStatus,
  RequestStatus,
  RuleCategory,
  Severity,
  ShiftType,
  StaffRole,
  WishLevel,
  WishSlot,
} from "@/lib/types/planning";
import type { ApplicationStage, ContractType, JobCategory, JobPriority } from "@/lib/types/recruitment";
import type { NotificationType } from "@/lib/types/notifications";

export type Tone = "neutral" | "primary" | "success" | "warning" | "error" | "tertiary" | "secondary";

export const SHIFT_LABELS: Record<ShiftType, string> = {
  jour: "Jour",
  nuit: "Nuit",
  garde: "Garde",
  astreinte: "Astreinte",
  admin: "Admin",
  conges: "Congés",
  rtt: "RTT",
  formation: "Formation",
};

/** Abréviations pour la vue mois. */
export const SHIFT_SHORT: Record<ShiftType, string> = {
  jour: "J",
  nuit: "N",
  garde: "G",
  astreinte: "A",
  admin: "Ad",
  conges: "C",
  rtt: "R",
  formation: "F",
};

/** Classes de case pour la grille de planning. */
export const SHIFT_STYLES: Record<ShiftType, string> = {
  jour: "bg-primary/20 border-primary/30 text-primary",
  nuit: "bg-tertiary/20 border-tertiary/30 text-tertiary",
  garde: "bg-error/20 border-error/30 text-error",
  astreinte: "bg-warning/15 border-warning/30 text-warning",
  admin: "bg-white/5 border-white/10 text-on-surface-variant",
  conges: "bg-success/15 border-success/30 text-success",
  rtt: "bg-success/15 border-success/30 text-success",
  formation: "bg-secondary/15 border-secondary/30 text-secondary",
};

/** Pastille de légende. */
export const SHIFT_DOTS: Record<ShiftType, string> = {
  jour: "bg-primary",
  nuit: "bg-tertiary",
  garde: "bg-error",
  astreinte: "bg-warning",
  admin: "bg-on-surface-variant",
  conges: "bg-success",
  rtt: "bg-success",
  formation: "bg-secondary",
};

export const LEGEND_TYPES: ShiftType[] = ["jour", "nuit", "garde", "astreinte", "conges", "formation", "admin"];

/** Types qui comptent comme du temps travaillé dans les décomptes d'heures. */
export const WORKED_TYPES: ShiftType[] = ["jour", "nuit", "garde", "admin", "formation"];
export const ABSENCE_TYPES: ShiftType[] = ["conges", "rtt"];

export const ROLE_LABELS: Record<StaffRole, string> = {
  praticien: "Praticien",
  interne: "Interne",
  "chef-service": "Chef de service",
  cadre: "Cadre de santé",
  ide: "IDE",
  as: "Aide-soignant",
  secretaire: "Secrétaire",
};

export const isDoctor = (role: StaffRole) => role === "praticien" || role === "interne" || role === "chef-service";

export const APP_ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrateur",
  manager: "Manager",
  soignant: "Collaborateur",
};

export const APP_ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  admin: "Tous les droits, y compris la gestion des rôles et l'incarnation.",
  manager: "Crée et publie les plannings, valide les demandes, recrute.",
  soignant: "Consulte son planning, fait des demandes, saisit ses souhaits.",
};

export const CONTRACT_LABELS: Record<ContractKind, string> = {
  titulaire: "Titulaire",
  contractuel: "Contractuel",
  vacataire: "Vacataire",
  interimaire: "Intérimaire",
  prestataire: "Prestataire",
};

export const CONTRACT_TONES: Record<ContractKind, Tone> = {
  titulaire: "neutral",
  contractuel: "neutral",
  vacataire: "secondary",
  interimaire: "warning",
  prestataire: "tertiary",
};

export const LEAVE_LABELS: Record<LeaveType, string> = {
  conges: "Congés payés",
  rtt: "RTT",
  maladie: "Arrêt maladie",
  formation: "Formation",
  maternite: "Congé maternité / paternité",
};

export const REQUEST_STATUS_LABELS: Record<RequestStatus | "accepte", string> = {
  "en-attente": "En attente",
  valide: "Validé",
  accepte: "Accepté",
  refuse: "Refusé",
};

export const REQUEST_STATUS_TONES: Record<RequestStatus | "accepte", Tone> = {
  "en-attente": "warning",
  valide: "success",
  accepte: "success",
  refuse: "error",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  critique: "Critique",
  elevee: "Élevée",
  moyenne: "Moyenne",
};

export const SEVERITY_TONES: Record<Severity, Tone> = {
  critique: "error",
  elevee: "warning",
  moyenne: "neutral",
};

export const SEVERITY_DOTS: Record<Severity, string> = {
  critique: "bg-error",
  elevee: "bg-warning",
  moyenne: "bg-white/30",
};

export const SEVERITY_ORDER: Record<Severity, number> = { critique: 0, elevee: 1, moyenne: 2 };

export const RULE_CATEGORY_LABELS: Record<RuleCategory, string> = {
  legal: "Légal",
  interne: "Règle interne",
  equite: "Équité",
};

export const PLANNING_STATUS_LABELS: Record<PlanningStatus, string> = {
  brouillon: "Brouillon",
  collecte: "Collecte des souhaits",
  generation: "Prêt à générer",
  revision: "En révision",
  publie: "Publié",
};

export const PLANNING_STATUS_TONES: Record<PlanningStatus, Tone> = {
  brouillon: "neutral",
  collecte: "warning",
  generation: "tertiary",
  revision: "primary",
  publie: "success",
};

export const PLANNING_STATUS_ORDER: PlanningStatus[] = ["brouillon", "collecte", "generation", "revision", "publie"];

export const WISH_SLOT_LABELS: Record<WishSlot, string> = {
  matin: "Matin",
  "apres-midi": "Après-midi",
  nuit: "Nuit",
};

export const WISH_LEVEL_LABELS: Record<WishLevel, string> = {
  prioritaire: "Prioritaire",
  possible: "Possible",
  eviter: "À éviter",
};

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  nouveau: "Nouveau",
  preselection: "Présélection",
  entretien: "Entretien",
  validation: "Validation RH",
  embauche: "Embauché",
  refuse: "Refusé",
};

export const STAGE_TEXT: Record<ApplicationStage, string> = {
  nouveau: "text-on-surface-variant",
  preselection: "text-primary",
  entretien: "text-tertiary",
  validation: "text-secondary",
  embauche: "text-success",
  refuse: "text-error",
};

export const PRIORITY_LABELS: Record<JobPriority, string> = {
  urgent: "Urgent",
  haute: "Priorité haute",
  normale: "Normale",
};

export const PRIORITY_TONES: Record<JobPriority, Tone> = {
  urgent: "error",
  haute: "warning",
  normale: "neutral",
};

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  medecin: "Médecins",
  paramedical: "Paramédical",
  cadre: "Cadre",
};

export const CONTRACT_TYPES: ContractType[] = ["CDI", "CDD", "Vacation", "PHC", "Mutation", "Stage"];

export const NOTIFICATION_LABELS: Record<NotificationType, string> = {
  mail: "Messages",
  poste: "Postes & candidatures",
  planning: "Planning & conflits",
  souhaits: "Souhaits de planning",
  demande: "Demandes (congés, échanges)",
};

export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  mail: "mail",
  poste: "work",
  planning: "calendar_month",
  souhaits: "favorite",
  demande: "edit_calendar",
};

export const scoreTone = (score: number): Tone => (score >= 85 ? "success" : score >= 70 ? "primary" : "neutral");
