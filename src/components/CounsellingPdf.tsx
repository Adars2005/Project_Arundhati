"use client";

import { useRef, useState } from "react";
import { Download, Printer } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { counsellingSections, scheduleSlots } from "@/lib/mock/data";
import type { PatientDTO } from "@/lib/types";

export function CounsellingPdf({ patient }: { patient: PatientDTO }) {
  const templateRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const pdfSlots = patient.prescription?.length
    ? patient.prescription.map((item, index) => ({
        id: `rx-${index}`,
        time: item.frequencyCode === "HS" ? "Night" : item.frequencyCode === "BD" ? "Morning / Night" : "Morning",
        displayTime: "",
        medicine: item.medicineName,
        strength: item.strength,
        dose: item.doseText,
        instructions: item.specialInstructions || item.timingCode.replaceAll("_", " "),
        duration: `${item.durationDays} Days`,
        source: "VERIFIED_PRESCRIPTION" as const,
      }))
    : scheduleSlots;

  async function download() {
    if (!templateRef.current) return;
    setBusy(true);
    setMessage("");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(templateRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const image = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const width = pageWidth - 48;
      const height = (canvas.height * width) / canvas.width;
      let remaining = height;
      let position = 24;
      let first = true;
      while (remaining > 0) {
        if (!first) pdf.addPage();
        pdf.addImage(image, "PNG", 24, position, width, height);
        remaining -= pageHeight - 48;
        position = 24 - (height - remaining);
        first = false;
      }
      pdf.save(`counselling-${patient.code}.pdf`);
      setMessage("PDF downloaded. Stored against the approved revision (demo).");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "PDF download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AppHeader title="Counselling PDFs" subtitle="Fixed template · approved revision only · preview and save" />
      <div className="space-y-5 p-6">
        <div className="card no-print flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-sm font-semibold text-slate-900">counselling-{patient.code}.pdf</p>
            <p className="text-xs text-slate-500">Generated from pharmacist-approved v2 · English · fixed layout</p>
            {message ? <p className="mt-2 text-xs text-emerald-700">{message}</p> : null}
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" type="button" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print / Save as PDF
            </button>
            <button className="btn-primary" type="button" onClick={download} disabled={busy}>
              <Download className="h-4 w-4" /> {busy ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>

        <div ref={templateRef} className="printable card mx-auto max-w-3xl bg-white p-10">
          <div className="border-b-2 border-brand-600 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">Arundhati Hospital</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Patient Counselling Guide</h1>
            <p className="text-sm text-slate-600">For {patient.name} · {patient.code} · Age {patient.age} · {patient.gender}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">Demo mode · simulated data</p>
          </div>

          <PdfSection title="Patient details">
            <p>Conditions: {patient.conditions.join(", ")} &nbsp;|&nbsp; Contact: {patient.phone}</p>
            <p>Allergies: {patient.allergies.join(", ") || "None recorded"}</p>
          </PdfSection>

          <PdfSection title="Medication schedule">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-slate-200 text-slate-500"><th>Time</th><th>Medicine</th><th>Dosage</th><th>Instructions</th><th>Duration</th></tr></thead>
              <tbody>
                {pdfSlots.map((slot) => (
                  <tr key={slot.id} className="border-b border-slate-100">
                    <td className="py-1.5">{slot.time}</td>
                    <td>{slot.medicine} {slot.strength}</td>
                    <td>{slot.dose}</td>
                    <td>{slot.instructions}</td>
                    <td>{slot.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PdfSection>

          {counsellingSections.map((section) => (
            <PdfSection key={section.key} title={section.title}>
              <p>{section.content}</p>
              <p className="mt-1 text-[10px] text-brand-600">{section.citation}</p>
            </PdfSection>
          ))}

          <PdfSection title="Warning signs and important precautions">
            <p>Seek medical attention for chest pain, severe breathlessness, confusion, fainting, or a blood sugar reading that remains very high or very low. Do not change or stop medicines without advice from your pharmacist or doctor.</p>
          </PdfSection>
        </div>
      </div>
    </>
  );
}

function PdfSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">{title}</h2>
      <div className="text-xs leading-relaxed text-slate-700">{children}</div>
    </section>
  );
}
