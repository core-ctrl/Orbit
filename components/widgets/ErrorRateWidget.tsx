"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function ErrorRateWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  const failing = endpoints.filter((endpoint) => endpoint.status === "down").length;
  const rate = endpoints.length ? (failing / endpoints.length) * 100 : 0;
  return (
    <WidgetFrame title="Error Rate" description="Percentage of requests failing with a 500-level status code." onRemove={onRemove}>
      {endpoints.length ? (
        <div className="flex h-full flex-col justify-center">
          <p className="text-4xl font-semibold">{rate.toFixed(1)}%</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-danger" style={{ width: `${rate}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">{failing} failed checks of {endpoints.length} targets</p>
        </div>
      ) : (
        <EmptyState title="No endpoint checks yet" description="Waiting for data..." />
      )}
    </WidgetFrame>
  );
}


