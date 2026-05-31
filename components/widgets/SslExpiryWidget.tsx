"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { WidgetFrame } from "@/components/widgets/WidgetFrame";
import { useOrbitStore } from "@/store/orbitStore";

export function SslExpiryWidget({ onRemove }: { onRemove?: () => void }): JSX.Element {
  const certificates = useOrbitStore((state) => state.ssl);
  return (
    <WidgetFrame title="SSL Expiry" onRemove={onRemove}>
      {certificates.length ? (
        <div className="space-y-3">
          {certificates.map((certificate) => (
            <div className="flex items-center justify-between text-sm" key={certificate.domain}>
              <span>{certificate.domain}</span>
              <Badge variant={certificate.status === "up" ? "success" : "warning"}>
                {certificate.days_remaining === null ? "error" : `${certificate.days_remaining} days`}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No SSL domains configured" description="Waiting for data..." />
      )}
    </WidgetFrame>
  );
}


