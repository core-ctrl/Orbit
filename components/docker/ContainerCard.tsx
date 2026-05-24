"use client";

import { ContainerActions } from "@/components/docker/ContainerActions";
import { Badge } from "@/components/shared/Badge";
import { StatusDot } from "@/components/shared/StatusDot";
import { cn, formatBytes } from "@/lib/utils";
import type { ContainerMetric } from "@/types/orbit";

export function ContainerCard({
  container,
  selected,
  onSelect
}: {
  container: ContainerMetric;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  return (
    <article className={cn("panel p-5 transition", selected && "border-orbit/40")}>
      <button type="button" className="mb-4 w-full text-left" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-medium"><StatusDot status={container.status} />{container.name}</p>
            <p className="mt-1 truncate text-xs text-muted">{container.image}</p>
          </div>
          <Badge tone={container.status === "running" ? "good" : "warning"}>{container.status}</Badge>
        </div>
      </button>
      <div className="mb-5 grid grid-cols-2 gap-3 text-xs text-muted">
        <p>CPU <span className="block pt-1 text-base text-ink">{container.cpu_percent.toFixed(1)}%</span></p>
        <p>RAM <span className="block pt-1 text-base text-ink">{formatBytes(container.memory_usage)}</span></p>
        <p>RX <span className="block pt-1 text-base text-ink">{formatBytes(container.network_rx)}</span></p>
        <p>Restarts <span className="block pt-1 text-base text-ink">{container.restart_count}</span></p>
      </div>
      <ContainerActions id={container.id} />
    </article>
  );
}
