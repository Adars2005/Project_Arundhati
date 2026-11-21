import { Database, ShieldCheck, Users } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

const roles = ["ADMIN", "PHARMACIST", "COUNSELLOR", "OPERATOR", "VIEWER"];

export default function SettingsPage() {
  return (
    <>
      <AppHeader title="Settings" subtitle="Roles, approved corpus versions and scheduler status" />
      <div className="grid gap-5 p-6 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Access roles</h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {roles.map((role) => <span key={role} className="badge bg-slate-100 text-slate-700">{role}</span>)}
          </div>
          <p className="mt-3 text-xs text-slate-500">Pharmacists verify schedules and approve counselling. Operators register patients.</p>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Approved clinical corpus</h2>
          </div>
          <dl className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-slate-500">Release</dt><dd className="text-slate-800">KB-2026-11 v1</dd></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-slate-500">Approval authority</dt><dd className="text-slate-800">Appointed clinical lead</dd></div>
            <div className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-slate-500">Effective date</dt><dd className="text-slate-800">2026-11-18</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Source references</dt><dd className="text-slate-800">5 approved documents</dd></div>
          </dl>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Consent &amp; demo controls</h2>
          </div>
          <p className="mt-3 text-xs text-slate-600">Registration captures a timestamped consent checkbox covering reminder calls and counselling/adherence data processing.</p>
          <p className="mt-2 text-xs text-slate-600">DEMO MODE · SIMULATED DATA badge is rendered by the shared layout on every screen.</p>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold text-slate-900">Scheduler</h2>
          <p className="mt-3 text-xs text-slate-600">Free external cron pings <code className="rounded bg-slate-100 px-1">/api/cron/tick</code> every minute in Phase 2.</p>
          <p className="mt-2 text-xs text-slate-500">Status: demo mode · no external services required.</p>
        </section>
      </div>
    </>
  );
}
