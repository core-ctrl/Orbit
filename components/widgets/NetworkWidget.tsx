"use client";

import { AreaChart } from "@/components/charts/AreaChart";
import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function NetworkWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const history = useOrbitStore((state) => state.systemHistory);
  const data = history.map((metric) => ({
    label: new Date(metric.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    value: Math.round(metric.network_rx / 1024 / 1024)
  }));
  return (
    <WidgetFrame title="Network Received" onRemove={onRemove}>
      {data.length > 1 ? (
        <div className="h-full min-h-40"><AreaChart data={data} unit=" MB" /></div>
      ) : (
        <EmptyState message="Waiting for network history" />
      )}
    </WidgetFrame>
  );
}
