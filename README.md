# Arundhati Hospital — Patient Counselling & Medication Adherence System

Prototype scaffold (Day 1 of `PROJECT_PLAN.md` v2.1). Zero-cost stack, mock UI parity, and a permanent **DEMO MODE · SIMULATED DATA** badge on every screen.

> ⚠️ **This build uses synthetic demo data by default.** No real patient information, no paid services, no live carrier calls.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The login form is prefilled with demo credentials; click **Sign In**.

No environment variables are required for demo mode. Copy `.env.example` to `.env.local` only when connecting Supabase / Gemini.

## What is implemented

| Screen | Route | Status |
| --- | --- | --- |
| Sign-in (mock copy, Supabase-ready) | `/login` | ✅ |
| App shell — 8 fixed sidebar items + demo badge | all dashboard routes | ✅ |
| Dashboard (80% adherence, 24/30 taken, 3/30 missed, IVR options, call log) | `/` | ✅ |
| Patient list | `/patients` | ✅ |
| Patient record with 4 tabs + Verify & Activate | `/patients/[id]` | ✅ |
| Medication Schedules | `/medication-schedules` | ✅ |
| AI Counselling with revision history + edit/approve/reject | `/ai-counselling/[id]` | ✅ |
| Counselling PDFs — fixed template, one-click download + print fallback | `/counselling-pdfs/[id]` | ✅ |
| Reminder Calls simulator with keypad 1–4 and condition-specific option 3 | `/reminder-calls` | ✅ |
| Adherence Analytics + follow-up queue | `/adherence-analytics` | ✅ |
| Settings (roles, corpus metadata, consent, scheduler) | `/settings` | ✅ |

## Day 2–4 additions (now wired)

- **API layer** — `GET/POST /api/patients`, `GET /api/patients/[id]`, `POST /api/schedules/generate`, `POST /api/counselling/generate`, `GET /api/ivr/counselling`, `GET /api/analytics/adherence`, `GET|POST /api/cron/tick`.
- **Registration with consent** — `/patients/new` captures the exact timestamped consent checkbox and a user-entered prescription, then POSTs to the repository. New patients appear in the list and all downstream screens.
- **Schedule engine** — `src/lib/schedule/buildSlots.ts` maps only explicit frequency/timing values to slots. Unspecified values produce `needsReview` and block activation.
- **RAG counselling** — `src/lib/rag/` retrieves from the approved local corpus (production: pgvector over knowledge releases) and calls the **Gemini free tier** only when `GOOGLE_GENERATIVE_AI_API_KEY` is set. Without a key, an approved local template is used with a visible warning. A dose-safety validator rejects AI output that invents mg/tablet values.
- **IVR option 3** — now fetches condition-specific approved text from `/api/ivr/counselling` and combines all applicable conditions (with a local fallback).
- **Audit + cron** — every registration/generation writes an audit entry; the cron endpoint requires `Authorization: Bearer $CRON_SECRET`.

All endpoints work in demo mode without external services. Set `DATABASE_URL` to switch the repository to Prisma/Supabase.

## Database

`prisma/schema.prisma` contains the complete production-shaped schema (patients, prescriptions, schedules, counselling revisions, corpus releases with approval metadata, consents, reminder events, call responses, audit log).

To connect a free Supabase project:

1. Create a free Supabase project, enable `pgvector`, copy the connection strings into `.env.local`.
2. Allow Prisma install scripts if prompted by npm: `npm install-scripts approve prisma @prisma/client @prisma/engines esbuild core-js`
3. `npm run db:generate && npm run db:push && npm run db:seed`

Until the data layer is wired, all screens read from `src/lib/mock/data.ts`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run typecheck` — TypeScript check
- `npm run db:generate` / `db:push` / `db:seed` — Prisma

## Design decisions locked

See `PROJECT_PLAN.md` §16. Highlights: 8 fixed sidebar labels; permanent demo badge; one-click PDF download with print fallback; English-first but language-ready; pharmacist edit/approve/reject with immutable revisions; condition-specific IVR option 3; timestamped registration consent; clinical corpus approved only by the stakeholder-appointed clinical authority.
