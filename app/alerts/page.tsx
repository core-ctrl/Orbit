"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/shared/Badge";
import { EmptyState, Panel } from "@/components/shared/Panel";
import { timeAgo } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export default function AlertsPage(): JSX.Element {
  const alerts = useOrbitStore((state) => state.alerts);
  return (
    <DashboardShell>
      <Panel>
        <h2 className="mb-5 font-medium">Recent alerts</h2>
        {alerts.length ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <article className="rounded-xl border border-line bg-surface p-4" key={alert.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge tone={alert.severity === "critical" ? "danger" : alert.severity === "warning" ? "warning" : "neutral"}>{alert.severity}</Badge>
                    <h3 className="font-medium">{alert.title}</h3>
                  </div>
                  <span className="text-xs text-muted">{timeAgo(alert.created_at)}</span>
                </div>
                <p className="mt-3 text-sm text-muted">{alert.source}: {alert.message}</p>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="No alerts recorded" />
        )}
      </Panel>
    </DashboardShell>
  );
}
