"use client";

import { useEffect, useState, useCallback, use } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Plus, RefreshCw, Layers } from "lucide-react";
import { api, ingest } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { CustomMetric } from "@/types/orbit";

export default function MetricsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [metrics, setMetrics] = useState<CustomMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [type, setType] = useState("counter");

  const fetchMetrics = useCallback(async () => {
    try {
      const data = await api.metrics(projectId);
      setMetrics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMetrics();
  }, [projectId]);

  const handleIngestMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value === "") return;
    try {
      const project = await api.project(projectId);
      await ingest.metrics(project.dsn_key, { name, value: Number(value), type });
      setIsModalOpen(false);
      setName("");
      setValue("");
      setType("counter");
      fetchMetrics();
    } catch (e) {
      console.error(e);
    }
  };

  // Group metrics by name
  const groupedMetrics = metrics.reduce((acc: any, m: any) => {
    if (!acc[m.name]) {
      acc[m.name] = [];
    }
    acc[m.name].push(m);
    return acc;
  }, {});

  const renderSparkline = (metricList: any[]) => {
    const sorted = [...metricList].reverse(); // oldest to newest
    if (sorted.length < 2) return <div className="h-16 flex items-center justify-center text-text-muted text-xs">Waiting for more points...</div>;
    
    const values = sorted.map(s => s.value);
    const min = Math.min(...values);
    const max = Math.max(...values, min + 1);
    
    const pts = sorted.map((item, i) => {
      const x = (i / (sorted.length - 1)) * 100;
      const y = 90 - ((item.value - min) / (max - min)) * 80;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-full h-16 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline fill="none" stroke="#7c3aed" strokeWidth="2.5" points={pts} />
      </svg>
    );
  };

  if (loading) {
    return <div className="space-y-6"><ListSkeleton items={3} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Custom Metrics</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time instrumentation counters, gauges, and timers reported by client SDKs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchMetrics}
            className="bg-secondary hover:bg-hover border border-border text-text-primary p-2.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" /> Ingest Metric
          </button>
        </div>
      </div>

      {Object.keys(groupedMetrics).length === 0 ? (
        <EmptyState 
          icon={BarChart3}
          title="No custom metrics"
          description="Send metrics via the ingest API to see dashboards appear here automatically."
        >
          <div className="bg-bg-primary border border-[var(--glass-border)] rounded-xl overflow-hidden mt-2">
            <div className="bg-[var(--glass-bg-hover)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--glass-border)] flex items-center justify-between">
              <span>cURL Integration</span>
              <span className="text-xs font-mono text-[var(--accent)]">POST /api/v1/metrics</span>
            </div>
            <pre className="p-4 text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
              <code className="block text-[#DCDCAA]">curl -X POST <span className="text-[#CE9178]">{process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/metrics/YOUR_DSN_KEY</span> \</code>
              <code className="block pl-4">-H <span className="text-[#CE9178]">"Content-Type: application/json"</span> \</code>
              <code className="block pl-4">-d <span className="text-[#CE9178]">'&#123;"name": "sales", "value": 100, "type": "counter"&#125;'</span></code>
            </pre>
          </div>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(groupedMetrics).map(([metricName, items]: [string, any]) => {
            const latest = items[0];
            const avg = items.reduce((sum: number, item: any) => sum + item.value, 0) / items.length;
            const peak = Math.max(...items.map((i: any) => i.value));
            
            return (
              <div key={metricName} className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary truncate">{metricName}</p>
                    <div className="flex gap-1.5 mt-1">
                      <Badge className="bg-secondary text-text-secondary border border-border text-[10px] uppercase font-bold tracking-wider">{latest.type}</Badge>
                      <span className="text-xs text-text-muted">Updated {formatDistanceToNow(new Date(latest.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{latest.value.toLocaleString()}</p>
                    <p className="text-[10px] text-text-muted uppercase font-semibold">Latest Value</p>
                  </div>
                </div>

                {/* Graph */}
                <div className="bg-secondary/20 border border-border/50 rounded-lg p-3">
                  {renderSparkline(items)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/50 pt-3">
                  <div>
                    <span className="text-text-muted">Avg:</span> <span className="font-medium text-text-primary">{avg.toFixed(1)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-text-muted">Peak:</span> <span className="font-medium text-text-primary">{peak.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Ingest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl relative">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><Layers className="text-accent w-5 h-5" /> Ingest Metric Point</h2>
            <form onSubmit={handleIngestMetric} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Metric Name</label>
                <input
                  type="text"
                  placeholder="e.g. checkout_flow_duration_ms"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 150"
                    value={value}
                    onChange={(e) => setValue(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary outline-none"
                  >
                    <option value="counter">Counter</option>
                    <option value="gauge">Gauge</option>
                    <option value="histogram">Histogram</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-hover border border-border text-text-primary hover:bg-hover/80 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
