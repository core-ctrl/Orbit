"use client";

import { GaugeChart } from "@/components/charts/GaugeChart";
import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function CpuWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const system = useOrbitStore((state) => state.system);
  return (
    <WidgetFrame title="CPU Usage" description="Host server CPU utilization percentage over time." onRemove={onRemove}>
      {system ? <GaugeChart value={system.cpu_percent} /> : <EmptyState title="No CPU readings yet" description="Waiting for data..." />}
    </WidgetFrame>
  );
}


