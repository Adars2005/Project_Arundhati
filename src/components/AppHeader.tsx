import { Bell, CircleHelp } from "lucide-react";
import { DemoBadge } from "@/components/DemoBadge";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <DemoBadge />
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50" aria-label="Help">
          <CircleHelp className="h-4 w-4" />
        </button>
        <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          PH
        </div>
      </div>
    </header>
  );
}
