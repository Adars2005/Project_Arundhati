/**
 * Synthetic data for the zero-cost prototype. Every record is fictional and
 * every screen that renders it carries the DEMO MODE · SIMULATED DATA badge.
 */

export type Patient = {
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
  lifestyle: { alcohol: string; smoking: string; diet: string; activity: string; sleep: string };
  clinical: { bp: string; glucose: string; hba1c: string; bmi: string };
};

export const patients: Patient[] = [
  {
    id: "pat-1001",
    code: "PNT1001",
    name: "Ramesh Kumar",
    age: 50,
    gender: "Male",
    phone: "+91 9876543210",
    address: "12-3-45, Chembur, Mumbai",
    conditions: ["DM", "HTN"],
    language: "en",
    consentAt: "2026-11-18T09:12:00+05:30",
    history: [
      { category: "Comorbidity", description: "Hypertension — diagnosed 2019" },
      { category: "Past medical", description: "No prior hospitalisation" },
      { category: "Family history", description: "Father: type 2 diabetes" },
    ],
    allergies: ["Penicillin — rash"],
    lifestyle: {
      alcohol: "Occasional",
      smoking: "Never",
      diet: "Mixed, high carbohydrate",
      activity: "Walking 20 min/day",
      sleep: "6–7 hours",
    },
    clinical: { bp: "138/86 mmHg", glucose: "FBS 148 mg/dL", hba1c: "7.6%", bmi: "26.4" },
  },
  {
    id: "pat-1002",
    code: "PNT1002",
    name: "Sunita Devi",
    age: 58,
    gender: "Female",
    phone: "+91 9876543211",
    address: "7/A, Andheri West, Mumbai",
    conditions: ["DM"],
    language: "en",
    consentAt: "2026-11-18T10:02:00+05:30",
    history: [{ category: "Comorbidity", description: "None recorded" }],
    allergies: [],
    lifestyle: { alcohol: "No", smoking: "No", diet: "Vegetarian", activity: "Light housework", sleep: "7 hours" },
    clinical: { bp: "124/78 mmHg", glucose: "FBS 132 mg/dL", hba1c: "7.1%", bmi: "24.1" },
  },
  {
    id: "pat-1003",
    code: "PNT1003",
    name: "Arjun Mehta",
    age: 44,
    gender: "Male",
    phone: "+91 9876543212",
    address: "22, Bandra East, Mumbai",
    conditions: ["HTN"],
    language: "en",
    consentAt: "2026-11-18T11:20:00+05:30",
    history: [{ category: "Family history", description: "Mother: hypertension" }],
    allergies: [],
    lifestyle: { alcohol: "Weekly", smoking: "Former", diet: "Mixed", activity: "Gym 3×/week", sleep: "6 hours" },
    clinical: { bp: "152/94 mmHg", glucose: "FBS 98 mg/dL", hba1c: "5.6%", bmi: "27.8" },
  },
  {
    id: "pat-1004",
    code: "PNT1004",
    name: "Lakshmi Rao",
    age: 63,
    gender: "Female",
    phone: "+91 9876543213",
    address: "4-9, Thane West",
    conditions: ["DM", "HTN", "CKD"],
    language: "en",
    consentAt: "2026-11-19T08:45:00+05:30",
    history: [{ category: "Comorbidity", description: "Chronic kidney disease stage 3" }],
    allergies: ["Sulfa drugs"],
    lifestyle: { alcohol: "No", smoking: "No", diet: "Low salt advised", activity: "Limited", sleep: "7 hours" },
    clinical: { bp: "146/88 mmHg", glucose: "FBS 156 mg/dL", hba1c: "8.0%", bmi: "25.2" },
  },
  {
    id: "pat-1005",
    code: "PNT1005",
    name: "Vikram Singh",
    age: 39,
    gender: "Male",
    phone: "+91 9876543214",
    address: "18, Powai, Mumbai",
    conditions: ["DM"],
    language: "en",
    consentAt: "2026-11-19T14:10:00+05:30",
    history: [{ category: "Comorbidity", description: "None recorded" }],
    allergies: [],
    lifestyle: { alcohol: "Daily", smoking: "Daily", diet: "Irregular meals", activity: "Sedentary", sleep: "5 hours" },
    clinical: { bp: "130/82 mmHg", glucose: "FBS 162 mg/dL", hba1c: "8.2%", bmi: "29.1" },
  },
  {
    id: "pat-1006",
    code: "PNT1006",
    name: "Meena Iyer",
    age: 55,
    gender: "Female",
    phone: "+91 9876543215",
    address: "9, Dadar, Mumbai",
    conditions: ["HTN", "DYSLIPIDEMIA"],
    language: "en",
    consentAt: "2026-11-20T09:30:00+05:30",
    history: [{ category: "Comorbidity", description: "Dyslipidaemia — on statin" }],
    allergies: [],
    lifestyle: { alcohol: "No", smoking: "No", diet: "Low fat", activity: "Walking 30 min/day", sleep: "7 hours" },
    clinical: { bp: "142/90 mmHg", glucose: "FBS 104 mg/dL", hba1c: "5.9%", bmi: "26.0" },
  },
];

export type ScheduleSlot = {
  id: string;
  time: "Morning" | "Afternoon" | "Night";
  displayTime: string;
  medicine: string;
  strength: string;
  dose: string;
  instructions: string;
  duration: string;
  source: "VERIFIED_PRESCRIPTION";
};

