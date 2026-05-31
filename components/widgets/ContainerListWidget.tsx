"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { formatBytes } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export function ContainerListWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const containers = useOrbitStore((state) => state.containers);
  return (
    <WidgetFrame title="Containers" onRemove={onRemove}>
      {containers.length ? (
        <div className="scrollbar max-h-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">CPU</th>
                <th className="pb-3 font-medium">RAM</th>
              </tr>
            </thead>
            <tbody>
              {containers.slice(0, 7).map((container) => (
                <tr className="border-t border-line/60" key={container.id}>
                  <td className="py-3 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${container.status === 'running' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
                    {container.name}
                  </td>
                  <td className="py-3 text-muted">{container.cpu_percent.toFixed(1)}%</td>
                  <td className="py-3 text-muted">{formatBytes(container.memory_usage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No Docker containers detected" description="Waiting for data..." />
      )}
    </WidgetFrame>
  );
}


