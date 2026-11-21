import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { writeAudit } from "@/lib/audit";

export async function GET(request: Request) {
  return handle(request);
}

export async function POST(request: Request) {
  return handle(request);
}

async function handle(request: Request) {
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (provided !== config.cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await writeAudit({ action: "CRON_TICK", entityType: "SCHEDULER" });

  return NextResponse.json({
    ok: true,
    mode: config.demo ? "DEMO" : "DATABASE",
    message: config.demo
      ? "Demo mode: no external jobs dispatched."
      : "Scheduler tick accepted. Reminder selection runs against MedicationSchedule slots in Phase 2.",
  });
}
