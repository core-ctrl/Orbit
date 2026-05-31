"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function EndpointStatusWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  return (
    <WidgetFrame title="Endpoint Status" description="Real-time uptime monitoring for your API endpoints." onRemove={onRemove}>
      {endpoints.length ? (
        <div className="space-y-3">
          {endpoints.slice(0, 5).map((endpoint) => (
            <div className="flex items-center justify-between gap-2" key={endpoint.name}>
              <p className="truncate text-sm">{endpoint.name}</p>
              <Badge variant={endpoint.status === "up" ? "success" : endpoint.status === "degraded" ? "warning" : "danger"}>
                {endpoint.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No monitored endpoints" description="Waiting for data..." />
      )}
    </WidgetFrame>
  );
}


