import { patients as seedPatients, type Patient } from "@/lib/mock/data";
import type { PatientDTO, PrescriptionItemInput, RegisterPatientInput } from "@/lib/types";

type StoredPatient = Patient & { prescription?: PrescriptionItemInput[] };

/** Process-global demo store so registrations persist across route handlers. */
const globalStore = globalThis as unknown as { __arundhatiDemoPatients?: StoredPatient[] };
const added = globalStore.__arundhatiDemoPatients ?? (globalStore.__arundhatiDemoPatients = []);

function toDTO(patient: StoredPatient): PatientDTO {
  return {
    id: patient.id,
    code: patient.code,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    address: patient.address,
    conditions: patient.conditions,
    language: patient.language,
    consentAt: patient.consentAt,
    history: patient.history,
    allergies: patient.allergies,
    lifestyle: patient.lifestyle,
    clinical: patient.clinical,
    prescription: patient.prescription,
  };
}

export function demoListPatients(): PatientDTO[] {
  return [...seedPatients, ...added].map(toDTO);
}

export function demoGetPatient(id: string): PatientDTO | undefined {
  const found = [...seedPatients, ...added].find((patient) => patient.id === id);
  return found ? toDTO(found) : undefined;
}

export function demoAddPatient(input: RegisterPatientInput): PatientDTO {
  const nextNumber = seedPatients.length + added.length + 1;
  const patient: StoredPatient = {
    id: `pat-${Date.now()}`,
    code: `PNT${1000 + nextNumber}`,
    name: input.fullName,
    age: input.age,
    gender: input.gender,
    phone: input.phone,
    address: input.address,
    conditions: input.conditions,
    language: "en",
    consentAt: new Date().toISOString(),
    history: [],
    allergies: [],
    lifestyle: { alcohol: "", smoking: "", diet: "", activity: "", sleep: "" },
    clinical: { bp: "", glucose: "", hba1c: "", bmi: "" },
    prescription: input.prescription,
  };
  added.push(patient);
  return toDTO(patient);
}
