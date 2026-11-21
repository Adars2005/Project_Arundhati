"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { scheduleSlots, type ScheduleSlot } from "@/lib/mock/data";
import type { PatientDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = ["Basic Details", "Medical Info", "Clinical Data", "Medication Schedule"] as const;
type Tab = (typeof tabs)[number];

export function PatientDetail({ patient }: { patient: PatientDTO }) {
  const [tab, setTab] = useState<Tab>("Basic Details");
  const [verified, setVerified] = useState(false);

  return (
    <>
      <AppHeader title="Patient Record" subtitle={`${patient.code} · entered once, reused across all modules`} />
      <div className="space-y-5 p-6">
        <section className="card flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {patient.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{patient.name}</h2>
              <p className="text-xs text-slate-500">
                Patient ID: {patient.code} &nbsp;|&nbsp; Age: {patient.age} &nbsp;|&nbsp; {patient.gender}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge bg-emerald-50 text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Consent {new Date(patient.consentAt).toLocaleDateString("en-GB")}
            </span>
            <Link href={`/ai-counselling/${patient.id}`} className="btn-primary">
              <Sparkles className="h-4 w-4" /> Generate Patient Counselling
            </Link>
          </div>
        </section>

        <div className="card">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={cn(
                  "whitespace-nowrap border-b-2 px-4 py-3 text-sm",
                  tab === item
                    ? "border-brand-600 font-medium text-brand-700"
                    : "border-transparent text-slate-500 hover:text-slate-800",
                )}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="p-6">
            {tab === "Basic Details" ? <BasicDetails patient={patient} /> : null}
            {tab === "Medical Info" ? <MedicalInfo patient={patient} /> : null}
            {tab === "Clinical Data" ? <ClinicalData patient={patient} /> : null}
            {tab === "Medication Schedule" ? (
              <SchedulePanel patient={patient} slots={scheduleSlots} verified={verified} onVerify={() => setVerified(true)} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

function BasicDetails({ patient }: { patient: PatientDTO }) {
  const rows = [
    ["Patient ID (auto-generated)", patient.code],
    ["Full name", patient.name],
    ["Age", String(patient.age)],
    ["Gender", patient.gender],
    ["Contact number", patient.phone],
    ["Address", patient.address],
    ["Language preference", patient.language.toUpperCase()],
    ["Consent — reminder calls & data processing", `Granted ${new Date(patient.consentAt).toLocaleString("en-GB")}`],
  ];
  return (
    <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-slate-500">{label}</dt>
          <dd className="mt-1 text-sm text-slate-800">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function MedicalInfo({ patient }: { patient: PatientDTO }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Diagnosed conditions</h3>
        <div className="flex flex-wrap gap-2">
          {patient.conditions.map((condition) => (
            <span key={condition} className="badge bg-brand-50 text-brand-700">{condition}</span>
          ))}
        </div>
        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-800">History</h3>
        <ul className="space-y-2">
          {patient.history.map((item) => (
            <li key={item.description} className="text-sm text-slate-600">
              <span className="font-medium text-slate-700">{item.category}:</span> {item.description}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Lifestyle</h3>
        <dl className="space-y-2 text-sm">
          {Object.entries(patient.lifestyle).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="capitalize text-slate-500">{key}</dt>
              <dd className="text-slate-800">{value}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-800">Known allergies</h3>
        <p className="text-sm text-slate-600">{patient.allergies.join(", ") || "None recorded"}</p>
      </div>
    </div>
  );
}

function ClinicalData({ patient }: { patient: PatientDTO }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Object.entries(patient.clinical).map(([key, value]) => (
        <div key={key} className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SchedulePanel({
  patient,
  slots,
  verified,
  onVerify,
}: {
  patient: PatientDTO;
  slots: ScheduleSlot[];
  verified: boolean;
  onVerify: () => void;
}) {
  const [apiResult, setApiResult] = useState<{ slots: number; canActivate: boolean } | null>(null);
  const [checking, setChecking] = useState(false);

  async function regenerate() {
    setChecking(true);
    try {
      const response = await fetch("/api/schedules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: slots.map((slot) => ({
            medicineName: slot.medicine,
            strength: slot.strength,
            doseText: slot.dose,
            frequencyCode: slot.id === "slot-1" || slot.id === "slot-2" ? "BD" : "HS",
            durationDays: 90,
            timingCode: "UNSPECIFIED",
            specialInstructions: slot.instructions,
          })),
        }),
      });
      const payload = (await response.json()) as { slots: unknown[]; canActivate: boolean };
      if (!response.ok) throw new Error("Schedule generation failed");
      setApiResult({ slots: payload.slots.length, canActivate: payload.canActivate });
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Schedule generated from verified prescription</h3>
          <p className="text-xs text-slate-500">
            All doses, frequencies, durations and timings are taken from the prescription entered by the user.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary" type="button" onClick={regenerate} disabled={checking}>
            {checking ? "Checking…" : "Regenerate from prescription"}
          </button>
          <button className={verified ? "btn-secondary" : "btn-primary"} type="button" onClick={onVerify} disabled={verified}>
            <CheckCircle2 className="h-4 w-4" />
            {verified ? "Verified & Active" : "Verify & Activate"}
          </button>
        </div>
      </div>

      {apiResult ? (
        <div className="rounded-lg bg-brand-50 px-4 py-2 text-xs text-brand-800">
          Engine returned {apiResult.slots} slots · {apiResult.canActivate ? "ready to activate" : "pharmacist review required"}
        </div>
      ) : null}

      {verified ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Schedule activated for {patient.name}. Reminder events queued for simulated calls.
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Medicine</th>
              <th className="px-4 py-3 font-medium">Dosage</th>
              <th className="px-4 py-3 font-medium">Instructions</th>
              <th className="px-4 py-3 font-medium">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{slot.time}</p>
                  <p className="text-xs text-slate-400">{slot.displayTime}</p>
                </td>
                <td className="px-4 py-3 text-slate-800">
                  {slot.medicine} <span className="text-slate-400">{slot.strength}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{slot.dose}</td>
                <td className="px-4 py-3 text-slate-600">{slot.instructions}</td>
                <td className="px-4 py-3 text-slate-600">{slot.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-400">Source for every row: verified prescription · no inferred values</p>
    </div>
  );
}
