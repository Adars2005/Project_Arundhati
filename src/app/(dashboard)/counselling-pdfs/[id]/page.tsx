import { notFound } from "next/navigation";
import { CounsellingPdf } from "@/components/CounsellingPdf";
import { getPatient } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function PdfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatient(id);
  if (!patient) notFound();
  return <CounsellingPdf patient={patient} />;
}
