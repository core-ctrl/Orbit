"use client";

import { useOrbitStore } from "@/store/orbitStore";
import { formatDistanceToNow } from "date-fns";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    up: "bg-green-500/20 text-green-400 border-green-500/30",
    down: "bg-red-500/20 text-red-400 border-red-500/30",
    degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    timeout: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${styles[status] ?? styles.unknown}`}>
      {status}
    </span>
  );
}

function LatencyBar({ ms }: { ms: number | null }) {
  if (ms === null) return <span className="text-text-muted text-xs">—</span>;
  const color = ms < 300 ? "#22c55e" : ms < 1000 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{ color }} className="text-xs font-mono font-semibold">
      {ms.toFixed(0)}ms
    </span>
  );
}

function Skeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-32 bg-secondary rounded" />
        <div className="h-4 w-16 bg-secondary rounded" />
      </div>
      <div className="h-3 w-48 bg-secondary rounded" />
      <div className="flex gap-4">
        <div className="h-3 w-20 bg-secondary rounded" />
        <div className="h-3 w-20 bg-secondary rounded" />
      </div>
    </div>
  );
}

export default function UptimePage() {
  const endpoints = useOrbitStore((s) => s.endpoints);
  const connected = useOrbitStore((s) => s.connected);

  if (!connected && endpoints.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Uptime Monitoring</h1>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-red-400 font-medium">Backend not connected</p>
          <p className="text-text-secondary text-sm mt-1">Start the Orbit backend on port 8000</p>
        </div>
      </div>
    );
  }

  const upCount = endpoints.filter((e) => e.status === "up").length;
  const downCount = endpoints.filter((e) => e.status === "down").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Uptime Monitoring</h1>
          <p className="text-text-secondary text-sm mt-1">
            {endpoints.length === 0
              ? "Monitoring endpoints from orbit.config.yaml"
              : `${upCount} up · ${downCount} down · ${endpoints.length} total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs text-text-secondary">{connected ? "Live" : "Disconnected"}</span>
        </div>
      </div>

      {endpoints.length === 0 && connected ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="text-3xl mb-3">🌐</div>
          <p className="text-text-primary font-medium">No endpoints configured yet</p>
          <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
            Add endpoints to your <code className="bg-secondary px-1.5 py-0.5 rounded text-accent font-mono text-xs">orbit.config.yaml</code> to start monitoring.
          </p>
          <div className="mt-4 bg-secondary rounded-lg p-4 text-left font-mono text-xs text-text-secondary max-w-sm mx-auto">
            <div className="text-text-muted mb-1"># orbit.config.yaml</div>
            <div>apps:</div>
            <div className="pl-4">{`- name: "My API"`}</div>
            <div className="pl-6">url: https://api.example.com</div>
            <div className="pl-6">health_endpoint: /health</div>
          </div>
        </div>
      ) : endpoints.length === 0 ? (
        <div className="space-y-3">
          <Skeleton /><Skeleton /><Skeleton />
        </div>
      ) : (
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.name} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={ep.status} />
                    <span className="font-semibold text-text-primary">{ep.name}</span>
                  </div>
                  <a
                    href={ep.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-text-muted hover:text-accent transition-colors truncate block"
                  >
                    {ep.url}
                  </a>
                  {ep.error && (
                    <p className="text-xs text-red-400 mt-1">{ep.error}</p>
                  )}
                </div>
                <div className="shrink-0 text-right space-y-1">
                  <LatencyBar ms={ep.latency_ms} />
                  {ep.status_code && (
                    <p className="text-[11px] text-text-muted">HTTP {ep.status_code}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[11px] text-text-muted border-t border-border pt-3">
                <span>Method: <span className="text-text-secondary">{ep.method}</span></span>
                <span>Checked: <span className="text-text-secondary">
                  {ep.checked_at ? formatDistanceToNow(new Date(ep.checked_at), { addSuffix: true }) : "—"}
                </span></span>
                {ep.tags.length > 0 && (
                  <div className="flex gap-1">
                    {ep.tags.map((t) => (
                      <span key={t} className="bg-secondary border border-border px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
