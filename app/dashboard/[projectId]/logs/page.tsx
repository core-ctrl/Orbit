"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useOrbitStore } from "@/store/orbitStore";
import { formatDistanceToNow } from "date-fns";
import { FileText, RefreshCw, Terminal, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { api, ingest } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { AppLog } from "@/types/orbit";

export default function LogsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const liveLogs = useOrbitStore((s) => s.logs);
  const connected = useOrbitStore((s) => s.connected);

  const [activeTab, setActiveTab] = useState<"live" | "sdk">("live");
  const [sdkLogs, setSdkLogs] = useState<AppLog[]>([]);
  const [loadingSdk, setLoadingSdk] = useState(false);

  // Filters
  const [levelFilter, setLevelFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchSdkLogs = useCallback(async () => {
    setLoadingSdk(true);
    try {
      const data = await api.logs(projectId, {
        level: levelFilter || undefined,
        source: sourceFilter || undefined,
        search: searchQuery || undefined,
        limit: 100,
      });
      setSdkLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSdk(false);
    }
  }, [projectId, levelFilter, sourceFilter, searchQuery]);

  useEffect(() => {
    if (activeTab === "sdk") {
      fetchSdkLogs();
    }
  }, [activeTab, levelFilter, sourceFilter, projectId]);

  // Insert mock log to test persistent logs
  const handleInsertMockLog = async () => {
    try {
      const project = await api.project(projectId);
      const dsn_key = project.dsn_key;
      
      const levels = ["info", "warn", "error", "debug"];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const sources = ["nextjs", "django", "express"];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      
      await ingest.logs(dsn_key, {
        level: randomLevel,
        source: randomSource,
        message: `Sample application log message describing an operation state. Code status: ${Math.floor(Math.random() * 500)}`
      });

      if (activeTab === "sdk") {
        fetchSdkLogs();
      }
    } catch (e) {
      console.error(e);
    }
  };

  function levelColor(msg: string) {
    const m = msg.toLowerCase();
    if (m.includes("error") || m.includes("critical") || m.includes("die") || m.includes("oom") || m === "error" || m === "critical")
      return "text-red-400";
    if (m.includes("warn") || m === "warn" || m === "warning") return "text-yellow-400";
    if (m.includes("info") || m === "info") return "text-blue-400";
    return "text-text-secondary";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Log Explorer</h1>
          <p className="text-text-secondary text-sm mt-1">Explore container logs or persistent application logs collected from SDKs</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "sdk" && (
            <button
              onClick={handleInsertMockLog}
              className="bg-secondary hover:bg-hover border border-border text-text-primary px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Mock Log
            </button>
          )}
          <div className="flex bg-secondary border border-border p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("live")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "live" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              Live Docker
            </button>
            <button
              onClick={() => setActiveTab("sdk")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === "sdk" ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary"}`}
            >
              SDK Application
            </button>
          </div>
        </div>
      </div>

      {activeTab === "live" ? (
        // Live Docker Logs stream (original stream view)
        <div className="bg-card border border-border rounded-xl overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
            <span className="text-text-muted flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Live container event stream</span>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-[10px] text-text-muted">{connected ? "Streaming" : "Disconnected"}</span>
            </div>
          </div>

          <div className="h-[560px] overflow-y-auto p-4 space-y-1">
            {!connected && liveLogs.length === 0 ? (
              <p className="text-red-400 text-center py-10">Backend not connected — start the Orbit backend on port 8000</p>
            ) : liveLogs.length === 0 ? (
              <p className="text-text-muted text-center py-10">
                Waiting for events… Docker container events will appear here automatically.
              </p>
            ) : (
              [...liveLogs].reverse().map((log, i) => (
                <div key={i} className="flex gap-3 py-0.5 hover:bg-secondary/30 px-1 rounded">
                  <span className="text-text-muted shrink-0 w-20 truncate">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-accent/70 shrink-0 w-24 truncate">[{log.source}]</span>
                  <span className={levelColor(log.message)}>{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        // Persistent SDK Logs (Piece 10)
        <div className="space-y-4">
          {/* Query Filters */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <span className="absolute left-3 top-2.5 text-text-muted"><Search className="w-4 h-4" /></span>
              <input
                type="text"
                placeholder="Search log messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchSdkLogs()}
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none"
              >
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>

              <input
                type="text"
                placeholder="Source (e.g. nextjs)"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none w-36"
              />
              
              <button
                onClick={fetchSdkLogs}
                className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-glow"
              >
                <RefreshCw className="w-4 h-4" /> Query
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden font-mono text-xs">
            {loadingSdk ? (
              <div className="p-8"><ListSkeleton items={5} /></div>
            ) : sdkLogs.length === 0 ? (
              <div className="p-8">
                <EmptyState 
                  icon={FileText}
                  title="No logs found"
                  description="No logs matching your query. Ensure your application is sending logs via the SDK."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30 text-text-secondary text-[10px] uppercase tracking-wider text-left">
                      <th className="p-3 w-32">Timestamp</th>
                      <th className="p-3 w-24">Level</th>
                      <th className="p-3 w-32">Source</th>
                      <th className="p-3">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sdkLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3 text-text-muted truncate">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-3">
                          <span className={`font-semibold uppercase ${levelColor(log.level)}`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="p-3 text-accent/80 truncate">
                          {log.source}
                        </td>
                        <td className="p-3 text-text-primary break-all">
                          {log.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
