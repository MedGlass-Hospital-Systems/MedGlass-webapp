export type ShiftType =
  | "jour"
  | "nuit"
  | "garde"
  | "astreinte"
  | "admin"
  | "conges"
  | "rtt"
  | "formation";

export type StaffRole =
  | "praticien"
  | "interne"
  | "chef-service"
  | "cadre"
  | "ide"
  | "as"
  | "secretaire";

/** Rôle applicatif : ce que la personne peut faire dans MedGlass. */
export type AppRole = "admin" | "manager" | "soignant";

export type ContractKind = "titulaire" | "contractuel" | "vacataire" | "interimaire" | "prestataire";

export interface SkillLevel {
  name: string;
  /** 1 (notions) → 5 (expert / référent) */
  level: number;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: StaffRole;
  roleLabel: string;
  service: string;
  appRole: AppRole;
  contract: ContractKind;
  company?: string;
  email: string;
  phone: string;
  contractedHours: number;
  skills: SkillLevel[];
  certifications: string[];
  leaveBalance: { conges: number; rtt: number };
  joinedAt: string;
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  service: string;
  planningId: string | null;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  shortName: string;
  color: string;
  managerId: string | null;
}

export type Severity = "critique" | "elevee" | "moyenne";

export interface Conflict {
  id: string;
  date: string;
  service: string;
  label: string;
  slot: { startTime: string; endTime: string; type: ShiftType };
  requiredRole: StaffRole;
  severity: Severity;
  reason: string;
  status: "ouvert" | "resolu";
  resolvedBy?: string;
}

export type RequestStatus = "en-attente" | "valide" | "refuse";
export type LeaveType = "conges" | "rtt" | "maladie" | "formation" | "maternite";

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: RequestStatus;
  reason?: string;
  createdAt: string;
}

export interface SwapRequest {
  id: string;
  fromStaffId: string;
  toStaffId: string;
  shiftId: string;
  status: "en-attente" | "accepte" | "refuse";
  message?: string;
  createdAt: string;
}

export type RuleCategory = "legal" | "interne" | "equite";

export interface Rule {
  id: string;
  label: string;
  category: RuleCategory;
  enabled: boolean;
  description?: string;
}

export type PlanningStatus = "brouillon" | "collecte" | "generation" | "revision" | "publie";
export type PlanningPeriod = "hebdomadaire" | "bi-hebdomadaire" | "mensuel";

export interface Planning {
  id: string;
  name: string;
  serviceId: string;
  period: PlanningPeriod;
  startDate: string;
  endDate: string;
  status: PlanningStatus;
  createdBy: string;
  createdAt: string;
  publishedAt: string | null;
  wishesDeadline: string | null;
  requestedStaffIds: string[];
  ruleIds: string[];
}

export type WishSlot = "matin" | "apres-midi" | "nuit";
export type WishLevel = "prioritaire" | "possible" | "eviter";

export interface Wish {
  id: string;
  planningId: string;
  staffId: string;
  submittedAt: string;
  leaves: { startDate: string; endDate: string; type: LeaveType }[];
  /** weekday : 0 = lundi … 6 = dimanche */
  preferences: { weekday: number; slot: WishSlot; level: WishLevel }[];
  absences: { startDate: string; endDate: string; reason: string }[];
  comment: string;
}
