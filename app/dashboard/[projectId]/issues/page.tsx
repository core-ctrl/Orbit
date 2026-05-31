"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bug, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { api } from "@/lib/api";
import type { Issue } from "@/types/orbit";

export default function IssuesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("unresolved");
  const [search, setSearch] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const fetchIssues = useCallback(async () => {
    try {
      const data = await api.issues(projectId, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search || undefined,
      });
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, statusFilter, search]);

  useEffect(() => {
    setLoading(true);
    fetchIssues();
  }, [fetchIssues]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => fetchIssues(), 300);
    return () => clearTimeout(timer);
  }, [search, fetchIssues]);

  const levelVariant = (level: string) => {
    switch (level) {
      case "error": return "danger" as const;
      case "warning": return "warning" as const;
      case "info": return "info" as const;
      default: return "default" as const;
    }
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "resolved": return "success" as const;
      case "ignored": return "warning" as const;
      default: return "default" as const;
    }
  };

  const toggleSelectAll = () => {
    if (selectedIssues.size === issues.length) {
      setSelectedIssues(new Set());
    } else {
      setSelectedIssues(new Set(issues.map(i => i.id)));
    }
  };

  const toggleIssueSelect = (id: string) => {
    const newSet = new Set(selectedIssues);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIssues(newSet);
  };

  const handleBulkAction = async (status: string) => {
    if (selectedIssues.size === 0) return;
    setBulkActionLoading(true);
    try {
      await api.bulkUpdateIssues(projectId, Array.from(selectedIssues), status);
      await fetchIssues();
      setSelectedIssues(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Issues</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {issues.length} issue{issues.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="glass-input px-3 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
            <option value="ignored">Ignored</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search issues..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-9 pr-3 py-1.5 text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIssues.size > 0 && (
        <div className="bg-card border border-accent/50 rounded-xl p-3 flex items-center justify-between shadow-glow animate-fade-in">
          <span className="text-sm font-semibold text-text-primary px-2">
            {selectedIssues.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction("resolved")}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-success/10 hover:bg-success/20 text-success rounded-lg text-sm font-medium transition-colors"
            >
              Resolve Selected
            </button>
            <button
              onClick={() => handleBulkAction("ignored")}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-warning/10 hover:bg-warning/20 text-warning rounded-lg text-sm font-medium transition-colors"
            >
              Ignore Selected
            </button>
            <button
              onClick={() => handleBulkAction("unresolved")}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-secondary hover:bg-hover text-text-primary rounded-lg text-sm font-medium transition-colors"
            >
              Mark Unresolved
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <ListSkeleton items={5} />
      ) : issues.length === 0 ? (
        <EmptyState
          icon={Bug}
          title={search ? "No matches found" : "Waiting for your first issue..."}
          description={search ? "Try adjusting your search or filters." : "Install the Orbit SDK in your application to start capturing errors automatically."}
          action={search ? { label: "Clear search", onClick: () => { setSearch(""); setStatusFilter("all"); } } : undefined}
        >
          {!search && (
            <div className="bg-bg-primary border border-[var(--glass-border)] rounded-xl overflow-hidden mt-2">
              <div className="bg-[var(--glass-bg-hover)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] border-b border-[var(--glass-border)] flex items-center justify-between">
                <span>Next.js Integration</span>
                <span className="text-xs font-mono text-[var(--accent)]">npm install @orbitapp/nextjs</span>
              </div>
              <pre className="p-4 text-xs font-mono text-[var(--text-primary)] overflow-x-auto">
                <code className="block text-[#C586C0]">import <span className="text-[#9CDCFE]">{'{'}</span> init <span className="text-[#9CDCFE]">{'}'}</span> from <span className="text-[#CE9178]">'@orbitapp/nextjs'</span>;</code>
                <code className="block mt-2"><span className="text-[#DCDCAA]">init</span>({'{'}</code>
                <code className="block pl-4 text-[#9CDCFE]">dsn: <span className="text-[#CE9178]">'YOUR_DSN_KEY'</span>,</code>
                <code className="block pl-4 text-[#9CDCFE]">environment: <span className="text-[#CE9178]">'production'</span></code>
                <code className="block">{'}'});</code>
              </pre>
            </div>
          )}
        </EmptyState>
      ) : (
        <div className="glass-card-static overflow-hidden">
          <div className="bg-secondary/20 px-4 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
            <input 
              type="checkbox" 
              checked={selectedIssues.size === issues.length && issues.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20 cursor-pointer bg-card" 
            />
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Select All</span>
          </div>
          <div className="divide-y divide-[var(--glass-border)]">
            {issues.map((issue, i) => (
              <div
                key={issue.id}
                className={`flex items-center p-4 hover:bg-[var(--glass-bg-hover)] transition-all group ${selectedIssues.has(issue.id) ? 'bg-[var(--glass-bg-elevated)]' : ''}`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <input
                  type="checkbox"
                  checked={selectedIssues.has(issue.id)}
                  onChange={() => toggleIssueSelect(issue.id)}
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20 cursor-pointer bg-card mr-4 shrink-0"
                />
                {/* Level indicator */}
                <div className={`w-1 h-10 rounded-full mr-4 shrink-0 ${
                  issue.level === 'error' ? 'bg-[var(--danger)]' : 
                  issue.level === 'warning' ? 'bg-[var(--warning)]' : 'bg-[var(--info)]'
                }`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={levelVariant(issue.level)}>{issue.type}</Badge>
                    <Link href={`/dashboard/${projectId}/issues/${issue.id}`} className="font-medium text-[var(--text-primary)] truncate hover:text-[var(--accent)] transition-colors">
                      {issue.title}
                    </Link>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] truncate">
                    {issue.culprit}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {issue.times_seen} events
                    </span>
                    <span>·</span>
                    <span>{issue.users_affected} users</span>
                    <span>·</span>
                    <span>{formatDistanceToNow(new Date(issue.last_seen), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <Badge variant={statusVariant(issue.status)}>{issue.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
