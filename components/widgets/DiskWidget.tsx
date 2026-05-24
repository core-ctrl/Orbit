"use client";

import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { formatBytes } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export function DiskWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const system = useOrbitStore((state) => state.system);
  return (
    <WidgetFrame title="Disk Usage" onRemove={onRemove}>
      {system ? (
        <div className="flex h-full flex-col justify-center">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-semibold">{system.disk_percent.toFixed(1)}%</span>
            <span className="text-xs text-muted">{formatBytes(system.disk_used)} used</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-amber" style={{ width: `${system.disk_percent}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">{formatBytes(system.disk_total)} capacity</p>
        </div>
      ) : (
        <EmptyState message="No disk readings yet" />
      )}
    </WidgetFrame>
  );
}
