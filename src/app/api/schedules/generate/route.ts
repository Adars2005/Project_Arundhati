import { NextResponse } from "next/server";
import { buildSlots } from "@/lib/schedule/buildSlots";
import { prescriptionItemSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { items?: unknown };
    const parsed = prescriptionItemSchema.array().safeParse(body.items ?? []);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid prescription", issues: parsed.error.flatten() }, { status: 400 });
    }

    const slots = buildSlots(parsed.data);
    const blocked = slots.some((slot) => slot.needsReview);

    return NextResponse.json({
      slots,
      canActivate: !blocked,
      rule: "Slots are derived only from frequency + explicit prescription values; no inferred doses or timings.",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 500 });
  }
}
