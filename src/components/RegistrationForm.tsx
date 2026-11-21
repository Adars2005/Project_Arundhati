"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { CONSENT_TEXT } from "@/lib/constants";
import type { PatientDTO } from "@/lib/types";

const conditionOptions = ["DM", "HTN", "CKD", "DYSLIPIDEMIA", "ASTHMA"];
const frequencyOptions = ["OD", "BD", "TDS", "QID", "HS", "SOS", "CUSTOM", "UNSPECIFIED"];
const timingOptions = ["BEFORE_FOOD", "AFTER_FOOD", "ANY", "UNSPECIFIED"];

type Item = {
  medicineName: string;
  strength: string;
  doseText: string;
  frequencyCode: string;
  durationDays: string;
  timingCode: string;
  specialInstructions: string;
};

const blankItem: Item = {
  medicineName: "",
  strength: "",
  doseText: "",
  frequencyCode: "OD",
  durationDays: "30",
  timingCode: "UNSPECIFIED",
  specialInstructions: "",
};

export function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [items, setItems] = useState<Item[]>([{ ...blankItem }]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<PatientDTO | null>(null);

  function updateItem(index: number, patch: Partial<Item>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          age: Number(age),
          gender,
          phone,
          address,
          conditions,
          consent,
          consentText: CONSENT_TEXT,
          prescription: items
            .filter((item) => item.medicineName.trim())
            .map((item) => ({
              medicineName: item.medicineName.trim(),
              strength: item.strength.trim(),
              doseText: item.doseText.trim(),
              frequencyCode: item.frequencyCode,
              durationDays: Number(item.durationDays),
              timingCode: item.timingCode,
              specialInstructions: item.specialInstructions.trim(),
            })),
        }),
      });
      const payload = (await response.json()) as { patient?: PatientDTO; error?: string };
      if (!response.ok || !payload.patient) throw new Error(payload.error ?? "Registration failed");
      setCreated(payload.patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  if (created) {
    return (
      <div className="card mx-auto max-w-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Patient registered</h2>
        <p className="mt-2 text-sm text-slate-600">
          {created.name} · <span className="font-mono">{created.code}</span> · consent recorded {new Date(created.consentAt).toLocaleString("en-GB")}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href={`/patients/${created.id}`} className="btn-primary">Open patient record</Link>
          <Link href="/patients" className="btn-secondary">Back to patients</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <section className="card p-5">
        <h2 className="text-sm font-semibold text-slate-900">Basic details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Age" required>
            <input className="input" type="number" min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)} required />
          </Field>
          <Field label="Gender" required>
            <select className="input" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Contact number" required>
            <input className="input" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label="Address">
            <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <span className="label">Diagnosed conditions</span>
          <div className="flex flex-wrap gap-2">
            {conditionOptions.map((condition) => (
              <label key={condition} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs">
                <input
                  type="checkbox"
                  checked={conditions.includes(condition)}
                  onChange={(e) => setConditions((current) => e.target.checked ? [...current, condition] : current.filter((c) => c !== condition))}
                />
                {condition}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Verified prescription</h2>
            <p className="text-xs text-slate-500">Every dose, frequency and duration is user-entered — never inferred.</p>
          </div>
          <button type="button" className="btn-secondary" onClick={() => setItems((current) => [...current, { ...blankItem }])}>
            <Plus className="h-4 w-4" /> Add medicine
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Medicine {index + 1}</span>
                {items.length > 1 ? (
                  <button type="button" className="text-xs text-red-600" onClick={() => setItems((current) => current.filter((_, i) => i !== index))}>
                    <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Remove
                  </button>
                ) : null}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Medicine name"><input className="input" value={item.medicineName} onChange={(e) => updateItem(index, { medicineName: e.target.value })} /></Field>
                <Field label="Strength"><input className="input" placeholder="500 mg" value={item.strength} onChange={(e) => updateItem(index, { strength: e.target.value })} /></Field>
                <Field label="Dose"><input className="input" placeholder="1 tablet" value={item.doseText} onChange={(e) => updateItem(index, { doseText: e.target.value })} /></Field>
                <Field label="Frequency">
                  <select className="input" value={item.frequencyCode} onChange={(e) => updateItem(index, { frequencyCode: e.target.value })}>
                    {frequencyOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Duration (days)"><input className="input" type="number" min={1} value={item.durationDays} onChange={(e) => updateItem(index, { durationDays: e.target.value })} /></Field>
                <Field label="Timing">
                  <select className="input" value={item.timingCode} onChange={(e) => updateItem(index, { timingCode: e.target.value })}>
                    {timingOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Special instructions"><input className="input sm:col-span-3" value={item.specialInstructions} onChange={(e) => updateItem(index, { specialInstructions: e.target.value })} /></Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          <span className="text-sm text-slate-700">{CONSENT_TEXT}</span>
        </label>
        <p className="mt-2 text-xs text-slate-500">Timestamped and linked to the patient record. Required before reminders or counselling.</p>
      </section>

      {error ? <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <Link href="/patients" className="btn-secondary">Cancel</Link>
        <button className="btn-primary" type="submit" disabled={busy}>{busy ? "Registering…" : "Register patient"}</button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}{required ? " *" : ""}</span>
      {children}
    </label>
  );
}
