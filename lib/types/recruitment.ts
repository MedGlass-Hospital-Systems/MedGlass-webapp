import type { ShiftType, StaffRole } from "./planning";

export type JobStatus = "ouvert" | "ferme" | "pourvu";
export type ContractType = "CDI" | "CDD" | "Vacation" | "PHC" | "Mutation" | "Stage";
export type JobPriority = "urgent" | "haute" | "normale";
export type JobCategory = "medecin" | "paramedical" | "cadre";
/** externe = offre publique, interne = mobilité réservée au personnel */
export type JobScope = "externe" | "interne";

export interface JobRole {
  id: string;
  title: string;
  service: string;
  site: string;
  contractType: ContractType;
  category: JobCategory;
  scope: JobScope;
  status: JobStatus;
  priority: JobPriority;
  postedAt: string;
  closesAt: string | null;
  icon: string;
  description: string;
  requirements: string[];
}

export type ApplicationStage =
  | "nouveau"
  | "preselection"
  | "entretien"
  | "validation"
  | "embauche"
  | "refuse";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  jobId: string;
  currentRole: string;
  stage: ApplicationStage;
  appliedAt: string;
  experience: number;
  matchScore: number;
  rppsVerified: boolean;
  email: string;
  phone: string;
  location: string;
  motivation: string;
  interviewAt: string | null;
}

/** Créneau vacant proposé dans la bourse aux remplacements. */
export interface OpenShift {
  id: string;
  conflictId: string | null;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  service: string;
  requiredRole: StaffRole;
  bonus: string | null;
  status: "ouvert" | "pourvu";
  postedAt: string;
  applicants: string[];
  takenBy: string | null;
}

/** Candidature d'un membre du personnel à une offre de mobilité interne. */
export interface InternalApplication {
  id: string;
  jobId: string;
  staffId: string;
  createdAt: string;
  message: string;
}
