"use client";

import { useEffect, useState } from "react";
import { PhoneCall, PhoneOff, Volume2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { callLogs, patients as seedPatients, type CallLog } from "@/lib/mock/data";
import type { PatientDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const conditionAudio: Record<string, string> = {
  DM: "Approved diabetes counselling: take medicines at the scheduled times, monitor blood sugar, limit sugar and stay active.",
  HTN: "Approved hypertension counselling: limit salt, take blood pressure medicines regularly and check your readings.",
  CKD: "Approved kidney precautions: stay hydrated as advised, avoid painkillers unless prescribed and keep follow-up appointments.",
};

const keys = [
  { key: "1", label: "Medicine taken", meaning: "TAKEN" },
  { key: "2", label: "Medicine not taken", meaning: "NOT_TAKEN" },
  { key: "3", label: "Get counselling", meaning: "COUNSELLING" },
  { key: "4", label: "Other queries", meaning: "OTHER_QUERY" },
];

export function CallSimulator() {
  const [allPatients, setAllPatients] = useState<PatientDTO[]>(seedPatients as PatientDTO[]);
  const [patient, setPatient] = useState<PatientDTO>(seedPatients[0] as PatientDTO);
  const [active, setActive] = useState(false);
  const [spoken, setSpoken] = useState("");
  const [log, setLog] = useState<CallLog[]>(callLogs);

  useEffect(() => {
    fetch("/api/patients")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { patients: PatientDTO[] }) => {
        setAllPatients(payload.patients);
        setPatient((current) => payload.patients.find((item) => item.id === current.id) ?? payload.patients[0] ?? current);
      })
      .catch(() => undefined);
  }, []);

  function speak(text: string) {
    setSpoken(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = patient.language === "en" ? "en-IN" : "te-IN";
      window.speechSynthesis.speak(utterance);
    }
  }

  function press(key: string, label: string) {
    const meaning = keys.find((item) => item.key === key)?.meaning ?? "OTHER_QUERY";
    if (meaning === "COUNSELLING") {
      fetch(`/api/ivr/counselling?patientId=${encodeURIComponent(patient.id)}`)
        .then((response) => (response.ok ? response.json() : Promise.reject()))
        .then((payload: { audioText: string }) => speak(payload.audioText))
        .catch(() => {
          const chunks = patient.conditions.map((condition) => conditionAudio[condition]).filter(Boolean);
          speak(chunks.length ? chunks.join(" ") : "No condition-specific approved content is available.");
        });
    } else {
      speak(meaning === "TAKEN" ? "Thank you. Your response has been recorded." : "Response recorded. Your pharmacist will review it.");
    }
    const status: CallLog["status"] =
      meaning === "TAKEN" ? "Taken" :
      meaning === "NOT_TAKEN" ? "Missed" :
      meaning === "COUNSELLING" ? "Counselling" : "Follow-up";
    setLog((current) => [
      {
        id: `call-${Date.now()}`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        medicine: "Metformin 500 mg",
        status,
      },
      ...current,
    ]);
    setActive(false);
  }

  return (
    <>
      <AppHeader title="Reminder Calls" subtitle="In-browser IVR simulator · keypad responses stored against patient, medicine and slot" />
      <div className="space-y-5 p-6">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Medication Reminder Calls — {active ? "Calling in progress…" : "Ready"}</p>
              <p className="text-xs text-slate-500">Simulated provider · no carrier or call charges involved</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="input w-auto"
                value={patient.id}
                onChange={(event) => setPatient(allPatients.find((item) => item.id === event.target.value) ?? allPatients[0])}
                aria-label="Select patient"
              >
                {allPatients.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.code}</option>)}
              </select>
              <button className="btn-primary" type="button" onClick={() => { setActive(true); setSpoken(""); }}>
                <PhoneCall className="h-4 w-4" /> Start simulated call
              </button>
            </div>
          </div>
        </div>

        {active ? (
          <div className="card border-brand-300 bg-brand-50/40 p-6">
            <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="text-center">
                <p className="text-xs text-slate-500">Reminder for {patient.name}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">Metformin 500 mg · 8:00 AM</p>
                <button className="btn-secondary mt-3" type="button" onClick={() => speak("This is your medicine reminder. Please choose an option.")}>
                  <Volume2 className="h-4 w-4" /> Play reminder
                </button>
              </div>
              {spoken ? <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{spoken}</p> : null}
              <div className="mt-5 grid grid-cols-2 gap-2">
                {keys.map((item) => (
                  <button key={item.key} type="button" onClick={() => press(item.key, item.label)} className="btn-secondary justify-start">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-brand-50 text-xs font-semibold text-brand-700">{item.key}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="btn mt-4 w-full text-red-600" type="button" onClick={() => setActive(false)}>
                <PhoneOff className="h-4 w-4" /> End call
              </button>
            </div>
          </div>
        ) : null}

        {spoken && !active ? (
          <div className="card border-brand-200 bg-brand-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Last IVR response / playback</p>
            <p className="mt-1 text-sm text-slate-700">{spoken}</p>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-slate-900">Call log</h2>
              <p className="text-xs text-slate-500">Every keypad response is persisted with its event</p>
            </div>
            <div className="divide-y divide-slate-100">
              {log.map((call) => (
                <div key={call.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-slate-800">{call.medicine}</p>
                    <p className="text-xs text-slate-500">{call.date} · {call.time}</p>
                  </div>
                  <span className={cn(
                    "badge",
                    call.status === "Taken" ? "bg-emerald-50 text-emerald-700" :
                    call.status === "Missed" ? "bg-red-50 text-red-700" :
                    call.status === "Counselling" || call.status === "Follow-up" ? "bg-brand-50 text-brand-700" :
                    "bg-slate-100 text-slate-600",
                  )}>
                    {call.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900">Condition-specific option 3</h2>
            <p className="mt-2 text-xs text-slate-600">
              For {patient.name} ({patient.conditions.join(" + ")}), approved chunks are combined from the active corpus release.
            </p>
            <ul className="mt-3 space-y-2">
              {patient.conditions.map((condition) => (
                <li key={condition} className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  <span className="font-semibold text-brand-700">{condition}</span> · approved IVR script
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
