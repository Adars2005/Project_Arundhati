import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { revisions, patients } from "@/lib/mock/data";

export default function AiCounsellingPage() {
  return (
    <>
      <AppHeader title="AI Counselling" subtitle="RAG-generated, pharmacist-reviewed counselling from approved corpus KB-2026-11 v1" />
      <div className="space-y-5 p-6">
        <div className="card p-5">
          <p className="text-sm font-semibold text-slate-900">Ready to generate personalized counselling?</p>
          <p className="mt-1 text-sm text-slate-600">
            Our AI will use your patient data, medical history and guidelines to create advice.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Corpus approved by the appointed clinical lead · source references and revision history recorded.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-900">Counselling runs</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {patients.slice(0, 4).map((patient, index) => (
              <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">Patient Counselling Guide For {patient.name}</p>
                  <p className="text-xs text-slate-500">{patient.code} · {patient.conditions.join(" + ")} · {revisions.length} revisions retained</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${index === 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {index === 0 ? "Approved" : "Draft"}
                  </span>
                  <Link href={`/ai-counselling/${patient.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
