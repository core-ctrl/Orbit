"use client";

import { ContainerActions } from "@/components/docker/ContainerActions";
import { Badge } from "@/components/ui/badge";
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
    <article className={cn("glass-card p-5 transition-all", selected && "border-accent shadow-glow")}>
      <button type="button" className="mb-4 w-full text-left" onClick={onSelect}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 font-medium text-text-primary">
              <span className={`w-2 h-2 rounded-full ${container.status === 'running' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
              {container.name}
            </p>
            <p className="mt-1 truncate text-xs text-text-muted">{container.image}</p>
          </div>
          <Badge variant={container.status === "running" ? "success" : "danger"}>{container.status}</Badge>
        </div>
      </button>
      <div className="mb-5 grid grid-cols-2 gap-3 text-xs text-text-secondary">
        <p>CPU <span className="block pt-1 text-base text-text-primary font-mono">{container.cpu_percent.toFixed(1)}%</span></p>
        <p>RAM <span className="block pt-1 text-base text-text-primary font-mono">{formatBytes(container.memory_usage)}</span></p>
        <p>RX <span className="block pt-1 text-base text-text-primary font-mono">{formatBytes(container.network_rx)}</span></p>
        <p>Restarts <span className="block pt-1 text-base text-text-primary font-mono">{container.restart_count}</span></p>
      </div>
      <ContainerActions id={container.id} />
    </article>
  );
}
