import Link from "next/link";
import { FileText } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { patients } from "@/lib/mock/data";

export default function CounsellingPdfsPage() {
  return (
    <>
      <AppHeader title="Counselling PDFs" subtitle="Fixed template · one-click download · print fallback" />
      <div className="space-y-5 p-6">
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-900">Generated documents</h2>
            <p className="text-xs text-slate-500">Only pharmacist-approved revisions appear here</p>
          </div>
          <div className="divide-y divide-slate-100">
            {patients.slice(0, 4).map((patient) => (
              <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-brand-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">counselling-{patient.code}.pdf</p>
                    <p className="text-xs text-slate-500">{patient.name} · approved v2 · English</p>
                  </div>
                </div>
                <Link href={`/counselling-pdfs/${patient.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                  Preview & download
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
