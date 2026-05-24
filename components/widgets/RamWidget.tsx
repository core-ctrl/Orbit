"use client";

import { GaugeChart } from "@/components/charts/GaugeChart";
import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { formatBytes } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export function RamWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const system = useOrbitStore((state) => state.system);
  return (
    <WidgetFrame title="Memory Usage" onRemove={onRemove}>
      {system ? (
        <>
          <GaugeChart value={system.memory_percent} color="#4cc9f0" />
          <p className="-mt-3 text-center text-xs text-muted">
            {formatBytes(system.memory_used)} / {formatBytes(system.memory_total)}
          </p>
        </>
      ) : (
        <EmptyState message="No memory readings yet" />
      )}
    </WidgetFrame>
  );
}
