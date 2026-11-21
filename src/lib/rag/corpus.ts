/**
 * Local, approved-demo corpus. In production this is replaced by pgvector
 * retrieval over KnowledgeRelease → KnowledgeDocument → KnowledgeChunk.
 * Every chunk carries the metadata that must be approved by the clinical lead.
 */

export type CorpusChunk = {
  id: string;
  condition: string;
  category: "GENERAL" | "DISEASE" | "MEDICATION" | "ACTIVITY" | "DIET" | "LIFESTYLE" | "WARNING";
  title: string;
  content: string;
  citation: string;
  version: string;
};

export const corpusChunks: CorpusChunk[] = [
  {
    id: "GEN-MED-01",
    condition: "GENERAL",
    category: "MEDICATION",
    title: "Medication Adherence",
    content:
      "Take every medicine at the time written in your verified prescription. Do not change the dose, frequency, duration or timing on your own. If a dose is missed, do not double the next dose unless a pharmacist or doctor tells you to. Keep your medicines in their original packaging and use a reminder chart if helpful.",
    citation: "[S2] Approved Medication Counselling Guideline v1.4",
    version: "KB-2026-11-v1",
  },
  {
    id: "GEN-WARN-01",
    condition: "GENERAL",
    category: "WARNING",
    title: "Warning Signs and Important Precautions",
    content:
      "Seek medical attention for chest pain, severe breathlessness, confusion, fainting, or blood sugar that remains very high or very low. Do not stop prescribed medicines without advice from your pharmacist or doctor.",
    citation: "[S6] Approved Warning Signs Guideline v1.0",
    version: "KB-2026-11-v1",
  },
  {
    id: "DM-DIS-01",
    condition: "DM",
    category: "DISEASE",
    title: "Understanding Diabetes",
    content:
      "Diabetes raises blood sugar over time and can affect the heart, kidneys, eyes and nerves. Regular medicines, monitoring and lifestyle changes help prevent complications. Keep follow-up appointments and record home readings.",
    citation: "[S1] Approved Diabetes Counselling Guideline v2.1",
    version: "KB-2026-11-v1",
  },
  {
    id: "DM-DIET-01",
    condition: "DM",
    category: "DIET",
    title: "Dietary Modifications",
    content:
      "Limit sugar and refined carbohydrates. Prefer whole grains, vegetables, pulses and lean protein. Take medicines with food only when the prescription or pharmacist says to.",
    citation: "[S4] Approved Dietary Guideline v2.0",
    version: "KB-2026-11-v1",
  },
  {
    id: "DM-ACT-01",
    condition: "DM",
    category: "ACTIVITY",
    title: "Physical Activity",
    content:
      "Aim for a gentle 20–30 minute walk each day, as tolerated. Stop and seek advice if you feel chest pain, severe breathlessness or dizziness.",
    citation: "[S3] Approved Physical Activity Guideline v1.2",
    version: "KB-2026-11-v1",
  },
  {
    id: "HTN-DIS-01",
    condition: "HTN",
    category: "DISEASE",
    title: "Understanding Hypertension",
    content:
      "High blood pressure often has no symptoms but increases the risk of stroke and heart disease. Take blood pressure medicines regularly and check your readings at home as advised.",
    citation: "[S7] Approved Hypertension Guideline v1.3",
    version: "KB-2026-11-v1",
  },
  {
    id: "HTN-DIET-01",
    condition: "HTN",
    category: "DIET",
    title: "Salt and Blood Pressure",
    content:
      "Limit salt and processed foods. Read labels where available and prefer fresh foods. Maintain a healthy weight and follow the fluid advice given by your care team.",
    citation: "[S8] Approved Hypertension Diet Guideline v1.1",
    version: "KB-2026-11-v1",
  },
  {
    id: "CKD-DIS-01",
    condition: "CKD",
    category: "DISEASE",
    title: "Kidney Precautions",
    content:
      "Stay hydrated only as advised by your doctor. Avoid painkillers unless prescribed. Keep kidney function tests and follow-up appointments as scheduled.",
    citation: "[S9] Approved Kidney Care Guideline v1.0",
    version: "KB-2026-11-v1",
  },
  {
    id: "GEN-LIFE-01",
    condition: "GENERAL",
    category: "LIFESTYLE",
    title: "Lifestyle Modifications",
    content:
      "Limit alcohol, get regular sleep and manage stress. Continue the lifestyle changes discussed with your care team.",
    citation: "[S5] Approved Lifestyle Guideline v1.1",
    version: "KB-2026-11-v1",
  },
];

export function retrieveChunks(conditions: string[]): CorpusChunk[] {
  const wanted = new Set(conditions.map((condition) => condition.toUpperCase()));
  return corpusChunks.filter((chunk) => chunk.condition === "GENERAL" || wanted.has(chunk.condition.toUpperCase()));
}

export function retrieveForIvr(conditions: string[]): string {
  const chunks = retrieveChunks(conditions).filter((chunk) =>
    ["DISEASE", "MEDICATION", "WARNING"].includes(chunk.category),
  );
  return chunks.length
    ? chunks.map((chunk) => chunk.content).join(" ")
    : "No condition-specific approved content is available. A pharmacist will contact you.";
}
