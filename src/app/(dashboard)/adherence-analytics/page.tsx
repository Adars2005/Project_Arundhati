import { Activity, CheckCircle2, PhoneCall, XCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { adherence, callLogs, followUps, patients } from "@/lib/mock/data";

export default function AdherenceAnalyticsPage() {
  return (
    <>
      <AppHeader title="Adherence Analytics" subtitle="Reported adherence from recorded dialpad responses · Last 30 Days" />
      <div className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Reported adherence" value={`${adherence.adherencePct}%`} note="taken ÷ (taken + not taken)" icon={<Activity className="h-5 w-5" />} />
          <Stat label="Taken" value={`${adherence.taken}/${adherence.scheduled}`} note="confirmed doses" icon={<CheckCircle2 className="h-5 w-5" />} />
          <Stat label="Missed" value={`${adherence.missed}/${adherence.scheduled}`} note="reported not taken" icon={<XCircle className="h-5 w-5" />} />
          <Stat label="No answer" value={`${adherence.noAnswer}/${adherence.scheduled}`} note="excluded from denominator" icon={<PhoneCall className="h-5 w-5" />} />
        </div>

        <div className="card">
          <div className="card-header flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Date-wise adherence records</h2>
              <p className="text-xs text-slate-500">Patient History · {patients[0].name} · {patients[0].code}</p>
            </div>
            <select className="input w-auto" aria-label="Select patient" defaultValue={patients[0].id}>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
            </select>
          </div>
          <div className="divide-y divide-slate-100">
            {callLogs.map((call) => (
              <div key={call.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-slate-600">{call.date} · {call.time}</span>
                <span className="text-slate-800">{call.medicine}</span>
                <span className={call.status === "Taken" ? "text-emerald-700" : "text-red-700"}>{call.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-sm font-semibold text-slate-900">Patient queries requiring follow-up</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {followUps.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-slate-800">{item.patient}</p>
                  <p className="text-xs text-slate-500">{item.note}</p>
                </div>
                <span className="badge bg-amber-50 text-amber-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, note, icon }: { label: string; value: string; note: string; icon: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="text-brand-500">{icon}</div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="text-xs font-medium text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">{note}</p>
    </div>
  );
}
