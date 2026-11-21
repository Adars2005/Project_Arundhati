import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arundhati Hospital · Patient Counselling & Medication Adherence",
  description:
    "AI-powered counselling, smart reminders, improved care. Prototype with simulated data.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
