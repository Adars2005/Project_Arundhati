import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { adherence, callLogs, patients } from "@/lib/mock/data";

const ivrOptions = [
  { key: "1", label: "Medicine taken", detail: "Record response" },
  { key: "2", label: "Medicine not taken", detail: "Record response" },
  { key: "3", label: "Get counselling", detail: "Play condition-specific info" },
  { key: "4", label: "Other queries", detail: "Forward to pharmacist" },
];

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" subtitle="Medication Adherence Dashboard · Patient History · Last 30 Days" />
      <div className="space-y-6 p-6">
        <section className="card border-brand-200 bg-brand-50/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 text-brand-600" />
              <div>
                <p className="font-semibold text-brand-800">Workflow Completed!</p>
                <p className="mt-1 text-sm text-brand-700">
                  Patient counselling generated, schedule activated, and reminders scheduled.
                </p>
                <p className="mt-1 text-xs text-brand-600">
                  Patient will receive a call shortly at {patients[0].phone} · Simulated call queued
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/adherence-analytics" className="btn-primary">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/reminder-calls" className="btn-secondary">
                View Call Logs
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Reported adherence"
            value={`${adherence.adherencePct}%`}
            hint={`${adherence.period} · taken / answered`}
            icon={<TrendingUp className="h-5 w-5" />}
            accent
          />
          <KpiCard label="Taken" value={`${adherence.taken}/${adherence.scheduled}`} hint="Doses confirmed" icon={<CheckCircle2 className="h-5 w-5" />} />
          <KpiCard label="Missed" value={`${adherence.missed}/${adherence.scheduled}`} hint="Reported not taken" icon={<CircleDot className="h-5 w-5" />} />
          <KpiCard label="No answer" value={`${adherence.noAnswer}/${adherence.scheduled}`} hint="Excluded from adherence" icon={<PhoneCall className="h-5 w-5" />} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="card-header flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Recent medication reminder calls</h2>
                <p className="text-xs text-slate-500">Simulated IVR events · {patients[0].name} · {patients[0].code}</p>
              </div>
              <Link href="/reminder-calls" className="text-xs font-medium text-brand-600 hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {callLogs.map((call) => (
                <div key={call.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{call.medicine}</p>
                    <p className="text-xs text-slate-500">{call.date} · {call.time}</p>
                  </div>
                  <span
                    className={`badge ${
                      call.status === "Taken"
                        ? "bg-emerald-50 text-emerald-700"
                        : call.status === "Missed"
                          ? "bg-red-50 text-red-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {call.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-slate-900">Active IVR options (keypad)</h2>
              <p className="text-xs text-slate-500">Simulated dialpad</p>
            </div>
            <div className="space-y-2 p-4">
              {ivrOptions.map((option) => (
                <div key={option.key} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-sm font-semibold text-brand-700">
                    {option.key}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-slate-800">{option.label}</p>
                    <p className="text-[11px] text-slate-500">{option.detail}</p>
                  </div>
                </div>
              ))}
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                <ShieldCheck className="h-4 w-4" /> Consent recorded · 18 Nov 2026
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`card p-5 ${accent ? "ring-1 ring-brand-200" : ""}`}>
      <div className="flex items-center justify-between text-slate-400">{icon}</div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  );
}
