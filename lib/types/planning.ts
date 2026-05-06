export type ShiftType = "jour" | "nuit" | "garde" | "astreinte" | "admin" | "conges" | "rtt" | "formation";

export type StaffRole =
  | "praticien"
  | "interne"
  | "chef-service"
  | "cadre"
  | "ide"
  | "as"
  | "secretaire";

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  role: StaffRole;
  roleLabel: string;
  service: string;
  avatarUrl?: string;
  weeklyHours: number;
  contractedHours: number;
  skills: string[];
}

export interface Shift {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  service: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  shortName: string;
  staffCount: number;
  color: string;
}

export interface PlanningGap {
  id: string;
  date: string;
  service: string;
  shift: string;
  severity: "critique" | "elevee" | "moyenne";
  reason: string;
}

export interface SwapRequest {
  id: string;
  fromStaffId: string;
  toStaffId: string;
  shiftId: string;
  status: "en-attente" | "accepte" | "refuse";
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  startDate: string;
  endDate: string;
  type: "conges" | "rtt" | "maladie" | "formation" | "maternite";
  status: "en-attente" | "valide" | "refuse";
  reason?: string;
}
