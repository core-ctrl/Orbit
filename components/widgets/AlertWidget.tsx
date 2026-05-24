"use client";

import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { timeAgo } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export function AlertWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const alerts = useOrbitStore((state) => state.alerts);
  return (
    <WidgetFrame title="Alert Feed" onRemove={onRemove}>
      {alerts.length ? (
        <div className="space-y-3">
          {alerts.slice(0, 4).map((alert) => (
            <div className="rounded-lg border border-line bg-surface p-3 text-sm" key={alert.id}>
              <div className="flex justify-between gap-3">
                <span>{alert.title}</span>
                <span className="shrink-0 text-xs text-muted">{timeAgo(alert.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No active alerts" />
      )}
    </WidgetFrame>
  );
}
