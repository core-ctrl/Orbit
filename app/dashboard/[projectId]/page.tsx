"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle, Activity, Users, ArrowUpRight,
  CheckCircle2, Package, Zap, Bug
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { StatusDot } from "@/components/ui/status-dot";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCardSkeleton, ListSkeleton } from "@/components/ui/loading-skeleton";
import { api } from "@/lib/api";
import type { Issue } from "@/types/orbit";

export default function OverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [stats, setStats] = useState({ events: 0, issues: 0, users: 0 });
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const issues = await api.issues(projectId);
        setRecentIssues(issues.slice(0, 5));
        setStats({
          events: issues.reduce((acc, i) => acc + (i.times_seen || 0), 0),
          issues: issues.filter(i => i.status === "unresolved").length,
          users: issues.reduce((acc, i) => acc + (i.users_affected || 0), 0),
        });
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [projectId]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Overview</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Project health at a glance</p>
        </div>
        <div className="flex items-center gap-2 glass-card-static px-3 py-1.5">
          <StatusDot status="up" pulse />
          <span className="text-sm font-medium text-[var(--text-secondary)]">Active</span>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
          <GlassCard glow className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Total Events</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-[var(--accent)]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stats.events.toLocaleString()}</div>
            <p className="text-xs text-[var(--text-secondary)]">
              {stats.issues > 0 ? `Across ${stats.issues} issue${stats.issues !== 1 ? "s" : ""}` : "No events yet"}
            </p>
          </GlassCard>

          <GlassCard glow className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Open Issues</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stats.issues > 0 ? 'bg-[var(--danger)]/10' : 'bg-[var(--success)]/10'}`}>
                <Bug className={`w-4 h-4 ${stats.issues > 0 ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`} />
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stats.issues.toLocaleString()}</div>
            <p className="text-xs text-[var(--text-secondary)]">
              {stats.issues === 0 ? "All clear ✓" : "Unresolved"}
            </p>
          </GlassCard>

          <GlassCard glow className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Users Affected</span>
              <div className="w-8 h-8 rounded-lg bg-[var(--warning)]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[var(--warning)]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{stats.users.toLocaleString()}</div>
            <p className="text-xs text-[var(--text-secondary)]">
              {stats.users === 0 ? "No users impacted" : "Across all issues"}
            </p>
          </GlassCard>
        </div>
      )}

      {/* Activity Chart */}
      <GlassCard static>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-[var(--text-secondary)]">Activity (Last 7 Days)</h2>
          <select className="glass-input px-2 py-1 text-xs">
            <option>7 days</option>
            <option>14 days</option>
            <option>30 days</option>
          </select>
        </div>
        <div className="h-48 flex items-center justify-center text-[var(--text-muted)] border-t border-[var(--glass-border)] mt-4">
          <div className="text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Waiting for events...</p>
          </div>
        </div>
      </GlassCard>

      {/* Two column: Recent Issues + Quick Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Recent Issues</h2>
            <Link
              href={`/dashboard/${projectId}/issues`}
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
            >
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <ListSkeleton items={3} />
          ) : (
            <GlassCard static noPadding className="overflow-hidden">
              {recentIssues.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)]">
                  <Bug className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No issues yet. Install the SDK to get started.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--glass-border)]">
                  {recentIssues.map((issue) => (
                    <Link
                      key={issue.id}
                      href={`/dashboard/${projectId}/issues/${issue.id}`}
                      className="flex items-center justify-between p-4 hover:bg-[var(--glass-bg-hover)] transition-all group"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={issue.level === "error" ? "danger" : "warning"}>{issue.type}</Badge>
                          <span className="font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                            {issue.title}
                          </span>
                        </div>
                        <div className="text-sm text-[var(--text-secondary)] truncate max-w-md">{issue.culprit}</div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <div className="text-sm font-medium text-[var(--text-primary)]">{issue.times_seen} events</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {formatDistanceToNow(new Date(issue.last_seen), { addSuffix: true })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Quick Setup Guide */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[var(--text-primary)]">Quick Setup</h2>
          <GlassCard static>
            <div className="space-y-5">
              {/* Step 1 - Done */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[var(--success)]/15 text-[var(--success)] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Create Project</div>
                  <div className="text-xs text-[var(--text-muted)]">Project ready ✓</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full glass-card-elevated flex items-center justify-center shrink-0 text-xs font-medium text-[var(--text-secondary)]">
                  2
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Install SDK</div>
                  <div className="text-xs text-[var(--text-muted)] mb-2">Add Orbit to your app</div>
                  <code className="text-xs glass-input px-2 py-1 inline-block font-mono">
                    npm install @orbit/nextjs
                  </code>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 opacity-50">
                <div className="w-7 h-7 rounded-full glass-card-elevated flex items-center justify-center shrink-0 text-xs font-medium text-[var(--text-secondary)]">
                  3
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Send First Event</div>
                  <div className="text-xs text-[var(--text-muted)]">
                    <Zap className="w-3 h-3 inline mr-1" />
                    Waiting for data...
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
