"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { revisions, scheduleSlots, type CounsellingSection, type Revision } from "@/lib/mock/data";
import type { PatientDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

type Status = "DRAFT" | "APPROVED" | "REJECTED";

export function CounsellingReview({ patient }: { patient: PatientDTO }) {
  const [generated, setGenerated] = useState(patient.id === "pat-1001");
  const [versionList, setVersionList] = useState<Revision[]>(revisions);
  const [selected, setSelected] = useState(revisions.length - 1);
  const [status, setStatus] = useState<Status>(patient.id === "pat-1001" ? "APPROVED" : "DRAFT");
  const [draft, setDraft] = useState<CounsellingSection[]>(revisions[revisions.length - 1].sections);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [generationWarnings, setGenerationWarnings] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState("");
  const [generating, setGenerating] = useState(false);

  const revision = versionList[selected];

  async function runGeneration() {
    setGenerating(true);
    setGenerationWarnings([]);
    try {
      const prescription = patient.prescription?.length
        ? patient.prescription
        : patient.id === "pat-1001"
        ? scheduleSlots.map((slot) => ({
            medicineName: slot.medicine,
            strength: slot.strength,
            doseText: slot.dose,
            frequencyCode: "UNSPECIFIED",
            durationDays: 90,
            timingCode: "UNSPECIFIED",
            specialInstructions: slot.instructions,
          }))
        : [];
      const response = await fetch("/api/counselling/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.id, prescription }),
      });
      const payload = (await response.json()) as {
        sections?: CounsellingSection[];
        warnings?: string[];
        generationMode?: string;
        error?: string;
      };
      if (!response.ok || !payload.sections?.length) throw new Error(payload.error ?? "Generation failed");

      const aiRevision: Revision = {
        version: 1,
        origin: "AI_GENERATED",
        note: `Generated from approved corpus · ${payload.generationMode}`,
        author: payload.generationMode === "GEMINI_FREE" ? "Gemini (free tier)" : "Approved local template",
        createdAt: new Date().toISOString(),
        sections: payload.sections,
      };
      setVersionList([aiRevision]);
      setSelected(0);
      setDraft(payload.sections);
      setStatus("DRAFT");
      setGenerationWarnings(payload.warnings ?? []);
      setGenerationMode(payload.generationMode ?? "");
      setGenerated(true);
    } catch (error) {
      setGenerationWarnings([error instanceof Error ? error.message : "Generation failed"]);
    } finally {
      setGenerating(false);
    }
  }

  function saveEdit() {
    const next: Revision = {
      version: versionList.length + 1,
      origin: "PHARMACIST_EDIT",
      note: "Pharmacist edited version — saved for audit",
      author: "Pharmacist Reviewer",
      createdAt: new Date().toISOString(),
      sections: draft,
    };
    setVersionList([...versionList, next]);
    setSelected(versionList.length);
    setStatus("DRAFT");
  }

  if (!generated) {
    return (
      <>
        <AppHeader title="AI Counselling" subtitle={`${patient.name} · ${patient.code}`} />
        <div className="p-6">
          <div className="card flex flex-col items-center gap-4 p-12 text-center">
            <Sparkles className="h-8 w-8 text-brand-500" />
            <h2 className="text-lg font-semibold text-slate-900">Ready to generate personalized counselling?</h2>
            <p className="max-w-lg text-sm text-slate-600">
              Our AI will use your patient data, medical history and guidelines to create advice.
              Nothing is generated until you click the button.
            </p>
            <button className="btn-primary" type="button" onClick={runGeneration} disabled={generating}>
              <Sparkles className="h-4 w-4" /> {generating ? "Generating…" : "Generate Patient Counselling"}
            </button>
            {generationWarnings.map((warning) => (
              <p key={warning} className="text-xs text-amber-700">{warning}</p>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="AI Counselling" subtitle={`Patient Counselling Guide For ${patient.name} · ${patient.code}`} />
      <div className="space-y-5 p-6">
        <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-semibold text-slate-900">Patient Counselling Guide For {patient.name}</p>
            <p className="text-xs text-slate-500">English · approved corpus KB-2026-11 v1 · condition-specific sections only</p>
            {generationMode ? <p className="mt-1 text-[11px] text-brand-600">Generation mode: {generationMode}</p> : null}
            {generationWarnings.map((warning) => (
              <p key={warning} className="mt-1 text-[11px] text-amber-700">⚠ {warning}</p>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("badge", status === "APPROVED" ? "bg-emerald-50 text-emerald-700" : status === "REJECTED" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700")}>
              {status}
            </span>
            <button className="btn-secondary" type="button" onClick={() => setGenerated(false)}>
              <RotateCcw className="h-4 w-4" /> Regenerate
            </button>
            <Link href={`/counselling-pdfs/${patient.id}`} className="btn-secondary" aria-disabled={status !== "APPROVED"}>
              <FileText className="h-4 w-4" /> View PDF
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-900">Revision history</h2>
            <p className="text-xs text-slate-500">AI original and every pharmacist edit are retained for audit</p>
          </div>
          <div className="flex flex-wrap gap-2 p-4">
            {versionList.map((item, index) => (
              <button
                key={item.version}
                type="button"
                onClick={() => {
                  setSelected(index);
                  setDraft(item.sections);
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-xs",
                  index === selected ? "border-brand-400 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-600",
                )}
              >
                <span className="block font-semibold">v{item.version} · {item.origin.replace("_", " ")}</span>
                <span className="text-[11px]">{item.author}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            {revision.note} · {new Date(revision.createdAt).toLocaleString("en-GB")}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {revision.sections.map((section, sectionIndex) => (
            <div key={section.key} className="card p-5">
              <h3 className="text-sm font-semibold text-slate-900">{section.title}</h3>
              <textarea
                className="input mt-3 min-h-[120px] resize-y leading-relaxed"
                value={draft[sectionIndex]?.content ?? ""}
                onChange={(event) => {
                  const next = [...draft];
                  next[sectionIndex] = { ...next[sectionIndex], content: event.target.value };
                  setDraft(next);
                }}
                aria-label={`Edit ${section.title}`}
              />
              <p className="mt-2 text-[11px] text-brand-600">{section.citation}</p>
            </div>
          ))}
        </div>

        <div className="card space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-secondary" type="button" onClick={saveEdit}>Save pharmacist edit</button>
            <button className="btn-primary" type="button" onClick={() => { setStatus("APPROVED"); setShowReject(false); }}>
              <CheckCircle2 className="h-4 w-4" /> Approve v{selected + 1}
            </button>
            <button className="btn-secondary" type="button" onClick={() => setShowReject(true)}>
              <XCircle className="h-4 w-4" /> Reject
            </button>
            {status === "APPROVED" ? (
              <span className="text-xs text-emerald-700">PDF will be generated from approved v{selected + 1} only.</span>
            ) : null}
          </div>
          {showReject ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <label className="label" htmlFor="reason">Reason for rejection (required)</label>
              <textarea id="reason" className="input min-h-[80px]" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
              <button
                className="btn mt-3 bg-red-600 text-white hover:bg-red-700"
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={() => { setStatus("REJECTED"); setShowReject(false); }}
              >
                Confirm rejection
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
