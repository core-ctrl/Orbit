"use client";

import { GaugeChart } from "@/components/charts/GaugeChart";
import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function CpuWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const system = useOrbitStore((state) => state.system);
  return (
    <WidgetFrame title="CPU Usage" onRemove={onRemove}>
      {system ? <GaugeChart value={system.cpu_percent} /> : <EmptyState message="No CPU readings yet" />}
    </WidgetFrame>
  );
}
