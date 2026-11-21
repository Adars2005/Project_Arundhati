import { PrismaClient, Role, SlotCode, RevisionOrigin } from "@prisma/client";

const prisma = new PrismaClient();

const CONSENT_TEXT =
  "I consent to medication reminder calls and to the processing of my information for counselling and adherence monitoring.";

async function main() {
  await prisma.profile.upsert({
    where: { email: "pharmacist@arundhati.demo" },
    update: {},
    create: {
      email: "pharmacist@arundhati.demo",
      fullName: "Demo Pharmacist",
      role: Role.PHARMACIST,
    },
  });

  const release = await prisma.knowledgeRelease.upsert({
    where: { releaseCode: "KB-2026-11-v1" },
    update: {},
    create: {
      releaseCode: "KB-2026-11-v1",
      status: "APPROVED",
      approvalAuthority: "Appointed clinical lead (stakeholder nominee)",
      approvedBy: "Dr.Clinical.Lead",
      approvedAt: new Date("2026-11-18T09:00:00+05:30"),
      effectiveDate: new Date("2026-11-18T00:00:00+05:30"),
      sourceReferences: ["Approved Diabetes Guideline v2.1", "Approved Hypertension Guideline v1.3"],
      revisionHistory: [{ version: "v1", date: "2026-11-18", note: "Initial approved release" }],
      notes: "English corpus for first demo. Telugu/Hindi in Phase 2.",
    },
  });

  const patient = await prisma.patient.upsert({
    where: { patientCode: "PNT1001" },
    update: {},
    create: {
      patientCode: "PNT1001",
      fullName: "Ramesh Kumar",
      age: 50,
      gender: "Male",
      phoneE164: "+919876543210",
      address: "12-3-45, Chembur, Mumbai",
      languagePreference: "en",
      consentStatus: "GRANTED",
      conditions: {
        create: [
          { conditionCode: "DM" },
          { conditionCode: "HTN" },
        ],
      },
      histories: {
        create: [
          { category: "COMORBIDITY", description: "Hypertension — diagnosed 2019" },
          { category: "FAMILY", description: "Father: type 2 diabetes" },
        ],
      },
      allergies: { create: [{ substance: "Penicillin", reaction: "Rash" }] },
      lifestyles: {
        create: [{
          alcohol: "Occasional",
          smoking: "Never",
          dietType: "Mixed, high carbohydrate",
          physicalActivity: "Walking 20 min/day",
          sleepHours: 7,
        }],
      },
      clinicals: {
        create: [{
          bpSystolic: 138,
          bpDiastolic: 86,
          fastingGlucose: 148,
          hba1c: 7.6,
          bmi: 26.4,
        }],
      },
      consents: {
        create: [{
          type: "REMINDER_CALLS_AND_DATA_PROCESSING",
          checkboxTextSnapshot: CONSENT_TEXT,
          granted: true,
          grantedAt: new Date("2026-11-18T09:12:00+05:30"),
          grantedBy: "operator@arundhati.demo",
        }],
      },
    },
  });

  await prisma.knowledgeDocument.upsert({
    where: { id: "seed-doc-dm" },
    update: {},
    create: {
      id: "seed-doc-dm",
      releaseId: release.id,
      title: "Approved Diabetes Counselling Guideline",
      documentNumber: "CLIN-DM-02",
      versionNumber: "v2.1",
      sourceName: "Arundhati Hospital Clinical Team",
      category: "DISEASE",
      conditionCode: "DM",
      approvalAuthority: "Appointed clinical lead",
      approvedBy: "Dr.Clinical.Lead",
      approvedAt: new Date("2026-11-18T09:00:00+05:30"),
      effectiveDate: new Date("2026-11-18T00:00:00+05:30"),
      revisionHistory: [{ version: "v2.1", date: "2026-11-18", note: "Approved for prototype" }],
    },
  });

  const prescription = await prisma.prescription.create({
    data: {
      patientId: patient.id,
      prescribedOn: new Date("2026-11-18T09:00:00+05:30"),
      prescriber: "Dr. Prescriber (demo)",
      status: "VERIFIED",
      verifiedBy: "pharmacist@arundhati.demo",
      verifiedAt: new Date("2026-11-18T09:30:00+05:30"),
      items: {
        create: [
          { medicineName: "Metformin", strength: "500 mg", doseText: "1 tablet", frequencyCode: "BD", timingCode: "AFTER_FOOD", durationDays: 90, specialInstructions: "After food", isVerified: true },
          { medicineName: "Amlodipine", strength: "5 mg", doseText: "1 tablet", frequencyCode: "OD", timingCode: "UNSPECIFIED", durationDays: 90, specialInstructions: "Before Sleep", isVerified: true },
        ],
      },
    },
  });

  const items = await prisma.prescriptionItem.findMany({ where: { prescriptionId: prescription.id } });
  const metformin = items.find((item) => item.medicineName === "Metformin")!;
  const amlodipine = items.find((item) => item.medicineName === "Amlodipine")!;

  const schedule = await prisma.medicationSchedule.create({
    data: {
      patientId: patient.id,
      prescriptionId: prescription.id,
      status: "ACTIVE",
      verifiedBy: "pharmacist@arundhati.demo",
      verifiedAt: new Date("2026-11-18T10:00:00+05:30"),
      activatedAt: new Date("2026-11-18T10:01:00+05:30"),
      slots: {
        create: [
          { prescriptionItemId: metformin.id, slotCode: SlotCode.MORNING, doseText: "1 tablet", timingCode: "AFTER_FOOD", instructions: "After food", source: "FREQUENCY_RULE" },
          { prescriptionItemId: metformin.id, slotCode: SlotCode.NIGHT, doseText: "1 tablet", timingCode: "AFTER_FOOD", instructions: "After food", source: "FREQUENCY_RULE" },
          { prescriptionItemId: amlodipine.id, slotCode: SlotCode.NIGHT, doseText: "1 tablet", timingCode: "UNSPECIFIED", instructions: "Before Sleep", source: "EXPLICIT" },
        ],
      },
    },
  });

  const run = await prisma.counsellingRun.create({
    data: {
      patientId: patient.id,
      scheduleId: schedule.id,
      kbReleaseId: release.id,
      model: "gemini-flash-demo",
      promptVersion: "v1",
      status: "APPROVED",
      sources: ["KB-2026-11-v1"],
      createdBy: "pharmacist@arundhati.demo",
      approvedBy: "pharmacist@arundhati.demo",
      approvedAt: new Date("2026-11-18T11:30:00+05:30"),
    },
  });

  const aiRevision = await prisma.counsellingRevision.create({
    data: {
      runId: run.id,
      versionNo: 1,
      origin: RevisionOrigin.AI_GENERATED,
      sectionsJson: {},
      note: "Initial AI-generated counselling",
      createdBy: "gemini-flash-demo",
    },
  });

  const editRevision = await prisma.counsellingRevision.create({
    data: {
      runId: run.id,
      versionNo: 2,
      origin: RevisionOrigin.PHARMACIST_EDIT,
      parentRevisionId: aiRevision.id,
      sectionsJson: {},
      note: "Pharmacist edited and approved",
      createdBy: "pharmacist@arundhati.demo",
      isApproved: true,
    },
  });

  await prisma.counsellingRun.update({
    where: { id: run.id },
    data: { approvedRevisionId: editRevision.id },
  });

  await prisma.counsellingSection.create({
    data: {
      runId: run.id,
      revisionId: editRevision.id,
      sectionKey: "DISEASE",
      title: "Understanding the Disease",
      content: "Diabetes and high blood pressure can affect your heart, kidneys, eyes and nerves. Regular medicines and lifestyle changes help prevent complications.",
      citations: ["[S1] Approved Diabetes Guideline v2.1"],
      sortOrder: 1,
    },
  });

  console.log("Seed complete: PNT1001, corpus release KB-2026-11-v1, schedule + revisions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
