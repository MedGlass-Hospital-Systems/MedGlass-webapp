import type { Staff, Service } from "@/lib/types/planning";

export const services: Service[] = [
  {
    id: "chir-gen", name: "Chirurgie générale", shortName: "Chir. Gén.", staffCount: 24, color: "primary",
    managerId: null
  },
  {
    id: "rea", name: "Réanimation - Soins intensifs", shortName: "Réa / SI", staffCount: 18, color: "tertiary",
    managerId: null
  },
  {
    id: "cardio", name: "Cardiologie", shortName: "Cardio", staffCount: 16, color: "secondary",
    managerId: null
  },
  {
    id: "neuro", name: "Neurologie", shortName: "Neuro", staffCount: 12, color: "primary",
    managerId: null
  },
  {
    id: "urgences", name: "Urgences", shortName: "Urg.", staffCount: 32, color: "error",
    managerId: null
  },
  {
    id: "pediatrie", name: "Pédiatrie", shortName: "Péd.", staffCount: 14, color: "secondary",
    managerId: null
  },
];

export const staff: Staff[] = [
  {
    id: "s1",
    firstName: "Sarah",
    lastName: "Jenkins",
    initials: "SJ",
    role: "praticien",
    roleLabel: "Praticien hospitalier",
    service: "chir-gen",
    weeklyHours: 48,
    contractedHours: 48,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Suture" }, { level: 9, name: "Hospitalisation" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s2",
    firstName: "Marc",
    lastName: "Wei",
    initials: "MW",
    role: "interne",
    roleLabel: "Interne PGY3",
    service: "chir-gen",
    weeklyHours: 52,
    contractedHours: 48,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Suture" }, { level: 9, name: "Hospitalisation" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s3",
    firstName: "Élise",
    lastName: "Kovacs",
    initials: "EK",
    role: "ide",
    roleLabel: "IDE Cadre",
    service: "chir-gen",
    weeklyHours: 35,
    contractedHours: 35,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Bloc opératoire" }, { level: 9, name: "Encadrement" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s4",
    firstName: "Léa",
    lastName: "Chen",
    initials: "LC",
    role: "praticien",
    roleLabel: "Praticien hospitalier",
    service: "rea",
    weeklyHours: 50,
    contractedHours: 48,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [
      { level: 9, name: "Réanimation médicale" },
      { level: 9, name: "ECMO" },
      { level: 9, name: "Échographie" }
    ],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s5",
    firstName: "Amir",
    lastName: "Patel",
    initials: "AP",
    role: "praticien",
    roleLabel: "Praticien attaché",
    service: "cardio",
    weeklyHours: 39,
    contractedHours: 39,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Coronarographie" }, { level: 9, name: "Holter" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s6",
    firstName: "Camille",
    lastName: "Roux",
    initials: "CR",
    role: "ide",
    roleLabel: "IDE",
    service: "chir-gen",
    weeklyHours: 35,
    contractedHours: 35,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Soins post-op" }, { level: 9, name: "Pansements complexes" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s7",
    firstName: "Nathan",
    lastName: "Berger",
    initials: "NB",
    role: "as",
    roleLabel: "Aide-soignant",
    service: "chir-gen",
    weeklyHours: 35,
    contractedHours: 35,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Mobilisation" }, { level: 9, name: "Hygiène" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
  {
    id: "s8",
    firstName: "Sofia",
    lastName: "Martinez",
    initials: "SM",
    role: "interne",
    roleLabel: "Interne PGY2",
    service: "rea",
    weeklyHours: 48,
    contractedHours: 48,
    appRole: "admin",
    contract: "titulaire",
    email: "",
    phone: "",
    skills: [{ level: 9, name: "Intubation" }, { level: 9, name: "VVC" }],
    certifications: [],
    leaveBalance: {
      conges: 0,
      rtt: 0
    },
    joinedAt: ""
  },
];

export function getStaffById(id: string) {
  return staff.find((s) => s.id === id);
}

export function getStaffByService(serviceId: string) {
  return staff.filter((s) => s.service === serviceId);
}
