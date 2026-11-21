import { notFound } from "next/navigation";
import { PatientDetail } from "@/components/PatientDetail";
import { getPatient } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatient(id);
  if (!patient) notFound();
  return <PatientDetail patient={patient} />;
}
