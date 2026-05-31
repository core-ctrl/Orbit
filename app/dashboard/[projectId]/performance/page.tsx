"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useOrbitStore } from "@/store/orbitStore";
import { Badge } from "@/components/ui/badge";
import { Activity, RefreshCw, Plus, Clock, Cpu, Heart, CheckCircle2, Zap } from "lucide-react";
import { api, ingest } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

function fmtBytes(b: number): string {
  if (b >= 1e9) return `${(b / 1e9).toFixed(1)} GB`;
  if (b >= 1e6) return `${(b / 1e6).toFixed(0)} MB`;
  return `${b} B`;
}

function fmtBps(bps: number): string {
  if (bps >= 1e6) return `${(bps / 1e6).toFixed(1)} MB/s`;
  if (bps >= 1e3) return `${(bps / 1e3).toFixed(0)} KB/s`;
  return `${bps} B/s`;
}

export default function PerformancePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  
  // Tab State
  const [perfTab, setPerfTab] = useState<"system" | "apm">("system");

  // System States (Zustand store)
  const system = useOrbitStore((s) => s.system);
  const systemHistory = useOrbitStore((s) => s.systemHistory);
  const endpoints = useOrbitStore((s) => s.endpoints);
  const connected = useOrbitStore((s) => s.connected);

  const cpuHistory = systemHistory.map((s) => s.cpu_percent);
  const ramHistory = systemHistory.map((s) => s.memory_percent);

  // APM States (Piece 11)
  const [apmStats, setApmStats] = useState<any>({
    apdex: 1.0,
    avg_duration_ms: 0.0,
    throughput_rpm: 0.0,
    error_rate: 0.0,
    slowest: [],
    web_vitals_avg: { lcp: 0.0, fid: 0.0, cls: 0.0 }
  });
  const [loadingApm, setLoadingApm] = useState(false);

  const fetchApmStats = useCallback(async () => {
    setLoadingApm(true);
    try {
      const data = await api.apm(projectId);
      setApmStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApm(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (perfTab === "apm") {
      fetchApmStats();
    }
  }, [perfTab, projectId]);

  // Insert mock APM Transaction
  const handleSimulateTrace = async () => {
    try {
      const project = await api.project(projectId);
      const dsn_key = project.dsn_key;

      const endpoints_list = [
        "GET /api/v1/users",
        "POST /api/v1/checkout",
        "GET /api/v1/products",
        "GET /api/v1/issues"
      ];
      const randomName = endpoints_list[Math.floor(Math.random() * endpoints_list.length)];
      const randomDuration = Math.random() * 800 + 50;
      const randomStatus = Math.random() > 0.05 ? 200 : 500;
      
      await ingest.performance(dsn_key, {
        name: randomName,
        type: "request",
        duration_ms: randomDuration,
        status_code: randomStatus,
        web_vitals: {
          lcp: Math.random() * 2.5 + 0.5,
          fid: Math.random() * 100,
          cls: Math.random() * 0.15
        }
      });

      if (perfTab === "apm") {
        fetchApmStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getApdexColor = (score: number) => {
    if (score >= 0.94) return "text-green-400";
    if (score >= 0.70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Performance Monitoring</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time application tracing metrics, Web Vitals, and node statistics</p>
        </div>
        <div className="flex gap-2">
          {perfTab === "apm" && (
            <>
              <button
                onClick={handleSimulateTrace}
                className="bg-secondary hover:bg-hover border border-border text-text-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Simulate Trace
              </button>
              <button
                onClick={fetchApmStats}
                className="bg-secondary hover:bg-hover border border-border text-text-primary p-2.5 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </>
          )}
          <div className="flex bg-secondary border border-border p-1 rounded-xl">
            <button
              onClick={() => setPerfTab("system")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${perfTab === "system" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              Host System
            </button>
            <button
              onClick={() => setPerfTab("apm")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${perfTab === "apm" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              Application APM
            </button>
          </div>
        </div>
      </div>

      {perfTab === "system" ? (
        // HOST SYSTEM METRICS VIEW (Original)
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">CPU Usage</p>
              <p className="text-2xl font-bold text-text-primary">{system ? `${system.cpu_percent.toFixed(1)}%` : "—"}</p>
              <p className="text-xs text-text-muted mt-1">{system ? `${system.cpu_count} cores` : "Waiting"}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Memory Usage</p>
              <p className="text-2xl font-bold text-text-primary">{system ? `${system.memory_percent.toFixed(1)}%` : "—"}</p>
              <p className="text-xs text-text-muted mt-1">{system ? `${fmtBytes(system.memory_used)} used` : "Waiting"}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Endpoints</p>
              <p className="text-2xl font-bold text-text-primary">{endpoints.length}</p>
              <p className="text-xs text-text-muted mt-1">{endpoints.filter(e => e.status === "up").length} operational</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Network Throughput</p>
              <p className="text-2xl font-bold text-text-primary">{system ? fmtBps(system.network_rx_bps + system.network_tx_bps) : "—"}</p>
              <p className="text-xs text-text-muted mt-1">↓ {system ? fmtBps(system.network_rx_bps) : "0"} ↑ {system ? fmtBps(system.network_tx_bps) : "0"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-1.5"><Cpu className="w-4 h-4" /> CPU Utilization</h2>
              <div className="h-16 flex items-end gap-0.5 bg-secondary/10 p-2 rounded border border-border/50">
                {cpuHistory.map((val, i) => (
                  <div key={i} className="flex-1 bg-accent rounded-t" style={{ height: `${val}%`, minHeight: "2px" }} />
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-1.5"><Clock className="w-4 h-4" /> RAM Utilization</h2>
              <div className="h-16 flex items-end gap-0.5 bg-secondary/10 p-2 rounded border border-border/50">
                {ramHistory.map((val, i) => (
                  <div key={i} className="flex-1 bg-green-500 rounded-t" style={{ height: `${val}%`, minHeight: "2px" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // APPLICATION APM VIEW (Piece 11)
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Apdex Index</p>
              <p className={`text-2xl font-bold ${getApdexColor(apmStats.apdex)}`}>{apmStats.apdex.toFixed(2)}</p>
              <p className="text-xs text-text-muted mt-1">Satisfaction score (T=300ms)</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold text-text-primary">{apmStats.avg_duration_ms.toFixed(1)} ms</p>
              <p className="text-xs text-text-muted mt-1">Through query transaction logs</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Throughput</p>
              <p className="text-2xl font-bold text-accent">{apmStats.throughput_rpm.toFixed(1)} RPM</p>
              <p className="text-xs text-text-muted mt-1">Requests per minute (10m window)</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs text-text-secondary mb-1">Transaction Error Rate</p>
              <p className={`text-2xl font-bold ${apmStats.error_rate > 0 ? "text-red-400" : "text-text-primary"}`}>{(apmStats.error_rate * 100).toFixed(1)}%</p>
              <p className="text-xs text-text-muted mt-1">HTTP 500 status rates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slowest Endpoints Table */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border bg-secondary/20">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" /> Slowest HTTP Transactions
                </h3>
              </div>
              <div className="divide-y divide-border">
                {apmStats.slowest.length === 0 ? (
                  <EmptyState 
                    icon={Zap}
                    title="No slow transactions"
                    description="All transactions are performing well."
                  />
                ) : (
                  apmStats.slowest.map((tx: any) => (
                    <div key={tx.name} className="px-5 py-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-medium text-text-primary">{tx.name}</span>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-danger">{tx.avg_duration_ms.toFixed(0)} ms</span>
                        <span className="text-[10px] text-text-muted block">across {tx.count} calls</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Web Vitals Card */}
            <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Web Vitals (Average)
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">LCP (Largest Contentful Paint)</span>
                    <span className="font-mono font-semibold text-text-primary">{apmStats.web_vitals_avg.lcp.toFixed(2)}s</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min((apmStats.web_vitals_avg.lcp / 4.0) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">FID (First Input Delay)</span>
                    <span className="font-mono font-semibold text-text-primary">{apmStats.web_vitals_avg.fid.toFixed(0)}ms</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min((apmStats.web_vitals_avg.fid / 150.0) * 100, 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-secondary">CLS (Cumulative Layout Shift)</span>
                    <span className="font-mono font-semibold text-text-primary">{apmStats.web_vitals_avg.cls.toFixed(3)}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((apmStats.web_vitals_avg.cls / 0.25) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
