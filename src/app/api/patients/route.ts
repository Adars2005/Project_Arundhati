import { NextResponse } from "next/server";
import { writeAudit } from "@/lib/audit";
import { config } from "@/lib/config";
import { createPatient, listPatients } from "@/lib/repository";
import { registerPatientSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  const patients = await listPatients();
  return NextResponse.json({ patients, mode: config.demo ? "DEMO" : "DATABASE" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerPatientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
    }

    const patient = await createPatient(parsed.data);
    await writeAudit({
      action: "PATIENT_REGISTERED",
      entityType: "PATIENT",
      entityId: patient.id,
      after: { code: patient.code, consentAt: patient.consentAt },
      ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 },
    );
  }
}