export const scheduleSlots: ScheduleSlot[] = [
  {
    id: "slot-1",
    time: "Morning",
    displayTime: "08:00 AM",
    medicine: "Metformin",
    strength: "500 mg",
    dose: "1 tablet",
    instructions: "After food",
    duration: "3 Months",
    source: "VERIFIED_PRESCRIPTION",
  },
  {
    id: "slot-2",
    time: "Afternoon",
    displayTime: "02:00 PM",
    medicine: "Metformin",
    strength: "500 mg",
    dose: "1 tablet",
    instructions: "After food",
    duration: "3 Months",
    source: "VERIFIED_PRESCRIPTION",
  },
  {
    id: "slot-3",
    time: "Night",
    displayTime: "10:00 PM",
    medicine: "Amlodipine",
    strength: "5 mg",
    dose: "1 tablet",
    instructions: "Before Sleep",
    duration: "3 Months",
    source: "VERIFIED_PRESCRIPTION",
  },
  {
    id: "slot-4",
    time: "Night",
    displayTime: "10:00 PM",
    medicine: "Atorvastatin",
    strength: "10 mg",
    dose: "1 tablet",
    instructions: "After food",
    duration: "3 Months",
    source: "VERIFIED_PRESCRIPTION",
  },
];

export type CounsellingSection = {
  key: string;
  title: string;
  content: string;
  citation: string;
};

export const counsellingSections: CounsellingSection[] = [
  {
    key: "DISEASE",
    title: "Understanding the Disease",
    content:
      "Diabetes and high blood pressure can affect your heart, kidneys, eyes and nerves. Taking medicines regularly and making lifestyle changes helps prevent complications. Keep your follow-up appointments and monitor your readings at home.",
    citation: "[S1] Approved Diabetes Counselling Guideline v2.1",
  },
  {
    key: "MEDICATION",
    title: "Medication Adherence",
    content:
      "Take Metformin after food in the morning and afternoon. Take Amlodipine before sleep and Atorvastatin after food as written in your verified prescription. Do not stop or change a dose without speaking to your pharmacist or doctor. If a dose is missed, follow the advice in your counselling guide.",
    citation: "[S2] Approved Medication Counselling Guideline v1.4",
  },
  {
    key: "ACTIVITY",
    title: "Physical Activity",
    content:
      "Aim for a gentle 20–30 minute walk each day, as tolerated. Avoid sudden strenuous activity. Stop and seek advice if you feel chest pain, severe breathlessness or dizziness.",
    citation: "[S3] Approved Physical Activity Guideline v1.2",
  },
  {
    key: "DIET",
    title: "Dietary Modifications",
    content:
      "Limit salt and sugar. Prefer whole grains, vegetables and lean protein. Take your medicines at the times shown in your schedule, with food where instructed.",
    citation: "[S4] Approved Dietary Guideline v2.0",
  },
  {
    key: "LIFESTYLE",
    title: "Lifestyle Modifications",
    content:
      "Limit alcohol, get regular sleep and manage stress. Maintain a healthy weight and continue the lifestyle changes discussed with your care team.",
    citation: "[S5] Approved Lifestyle Guideline v1.1",
  },
];

export type Revision = {
  version: number;
  origin: "AI_GENERATED" | "PHARMACIST_EDIT";
  note: string;
  author: string;
  createdAt: string;
  sections: CounsellingSection[];
};

export const revisions: Revision[] = [
  {
    version: 1,
    origin: "AI_GENERATED",
    note: "Initial AI-generated counselling from approved corpus release KB-2026-11 v1",
    author: "Gemini (AI)",
    createdAt: "2026-11-21T10:05:00+05:30",
    sections: counsellingSections,
  },
  {
    version: 2,
    origin: "PHARMACIST_EDIT",
    note: "Pharmacist clarified the missed-dose instruction and added a renal caution.",
    author: "Pharmacist Reviewer",
    createdAt: "2026-11-21T11:32:00+05:30",
    sections: counsellingSections.map((section) =>
      section.key === "MEDICATION"
        ? {
            ...section,
            content:
              section.content +
              " If you miss a dose, do not take an extra dose unless your pharmacist advises it. Stay well hydrated unless your doctor has restricted fluids.",
          }
        : section,
    ),
  },
];

export type CallLog = {
  id: string;
  date: string;
  time: string;
  medicine: string;
  status: "Taken" | "Missed" | "Counselling" | "Follow-up" | "No answer";
};

export const callLogs: CallLog[] = [
  { id: "call-1", date: "Nov 30, 2026", time: "8:00 AM", medicine: "Metformin 500 mg", status: "Taken" },
  { id: "call-2", date: "Nov 29, 2026", time: "8:00 PM", medicine: "Amlodipine 5 mg", status: "Missed" },
  { id: "call-3", date: "Nov 28, 2026", time: "8:00 AM", medicine: "Metformin 500 mg", status: "Taken" },
  { id: "call-4", date: "Nov 27, 2026", time: "10:00 PM", medicine: "Atorvastatin 10 mg", status: "Taken" },
];

export const adherence = {
  period: "Last 30 Days",
  scheduled: 30,
  taken: 24,
  missed: 3,
  noAnswer: 3,
  adherencePct: 80,
  coveragePct: 90,
};

export const followUps = [
  { id: "f-1", patient: "Ramesh Kumar", note: "Requested a pharmacist call about evening dose", status: "OPEN" },
  { id: "f-2", patient: "Lakshmi Rao", note: "Kidney-related diet question", status: "IN_PROGRESS" },
];
