import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  hint,
  icon
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}): JSX.Element {
  return (
    <div className="panel flex items-start justify-between p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
        {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
      </div>
      {icon && <div className="rounded-xl bg-orbit/10 p-3 text-orbit">{icon}</div>}
    </div>
  );
}
