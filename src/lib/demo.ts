/**
 * Demo mode is the default. The app renders seeded, clearly-labelled synthetic
 * data until Supabase credentials are supplied in .env.local.
 */
export const isDemoMode = () =>
  process.env.DEMO_LOCAL === "1" ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const DEMO_BADGE_TEXT = "DEMO MODE · SIMULATED DATA";
