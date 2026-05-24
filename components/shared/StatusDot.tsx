import { cn } from "@/lib/utils";
import type { StatusValue } from "@/types/orbit";

export function StatusDot({ status }: { status: StatusValue | string }): JSX.Element {
  return (
    <span
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        status === "up" || status === "running"
          ? "bg-orbit shadow-[0_0_9px_#44d7b6]"
          : status === "degraded" || status === "paused"
            ? "bg-amber"
            : status === "unknown"
              ? "bg-muted"
              : "bg-danger"
      )}
    />
  );
}
