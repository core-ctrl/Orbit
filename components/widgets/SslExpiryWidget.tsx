"use client";

import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/Panel";
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
              <Badge tone={certificate.status === "up" ? "good" : "warning"}>
                {certificate.days_remaining === null ? "error" : `${certificate.days_remaining} days`}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message="No SSL domains configured" />
      )}
    </WidgetFrame>
  );
}
