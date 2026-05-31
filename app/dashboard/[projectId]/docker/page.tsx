"use client";

import { useState } from "react";
import { useOrbitStore } from "@/store/orbitStore";
import { api } from "@/lib/api";

function fmtBytes(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  return `${b} B`;
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "running" ? "bg-green-500" :
    status === "exited" ? "bg-red-500" :
    status === "paused" ? "bg-yellow-500" : "bg-gray-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

function ProgressBar({ percent, color = "#a78bfa" }: { percent: number; color?: string }) {
  return (
    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(percent, 100)}%`, background: color }}
      />
    </div>
  );
}

function Skeleton() {
  return <div className="h-24 bg-secondary rounded-xl animate-pulse" />;
}

export default function DockerPage() {
  const docker = useOrbitStore((s) => s.docker);
  const containers = useOrbitStore((s) => s.containers);
  const connected = useOrbitStore((s) => s.connected);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const doAction = async (name: string, action: string) => {
    setActionLoading(`${name}-${action}`);
    setActionError(null);
    try {
      await api.containerAction(name, action as "start" | "stop" | "restart");
    } catch (e: unknown) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Not yet received any data
  if (!docker && !connected) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Docker Containers</h1>
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-red-400 font-medium">Backend not connected</p>
          <p className="text-text-secondary text-sm mt-1">Start the Orbit backend on port 8000</p>
        </div>
      </div>
    );
  }

  if (!docker) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Docker Containers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton /><Skeleton /><Skeleton /><Skeleton />
        </div>
      </div>
    );
  }

  if (!docker.available) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-text-primary">Docker Containers</h1>
        <div className="bg-card border border-red-500/30 rounded-xl p-8 text-center">
          <div className="text-3xl mb-3">🐳</div>
          <p className="text-text-primary font-medium">Docker not available</p>
          <p className="text-text-secondary text-sm mt-1 max-w-md mx-auto">
            {docker.error || "Docker daemon is not running or not accessible"}
          </p>
          <p className="text-text-muted text-xs mt-3">Make sure Docker Desktop is running and the daemon socket is accessible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Docker Containers</h1>
          <p className="text-text-secondary text-sm mt-1">{containers.length} container{containers.length !== 1 ? "s" : ""} detected</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-text-secondary">Live</span>
        </div>
      </div>

      {actionError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-sm text-red-400">
          {actionError}
        </div>
      )}

      {containers.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <p className="text-text-secondary">No containers found. Start a Docker container to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {containers.map((c) => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot status={c.status} />
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{c.name}</p>
                    <p className="text-[11px] text-text-muted truncate">{c.image}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {c.restart_count > 0 && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-medium">
                      {c.restart_count} restarts
                    </span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    c.status === "running" ? "bg-green-500/20 text-green-400" :
                    "bg-red-500/20 text-red-400"
                  }`}>{c.status}</span>
                </div>
              </div>

              {/* Metrics */}
              {c.status === "running" && (
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">CPU</span>
                      <span className="text-text-primary">{c.cpu_percent.toFixed(1)}%</span>
                    </div>
                    <ProgressBar percent={c.cpu_percent} color={c.cpu_percent > 80 ? "#ef4444" : "#a78bfa"} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary">Memory</span>
                      <span className="text-text-primary">
                        {fmtBytes(c.memory_usage)} / {fmtBytes(c.memory_limit)} ({c.memory_percent.toFixed(0)}%)
                      </span>
                    </div>
                    <ProgressBar percent={c.memory_percent} color={c.memory_percent > 80 ? "#ef4444" : "#22c55e"} />
                  </div>
                </div>
              )}

              {/* Ports */}
              {c.ports.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {c.ports.flatMap((p) =>
                    p.public_bindings.length > 0
                      ? p.public_bindings.map((b) => (
                          <span key={b} className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 rounded font-mono">
                            {b} → {p.private_port}
                          </span>
                        ))
                      : []
                  )}
                </div>
              )}

              {/* Uptime */}
              {c.uptime_seconds != null && (
                <p className="text-[11px] text-text-muted">
                  Uptime: {Math.floor(c.uptime_seconds / 3600)}h {Math.floor((c.uptime_seconds % 3600) / 60)}m
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1 border-t border-border">
                {c.status === "running" ? (
                  <>
                    <button
                      onClick={() => doAction(c.name, "restart")}
                      disabled={!!actionLoading}
                      className="text-xs px-3 py-1.5 rounded-lg bg-secondary border border-border hover:bg-hover transition-colors disabled:opacity-50"
                    >
                      {actionLoading === `${c.name}-restart` ? "…" : "Restart"}
                    </button>
                    <button
                      onClick={() => doAction(c.name, "stop")}
                      disabled={!!actionLoading}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === `${c.name}-stop` ? "…" : "Stop"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => doAction(c.name, "start")}
                    disabled={!!actionLoading}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === `${c.name}-start` ? "…" : "Start"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
