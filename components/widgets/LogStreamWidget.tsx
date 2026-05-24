"use client";

import { EmptyState } from "@/components/shared/Panel";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function LogStreamWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const logs = useOrbitStore((state) => state.logs);
  return (
    <WidgetFrame title="Live Events" onRemove={onRemove}>
      {logs.length ? (
        <div className="scrollbar max-h-full space-y-2 overflow-y-auto font-mono text-xs">
          {logs.slice(0, 10).map((log, index) => (
            <p key={`${log.timestamp}-${index}`} className="text-muted">
              <span className="text-orbit">{log.source}</span> {log.message}
            </p>
          ))}
        </div>
      ) : (
        <EmptyState message="Events will appear here live" />
      )}
    </WidgetFrame>
  );
}
