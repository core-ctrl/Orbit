"use client";

import { useOrbitStore } from "@/store/orbitStore";

function fmtBytes(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  if (b >= 1e3) return `${(b / 1e3).toFixed(0)} KB`;
  return `${b} B`;
}

function fmtBps(bps: number): string {
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(1)} MB/s`;
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(0)} KB/s`;
  return `${bps} B/s`;
}

function MiniGauge({ percent, color }: { percent: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#1e1e1e" strokeWidth="6" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="36" y="40" textAnchor="middle" fill="#ededed" fontSize="13" fontWeight="600">
        {Math.round(percent)}%
      </text>
    </svg>
  );
}

function BarGauge({ percent, color, label }: { percent: number; color: string; label: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary font-medium">{Math.round(percent)}%</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(percent, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Skeleton({ h = 4, w = "full" }: { h?: number; w?: string }) {
  return (
    <div
      className={`bg-secondary rounded w-${w} animate-pulse`}
      style={{ height: `${h * 4}px` }}
    />
  );
}

export default function InfrastructurePage() {
  const system = useOrbitStore((s) => s.system);
  const connected = useOrbitStore((s) => s.connected);
  const systemHistory = useOrbitStore((s) => s.systemHistory);

  const noData = !system;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Infrastructure</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time host metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-xs text-text-secondary">{connected ? "Live" : "Disconnected"}</span>
        </div>
      </div>

      {/* Offline state */}
      {!connected && noData && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-3">⚡</div>
          <p className="text-text-primary font-medium">No connection to backend</p>
          <p className="text-text-secondary text-sm mt-1">Make sure the Orbit backend is running on port 8000</p>
        </div>
      )}

      {/* Gauges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2">
          {noData ? <Skeleton h={18} w="18" /> : <MiniGauge percent={system.cpu_percent} color="#a78bfa" />}
          <p className="text-xs text-text-secondary font-medium">CPU</p>
          {system && <p className="text-[11px] text-text-muted">{system.cpu_count} cores · {system.cpu_freq_mhz ? `${system.cpu_freq_mhz} MHz` : "—"}</p>}
        </div>
        {/* RAM */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2">
          {noData ? <Skeleton h={18} w="18" /> : <MiniGauge percent={system.memory_percent} color="#22c55e" />}
          <p className="text-xs text-text-secondary font-medium">Memory</p>
          {system && <p className="text-[11px] text-text-muted">{fmtBytes(system.memory_used)} / {fmtBytes(system.memory_total)}</p>}
        </div>
        {/* Disk */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2">
          {noData ? <Skeleton h={18} w="18" /> : <MiniGauge percent={system.disk_percent} color="#f59e0b" />}
          <p className="text-xs text-text-secondary font-medium">Disk</p>
          {system && <p className="text-[11px] text-text-muted">{fmtBytes(system.disk_used)} / {fmtBytes(system.disk_total)}</p>}
        </div>
        {/* Network */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-2">
          <div className="text-2xl font-bold text-text-primary">
            {noData ? "—" : fmtBps(system.network_rx_bps + system.network_tx_bps)}
          </div>
          <p className="text-xs text-text-secondary font-medium">Network</p>
          {system && (
            <div className="text-[11px] text-text-muted text-center">
              <span className="text-green-400">↓ {fmtBps(system.network_rx_bps)}</span>
              {" / "}
              <span className="text-purple-400">↑ {fmtBps(system.network_tx_bps)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Host Info + Per-Core */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Host Info */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-secondary mb-4">Host Information</h2>
          {noData ? (
            <div className="space-y-3"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>
          ) : (
            <div className="space-y-3">
              {[
                ["Hostname", system.hostname || "—"],
                ["OS", system.os_platform || "—"],
                ["Uptime", system.uptime_str || "—"],
                ["Load Avg", system.load_1m != null ? `${system.load_1m} / ${system.load_5m} / ${system.load_15m}` : "N/A (Windows)"],
                ["Total RAM", fmtBytes(system.memory_total)],
                ["Total Disk", fmtBytes(system.disk_total)],
                ["Network RX Total", fmtBytes(system.network_rx)],
                ["Network TX Total", fmtBytes(system.network_tx)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-text-secondary">{label}</span>
                  <span className="text-text-primary font-medium">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Per-Core CPU */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-medium text-text-secondary mb-4">CPU Per Core</h2>
          {noData ? (
            <div className="space-y-3"><Skeleton /><Skeleton /><Skeleton /><Skeleton /></div>
          ) : system.cpu_per_core.length === 0 ? (
            <p className="text-text-muted text-sm">Per-core data unavailable</p>
          ) : (
            <div className="space-y-2.5">
              {system.cpu_per_core.map((pct, i) => (
                <BarGauge key={i} label={`Core ${i}`} percent={pct}
                  color={pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#a78bfa"}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CPU History Sparkline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          CPU History <span className="text-text-muted font-normal">(last {systemHistory.length} samples)</span>
        </h2>
        {systemHistory.length < 2 ? (
          <div className="h-20 flex items-center justify-center text-text-muted text-sm">
            Collecting data…
          </div>
        ) : (
          <svg width="100%" height="80" preserveAspectRatio="none" viewBox={`0 0 ${systemHistory.length} 100`}>
            <polyline
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.5"
              points={systemHistory.map((s, i) => `${i},${100 - s.cpu_percent}`).join(" ")}
            />
            <polyline
              fill="url(#grad)"
              stroke="none"
              points={`0,100 ${systemHistory.map((s, i) => `${i},${100 - s.cpu_percent}`).join(" ")} ${systemHistory.length - 1},100`}
              opacity="0.15"
            />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    </div>
  );
}
