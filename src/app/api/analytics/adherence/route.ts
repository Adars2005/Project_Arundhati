import { NextResponse } from "next/server";
import { adherence, callLogs } from "@/lib/mock/data";

export async function GET(request: Request) {
  const patientId = new URL(request.url).searchParams.get("patientId") ?? "pat-1001";
  return NextResponse.json({
    patientId,
    period: adherence.period,
    scheduled: adherence.scheduled,
    taken: adherence.taken,
    missed: adherence.missed,
    noAnswer: adherence.noAnswer,
    adherencePct: adherence.adherencePct,
    coveragePct: adherence.coveragePct,
    records: callLogs,
    formula: "adherencePct = taken / (taken + missed) * 100; no-answer events excluded",
  });
}
