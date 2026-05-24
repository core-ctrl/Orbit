import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warning" | "danger";
}): JSX.Element {
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider",
        tone === "good" && "border-orbit/25 bg-orbit/10 text-orbit",
        tone === "warning" && "border-amber/25 bg-amber/10 text-amber",
        tone === "danger" && "border-danger/25 bg-danger/10 text-danger",
        tone === "neutral" && "border-line bg-surface text-muted"
      )}
    >
      {children}
    </span>
  );
}
