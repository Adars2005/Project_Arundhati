import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Sparkles,
  FileText,
  PhoneCall,
  ChartNoAxesCombined,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/** The 8 fixed sidebar items confirmed by the stakeholder. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Patients", href: "/patients", icon: Users },
  { label: "Medication Schedules", href: "/medication-schedules", icon: CalendarClock },
  { label: "AI Counselling", href: "/ai-counselling", icon: Sparkles },
  { label: "Counselling PDFs", href: "/counselling-pdfs", icon: FileText },
  { label: "Reminder Calls", href: "/reminder-calls", icon: PhoneCall },
  { label: "Adherence Analytics", href: "/adherence-analytics", icon: ChartNoAxesCombined },
  { label: "Settings", href: "/settings", icon: Settings },
];
