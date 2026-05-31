"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function UptimeWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  return (
    <WidgetFrame title="Uptime Overview" onRemove={onRemove}>
      {endpoints.length ? (
        <div className="space-y-3">
          {endpoints.slice(0, 6).map((endpoint) => (
            <div className="flex items-center justify-between" key={endpoint.name}>
              <div className="flex items-center gap-2 text-sm text-text-primary">
                <span className={`w-2 h-2 rounded-full ${endpoint.status === 'up' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                {endpoint.name}
              </div>
              <span className="text-xs text-muted">
                {endpoint.latency_ms === null ? "--" : `${endpoint.latency_ms} ms`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="Add apps or endpoints in your config" description="Waiting for data..." />
      )}
    </WidgetFrame>
  );
}


