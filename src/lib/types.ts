export type PatientDTO = {
  id: string;
  code: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  conditions: string[];
  language: "en" | "te" | "hi";
  consentAt: string;
  history: { category: string; description: string }[];
  allergies: string[];
  lifestyle: Record<string, string>;
  clinical: Record<string, string>;
  prescription?: PrescriptionItemInput[];
};

export type PrescriptionItemInput = {
  medicineName: string;
  strength: string;
  doseText: string;
  frequencyCode: string;
  durationDays: number;
  timingCode: string;
  specialInstructions: string;
};

export type RegisterPatientInput = {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  conditions: string[];
  consent: boolean;
  consentText: string;
  prescription: PrescriptionItemInput[];
};

export type GeneratedSlot = {
  itemIndex: number;
  medicineName: string;
  strength: string;
  doseText: string;
  slotCode: "MORNING" | "AFTERNOON" | "NIGHT";
  instructions: string;
  durationDays: number;
  source: "EXPLICIT" | "FREQUENCY_RULE";
  needsReview: boolean;
};
