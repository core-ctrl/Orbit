import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return <section className={cn("panel h-full p-5", className)}>{children}</section>;
}

export function EmptyState({ message }: { message: string }): JSX.Element {
  return (
    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-line text-sm text-muted">
      {message}
    </div>
  );
}
