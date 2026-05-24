"use client";

import { useState } from "react";

import { AreaChart } from "@/components/charts/AreaChart";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/shared/Badge";
import { EmptyState, Panel } from "@/components/shared/Panel";
import { useEndpointHistory } from "@/hooks/useEndpoints";
import { timeAgo } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export default function EndpointsPage(): JSX.Element {
  const endpoints = useOrbitStore((state) => state.endpoints);
  const [selected, setSelected] = useState("");
  const active = selected || endpoints[0]?.name || "";
  const history = useEndpointHistory(active);
  const data = (history.data ?? []).map((point) => ({
    label: new Date(point.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    value: point.latency_ms ?? 0
  }));
  return (
    <DashboardShell>
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <Panel>
          <h2 className="mb-4 font-medium">Configured Checks</h2>
          {endpoints.length ? <div className="space-y-3">{endpoints.map((endpoint) => (
            <button key={endpoint.name} type="button" onClick={() => setSelected(endpoint.name)} className="w-full rounded-xl border border-line bg-surface p-4 text-left hover:border-orbit/30">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{endpoint.name}</span>
                <Badge tone={endpoint.status === "up" ? "good" : endpoint.status === "degraded" ? "warning" : "danger"}>{endpoint.status}</Badge>
              </div>
              <p className="mt-2 truncate text-xs text-muted">{endpoint.method} {endpoint.url}</p>
              <p className="mt-3 text-xs text-muted">{endpoint.latency_ms ?? "--"} ms / checked {timeAgo(endpoint.checked_at)}</p>
            </button>
          ))}</div> : <EmptyState message="No endpoints configured" />}
        </Panel>
        <Panel>
          <h2 className="mb-4 font-medium">{active ? `${active} latency history` : "Latency history"}</h2>
          {data.length ? <div className="h-[360px]"><AreaChart data={data} unit=" ms" color="#4cc9f0" /></div> : <EmptyState message="History appears after the first checks run" />}
        </Panel>
      </div>
    </DashboardShell>
  );
}
