import { CONSENT_TEXT } from "@/lib/constants";
import { isDemoMode } from "@/lib/demo";

export const config = {
  demo: isDemoMode(),
  database: Boolean(process.env.DATABASE_URL),
  geminiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  cronSecret: process.env.CRON_SECRET ?? "development-secret",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};

export { CONSENT_TEXT };
