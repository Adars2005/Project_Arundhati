import { AppHeader } from "@/components/AppHeader";
import { RegistrationForm } from "@/components/RegistrationForm";

export default function NewPatientPage() {
  return (
    <>
      <AppHeader title="Register Patient" subtitle="Step 1 of the workflow · consent + verified prescription" />
      <div className="p-6"><RegistrationForm /></div>
    </>
  );
}
