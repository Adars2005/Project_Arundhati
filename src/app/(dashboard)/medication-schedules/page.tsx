import Link from "next/link";
import { CheckCircle2, Clock3 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { patients, scheduleSlots } from "@/lib/mock/data";

export default function MedicationSchedulesPage() {
  return (
    <>
      <AppHeader title="Medication Schedules" subtitle="Generated from verified prescriptions · pharmacist verification queue" />
      <div className="space-y-5 p-6">
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-900">Schedules</h2>
            <p className="text-xs text-slate-500">{scheduleSlots.length} slots across the demo prescription</p>
          </div>
          <div className="divide-y divide-slate-100">
            {patients.slice(0, 4).map((patient, index) => (
              <div key={patient.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">{patient.name} <span className="text-slate-400">· {patient.code}</span></p>
                  <p className="text-xs text-slate-500">Verified prescription · @{patient.conditions.join(", ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${index === 0 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {index === 0 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                    {index === 0 ? "Active" : "Awaiting verification"}
                  </span>
                  <Link href={`/patients/${patient.id}`} className="text-xs font-medium text-brand-600 hover:underline">
                    Verify & view
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Only verified prescriptions can be activated. Missing or unspecified timings keep a schedule in draft and block activation.
        </p>
      </div>
    </>
  );
}
