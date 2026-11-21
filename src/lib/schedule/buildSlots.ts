import type { GeneratedSlot, PrescriptionItemInput } from "@/lib/types";

/** Deterministic frequency → slot mapping. Never invents a dose or timing. */
export const FREQUENCY_RULES: Record<string, Array<"MORNING" | "AFTERNOON" | "NIGHT">> = {
  OD: ["MORNING"],
  BD: ["MORNING", "NIGHT"],
  TDS: ["MORNING", "AFTERNOON", "NIGHT"],
  QID: ["MORNING", "AFTERNOON", "NIGHT"],
  HS: ["NIGHT"],
  SOS: [],
  CUSTOM: [],
  UNSPECIFIED: [],
};

export function buildSlots(items: PrescriptionItemInput[]): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];

  items.forEach((item, itemIndex) => {
    const explicit = item.specialInstructions.trim().length > 0 || item.timingCode !== "UNSPECIFIED";
    const codes = FREQUENCY_RULES[item.frequencyCode] ?? [];

    if (codes.length === 0) {
      slots.push({
        itemIndex,
        medicineName: item.medicineName,
        strength: item.strength,
        doseText: item.doseText,
        slotCode: "MORNING",
        instructions: item.specialInstructions || "Timing not specified — pharmacist review required",
        durationDays: item.durationDays,
        source: "EXPLICIT",
        needsReview: true,
      });
      return;
    }

    codes.forEach((slotCode) => {
      slots.push({
        itemIndex,
        medicineName: item.medicineName,
        strength: item.strength,
        doseText: item.doseText,
        slotCode,
        instructions: item.specialInstructions || timingLabel(item.timingCode),
        durationDays: item.durationDays,
        source: explicit || item.frequencyCode === "HS" ? "EXPLICIT" : "FREQUENCY_RULE",
        needsReview: false,
      });
    });
  });

  return slots;
}

function timingLabel(code: string) {
  switch (code) {
    case "BEFORE_FOOD": return "Before food";
    case "AFTER_FOOD": return "After food";
    case "ANY": return "Any time";
    default: return "As prescribed";
  }
}
