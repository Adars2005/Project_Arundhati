import { notFound } from "next/navigation";
import { CounsellingReview } from "@/components/CounsellingReview";
import { getPatient } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function CounsellingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patient = await getPatient(id);
  if (!patient) notFound();
  return <CounsellingReview patient={patient} />;
}
