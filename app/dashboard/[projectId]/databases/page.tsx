"use client";

import { useOrbitStore } from "@/store/orbitStore";
import { formatDistanceToNow } from "date-fns";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    up: "bg-green-500/20 text-green-400 border-green-500/30",
    down: "bg-red-500/20 text-red-400 border-red-500/30",
    degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    unknown: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${styles[status] ?? styles.unknown}`}>
      {status}
    </span>
  );
}

function DbIcon({ type }: { type: string }) {
  const icons: Record<string, string> = { postgres: "🐘", mongodb: "🍃", redis: "⚡" };
  return <span className="text-lg">{icons[type] ?? "🗄️"}</span>;
}

function Skeleton() {
  return <div className="h-28 bg-secondary rounded-xl animate-pulse" />;
}

export default function DatabasesPage() {
  const databases = useOrbitStore((s) => s.databases);
  const connected = useOrbitStore((s) => s.connected);

  if (!connected && databases.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Databases</h1>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-red-400 font-medium">Backend not connected</p>
          <p className="text-text-secondary text-sm mt-1">Start the Orbit backend on port 8000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Databases</h1>
          <p className="text-text-secondary text-sm mt-1">
            {databases.length === 0 ? "Configure databases in orbit.config.yaml" : `${databases.length} database${databases.length !== 1 ? "s" : ""} monitored`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs text-text-secondary">{connected ? "Live" : "Disconnected"}</span>
        </div>
      </div>

      {databases.length === 0 && connected ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <div className="text-3xl mb-3">🗄️</div>
          <p className="text-text-primary font-medium">No databases configured</p>
          <p className="text-text-secondary text-sm mt-2 max-w-md mx-auto">
            Add your databases to <code className="bg-secondary px-1.5 py-0.5 rounded text-accent font-mono text-xs">orbit.config.yaml</code> to monitor latency and health.
          </p>
          <div className="mt-4 bg-secondary rounded-lg p-4 text-left font-mono text-xs text-text-secondary max-w-sm mx-auto">
            <div className="text-text-muted mb-1"># orbit.config.yaml</div>
            <div>databases:</div>
            <div className="pl-4">- name: "Main DB"</div>
            <div className="pl-6">type: postgres</div>
            <div className="pl-6">uri: postgresql://user:pass@host/db</div>
          </div>
        </div>
      ) : databases.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton /><Skeleton /><Skeleton /><Skeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {databases.map((db) => (
            <div key={db.name} className={`bg-card border rounded-xl p-5 ${db.status === "down" ? "border-red-500/40" : "border-border"}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DbIcon type={db.type} />
                  <div>
                    <p className="font-semibold text-text-primary">{db.name}</p>
                    <p className="text-[11px] text-text-muted capitalize">{db.type}</p>
                  </div>
                </div>
                <StatusBadge status={db.status} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Latency</span>
                  <span className={`font-medium font-mono ${
                    db.latency_ms === null ? "text-text-muted" :
                    db.latency_ms < 10 ? "text-green-400" :
                    db.latency_ms < 50 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {db.latency_ms !== null ? `${db.latency_ms.toFixed(1)}ms` : "—"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Last checked</span>
                  <span className="text-text-muted text-xs">
                    {db.checked_at ? formatDistanceToNow(new Date(db.checked_at), { addSuffix: true }) : "—"}
                  </span>
                </div>
                {db.error && (
                  <p className="text-xs text-red-400 mt-2 border-t border-border pt-2">{db.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
