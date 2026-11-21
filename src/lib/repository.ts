import { config } from "@/lib/config";
import { prisma } from "@/lib/db";
import { demoAddPatient, demoGetPatient, demoListPatients } from "@/lib/demo-store";
import type { PatientDTO, RegisterPatientInput } from "@/lib/types";

type PatientWithRelations = Awaited<ReturnType<typeof loadPatients>>[number];

async function loadPatients() {
  return prisma.patient.findMany({
    include: {
      conditions: true,
      histories: true,
      allergies: true,
      lifestyles: true,
      clinicals: { orderBy: { recordedAt: "desc" }, take: 1 },
      consents: { orderBy: { grantedAt: "desc" }, take: 1 },
    },
    orderBy: { patientCode: "asc" },
  });
}

function mapPatient(patient: PatientWithRelations): PatientDTO {
  const lifestyle = patient.lifestyles[0];
  const clinical = patient.clinicals[0];
  return {
    id: patient.id,
    code: patient.patientCode,
    name: patient.fullName,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phoneE164,
    address: patient.address ?? "",
    conditions: patient.conditions.filter((c) => c.status === "ACTIVE").map((c) => c.conditionCode),
    language: patient.languagePreference,
    consentAt: (patient.consents[0]?.grantedAt ?? patient.createdAt).toISOString(),
    history: patient.histories.map((h) => ({ category: h.category, description: h.description })),
    allergies: patient.allergies.map((a) => a.substance),
    lifestyle: {
      alcohol: lifestyle?.alcohol ?? "",
      smoking: lifestyle?.smoking ?? "",
      diet: lifestyle?.dietType ?? "",
      activity: lifestyle?.physicalActivity ?? "",
      sleep: lifestyle?.sleepHours ? String(lifestyle.sleepHours) : "",
    },
    clinical: {
      bp: clinical ? `${clinical.bpSystolic ?? "-"}/${clinical.bpDiastolic ?? "-"}` : "",
      glucose: clinical?.fastingGlucose ? String(clinical.fastingGlucose) : "",
      hba1c: clinical?.hba1c ? String(clinical.hba1c) : "",
      bmi: clinical?.bmi ? String(clinical.bmi) : "",
    },
    prescription: [],
  };
}

export async function listPatients(): Promise<PatientDTO[]> {
  if (!config.database) return demoListPatients();
  return (await loadPatients()).map(mapPatient);
}

export async function getPatient(id: string): Promise<PatientDTO | undefined> {
  if (!config.database) return demoGetPatient(id);
  const found = await prisma.patient.findFirst({
    where: { OR: [{ id }, { patientCode: id }] },
    include: {
      conditions: true,
      histories: true,
      allergies: true,
      lifestyles: true,
      clinicals: { orderBy: { recordedAt: "desc" }, take: 1 },
      consents: { orderBy: { grantedAt: "desc" }, take: 1 },
    },
  });
  return found ? mapPatient(found) : undefined;
}

export async function createPatient(input: RegisterPatientInput): Promise<PatientDTO> {
  if (!config.database) return demoAddPatient(input);

  const count = await prisma.patient.count();
  const patientCode = `PNT${1001 + count}`;

  const created = await prisma.$transaction(async (tx) => {
    const patient = await tx.patient.create({
      data: {
        patientCode,
        fullName: input.fullName,
        age: input.age,
        gender: input.gender,
        phoneE164: input.phone,
        address: input.address,
        consentStatus: "GRANTED",
        conditions: { create: input.conditions.map((conditionCode) => ({ conditionCode })) },
        consents: {
          create: [{
            type: "REMINDER_CALLS_AND_DATA_PROCESSING",
            checkboxTextSnapshot: input.consentText,
            granted: input.consent,
            grantedAt: new Date(),
          }],
        },
      },
    });

    if (input.prescription.length) {
      await tx.prescription.create({
        data: {
          patientId: patient.id,
          prescribedOn: new Date(),
          status: "DRAFT",
          items: {
            create: input.prescription.map((item) => ({
              medicineName: item.medicineName,
              strength: item.strength,
              doseText: item.doseText,
              frequencyCode: item.frequencyCode,
              durationDays: item.durationDays,
              timingCode: item.timingCode,
              specialInstructions: item.specialInstructions,
            })),
          },
        },
      });
    }

    return patient;
  });

  return (await getPatient(created.id))!;
}
