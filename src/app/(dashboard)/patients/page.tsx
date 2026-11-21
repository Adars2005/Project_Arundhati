"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { patients as seedPatients } from "@/lib/mock/data";
import type { PatientDTO } from "@/lib/types";

const conditionNames: Record<string, string> = {
  DM: "Diabetes",
  HTN: "Hypertension",
  DYSLIPIDEMIA: "Dyslipidaemia",
  CKD: "Kidney disease",
  ASTHMA: "Asthma",
};

function toDTO(patient: (typeof seedPatients)[number]): PatientDTO {
  return {
    id: patient.id,
    code: patient.code,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    phone: patient.phone,
    address: patient.address,
    conditions: patient.conditions,
    language: patient.language,
    consentAt: patient.consentAt,
    history: patient.history,
    allergies: patient.allergies,
    lifestyle: patient.lifestyle,
    clinical: patient.clinical,
  };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientDTO[]>(() => seedPatients.map(toDTO));
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/patients")
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((payload: { patients: PatientDTO[] }) => setPatients(payload.patients))
      .catch(() => undefined);
  }, []);

  const visible = patients.filter((patient) =>
    `${patient.name} ${patient.code}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <AppHeader title="Patients" subtitle="Registered patients · synthetic demo records" />
      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search by name or patient ID"
              aria-label="Search patients"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Link href="/patients/new" className="btn-primary">
            <UserPlus className="h-4 w-4" /> Register patient
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Patient</th>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Age / Gender</th>
                  <th className="px-5 py-3 font-medium">Conditions</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Consent</th>
                  <th className="px-5 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-medium text-slate-800">{patient.name}</td>
                    <td className="px-5 py-3 text-slate-600">{patient.code}</td>
                    <td className="px-5 py-3 text-slate-600">{patient.age} / {patient.gender}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition) => (
                          <span key={condition} className="badge bg-brand-50 text-brand-700">
                            {conditionNames[condition] ?? condition}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{patient.phone}</td>
                    <td className="px-5 py-3 text-xs text-emerald-700">Recorded</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/patients/${patient.id}`} className="text-xs font-medium text-brand-600 hover:underline">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
