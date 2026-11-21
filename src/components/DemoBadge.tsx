import { DEMO_BADGE_TEXT } from "@/lib/demo";
import { cn } from "@/lib/utils";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      data-testid="demo-badge"
      className={cn(
        "badge border border-amber-300 bg-amber-50 text-amber-800 uppercase tracking-wide",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
      {DEMO_BADGE_TEXT}
    </span>
  );
}
