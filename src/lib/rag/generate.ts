import { config } from "@/lib/config";
import { retrieveChunks, type CorpusChunk } from "@/lib/rag/corpus";
import { counsellingOutputSchema } from "@/lib/validations";
import type { PatientDTO, PrescriptionItemInput } from "@/lib/types";

export type GeneratedCounselling = {
  sections: { key: string; title: string; content: string; citation: string }[];
  warnings: string[];
  sources: string[];
  generationMode: "GEMINI_FREE" | "LOCAL_APPROVED_TEMPLATE";
};

export async function generateCounselling(
  patient: PatientDTO,
  prescription: PrescriptionItemInput[] = [],
): Promise<GeneratedCounselling> {
  const chunks = retrieveChunks(patient.conditions);
  const sources = [...new Set(chunks.map((chunk) => chunk.citation))];
  const warnings: string[] = [];

  if (!config.geminiKey) {
    warnings.push("AI API key not configured — assembled from approved local corpus template.");
    return { ...templateFromCorpus(chunks), sources, warnings, generationMode: "LOCAL_APPROVED_TEMPLATE" };
  }

  try {
    const prompt = buildPrompt(patient, chunks, prescription);
    const raw = await callGemini(prompt);
    const parsed = counsellingOutputSchema.parse(raw);
    const invented = validateNoInventedValues(parsed.sections.map((section) => section.content), prescription);
    if (invented.length) {
      warnings.push("AI output failed dose-safety validation; used approved corpus template instead.");
      return { ...templateFromCorpus(chunks), sources, warnings: [...warnings, ...invented], generationMode: "LOCAL_APPROVED_TEMPLATE" };
    }
    return { sections: parsed.sections, sources, warnings, generationMode: "GEMINI_FREE" };
  } catch (error) {
    warnings.push(`AI generation unavailable (${error instanceof Error ? error.message : "unknown error"}); used approved corpus template.`);
    return { ...templateFromCorpus(chunks), sources, warnings, generationMode: "LOCAL_APPROVED_TEMPLATE" };
  }
}

function buildPrompt(patient: PatientDTO, chunks: CorpusChunk[], prescription: PrescriptionItemInput[]) {
  const prescriptionLines = prescription.length
    ? prescription.map((item) => `- ${item.medicineName} ${item.strength}; dose ${item.doseText}; frequency ${item.frequencyCode}; duration ${item.durationDays} days; timing ${item.timingCode}; instructions ${item.specialInstructions}`).join("\n")
    : "- No structured prescription provided";

  return [
    "You generate a patient counselling guide for Arundhati Hospital.",
    "Use ONLY the approved corpus excerpts below. Cite the excerpt id in every section.",
    "Never invent or change a medicine, dose, strength, frequency, duration or administration timing.",
    "If the prescription does not state a value, say 'as written in your verified prescription'.",
    "Return JSON only with this shape: {\"sections\":[{\"key\":\"...\",\"title\":\"...\",\"content\":\"...\",\"citation\":\"...\"}],\"warnings\":[]}",
    "",
    `Patient: ${patient.name}, age ${patient.age}, ${patient.gender}, conditions ${patient.conditions.join(", ") || "none"}.`,
    "Verified prescription (source of truth):",
    prescriptionLines,
    "",
    "Approved corpus excerpts:",
    ...chunks.map((chunk) => `[${chunk.id}] ${chunk.title}: ${chunk.content} Citation: ${chunk.citation}`),
  ].join("\n");
}

async function callGemini(prompt: string): Promise<unknown> {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.geminiKey!,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              sections: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    key: { type: "STRING" },
                    title: { type: "STRING" },
                    content: { type: "STRING" },
                    citation: { type: "STRING" },
                  },
                  required: ["key", "title", "content", "citation"],
                },
              },
              warnings: { type: "ARRAY", items: { type: "STRING" } },
            },
            required: ["sections", "warnings"],
          },
        },
      }),
    },
  );

  if (!response.ok) throw new Error(`Gemini API ${response.status}`);
  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
  if (!text) throw new Error("Empty Gemini response");
  return JSON.parse(text);
}

function templateFromCorpus(chunks: CorpusChunk[]) {
  const priority = ["DISEASE", "MEDICATION", "ACTIVITY", "DIET", "LIFESTYLE", "WARNING"];
  const ordered = [...chunks].sort((a, b) => priority.indexOf(a.category) - priority.indexOf(b.category));
  return {
    sections: ordered.map((chunk) => ({
      key: chunk.category,
      title: chunk.title,
      content: chunk.content,
      citation: chunk.citation,
    })),
  };
}

function validateNoInventedValues(contents: string[], prescription: PrescriptionItemInput[]): string[] {
  const allowed = new Set(
    prescription.flatMap((item) => [item.strength, item.doseText, String(item.durationDays), item.frequencyCode]),
  );
  const problems: string[] = [];
  const dosePattern = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|ml|tablets?|capsules?)\b/gi;

  for (const content of contents) {
    for (const match of content.match(dosePattern) ?? []) {
      const number = match.match(/\d+(?:\.\d+)?/)?.[0] ?? "";
      if (number && ![...allowed].some((value) => value.includes(number))) {
        problems.push(`Potential invented dose value in output: ${match}`);
      }
    }
  }
  return problems;
}
