"use client";

import { AreaChart } from "@/components/charts/AreaChart";
import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function ResponseTimeWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  const data = endpoints
    .filter((endpoint) => endpoint.latency_ms !== null)
    .map((endpoint) => ({ label: endpoint.name.slice(0, 12), value: endpoint.latency_ms ?? 0 }));
  return (
    <WidgetFrame title="Response Times" onRemove={onRemove}>
      {data.length ? (
        <div className="h-full min-h-40">
          <AreaChart data={data} unit=" ms" color="#4cc9f0" />
        </div>
      ) : (
        <EmptyState message="No latency samples yet" />
      )}
    </WidgetFrame>
  );
}
