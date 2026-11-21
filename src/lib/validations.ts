import { z } from "zod";
import { CONSENT_TEXT } from "@/lib/config";

export const prescriptionItemSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  strength: z.string().min(1, "Strength is required"),
  doseText: z.string().min(1, "Dose is required"),
  frequencyCode: z.enum(["OD", "BD", "TDS", "QID", "HS", "SOS", "CUSTOM", "UNSPECIFIED"]),
  durationDays: z.coerce.number().int().positive().max(365),
  timingCode: z.enum(["BEFORE_FOOD", "AFTER_FOOD", "ANY", "UNSPECIFIED"]),
  specialInstructions: z.string().default(""),
});

export const registerPatientSchema = z.object({
  fullName: z.string().min(2),
  age: z.coerce.number().int().min(0).max(120),
  gender: z.string().min(1),
  phone: z.string().regex(/^\+?[0-9\s-]{8,16}$/, "Enter a valid phone number"),
  address: z.string().default(""),
  conditions: z.array(z.string()).min(1, "Select at least one condition"),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  consentText: z.literal(CONSENT_TEXT),
  prescription: z.array(prescriptionItemSchema).default([]),
});

export const counsellingSectionSchema = z.object({
  key: z.string(),
  title: z.string(),
  content: z.string().min(1),
  citation: z.string().min(1),
});

export const counsellingOutputSchema = z.object({
  sections: z.array(counsellingSectionSchema),
  warnings: z.array(z.string()).default([]),
});
