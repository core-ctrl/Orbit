"use client";

import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function EndpointStatusWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  return (
    <WidgetFrame title="Endpoint Status" onRemove={onRemove}>
      {endpoints.length ? (
        <div className="space-y-3">
          {endpoints.slice(0, 5).map((endpoint) => (
            <div className="flex items-center justify-between gap-2" key={endpoint.name}>
              <p className="truncate text-sm">{endpoint.name}</p>
              <Badge tone={endpoint.status === "up" ? "good" : endpoint.status === "degraded" ? "warning" : "danger"}>
                {endpoint.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No monitored endpoints" />
      )}
    </WidgetFrame>
  );
}
