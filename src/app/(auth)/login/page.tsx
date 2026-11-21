import { LoginForm } from "@/components/LoginForm";
import { isDemoMode } from "@/lib/demo";

export default function LoginPage() {
  return <LoginForm demoMode={isDemoMode()} />;
}
