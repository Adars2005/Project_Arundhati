import { NextResponse } from "next/server";
import { writeAudit } from "@/lib/audit";
import { getPatient } from "@/lib/repository";
import { generateCounselling } from "@/lib/rag/generate";
import { prescriptionItemSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { patientId?: string; prescription?: unknown };
    if (!body.patientId) {
      return NextResponse.json({ error: "patientId is required" }, { status: 400 });
    }

    const patient = await getPatient(body.patientId);
    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    const prescription = prescriptionItemSchema.array().safeParse(body.prescription ?? []);
    const generated = await generateCounselling(patient, prescription.success ? prescription.data : []);

    await writeAudit({
      action: "COUNSELLING_GENERATED",
      entityType: "PATIENT",
      entityId: patient.id,
      after: { mode: generated.generationMode, sections: generated.sections.length, warnings: generated.warnings },
    });

    return NextResponse.json(generated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}
