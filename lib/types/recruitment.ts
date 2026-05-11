export type JobStatus = "ouvert" | "ferme" | "pourvu";
export type ContractType = "CDI" | "CDD" | "Vacation" | "PHC" | "Mutation" | "Stage";
export type JobPriority = "urgent" | "haute" | "normale";

export interface JobRole {
  id: string;
  title: string;
  service: string;
  serviceLabel: string;
  site: string;
  contractType: ContractType;
  status: JobStatus;
  priority: JobPriority;
  postedAt: string;
  closesAt: string | null;
  applications: number;
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
  initials: string;
  jobId: string;
  jobTitle: string;
  currentRole: string;
  stage: ApplicationStage;
  appliedAt: string;
  experience: number;
  matchScore: number;
  rppsVerified: boolean;
}
