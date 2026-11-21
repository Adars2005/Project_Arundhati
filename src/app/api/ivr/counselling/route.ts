import { NextResponse } from "next/server";
import { getPatient } from "@/lib/repository";
import { retrieveChunks, retrieveForIvr } from "@/lib/rag/corpus";

export async function GET(request: Request) {
  const patientId = new URL(request.url).searchParams.get("patientId");
  if (!patientId) return NextResponse.json({ error: "patientId is required" }, { status: 400 });

  const patient = await getPatient(patientId);
  if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

  return NextResponse.json({
    patientId: patient.id,
    conditions: patient.conditions,
    audioText: retrieveForIvr(patient.conditions),
    genericFallback:
      retrieveChunks(patient.conditions).filter((chunk) => ["DISEASE", "MEDICATION", "WARNING"].includes(chunk.category))
        .length === 0,
  });
}
