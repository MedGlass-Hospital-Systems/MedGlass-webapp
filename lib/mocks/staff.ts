import type { Staff, Service } from "@/lib/types/planning";

export const services: Service[] = [
  { id: "chir-gen", name: "Chirurgie générale", shortName: "Chir. Gén.", staffCount: 24, color: "primary" },
  { id: "rea", name: "Réanimation - Soins intensifs", shortName: "Réa / SI", staffCount: 18, color: "tertiary" },
  { id: "cardio", name: "Cardiologie", shortName: "Cardio", staffCount: 16, color: "secondary" },
  { id: "neuro", name: "Neurologie", shortName: "Neuro", staffCount: 12, color: "primary" },
  { id: "urgences", name: "Urgences", shortName: "Urg.", staffCount: 32, color: "error" },
  { id: "pediatrie", name: "Pédiatrie", shortName: "Péd.", staffCount: 14, color: "secondary" },
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
    skills: ["Chirurgie viscérale", "Cœlioscopie", "Bloc d'urgence"],
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
    skills: ["Suture", "Hospitalisation"],
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
    skills: ["Bloc opératoire", "Encadrement"],
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
    skills: ["Réanimation médicale", "ECMO", "Échographie"],
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
    skills: ["Coronarographie", "Holter"],
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
    skills: ["Soins post-op", "Pansements complexes"],
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
    skills: ["Mobilisation", "Hygiène"],
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
    skills: ["Intubation", "VVC"],
  },
];

export function getStaffById(id: string) {
  return staff.find((s) => s.id === id);
}

export function getStaffByService(serviceId: string) {
  return staff.filter((s) => s.service === serviceId);
}
