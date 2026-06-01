"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Terminal, FileText, Check } from "lucide-react";
import { api } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/loading-skeleton";
import type { Issue, ErrorEvent, StackFrame } from "@/types/orbit";

export default function IssueDetailPage({ params }: { params: Promise<{ projectId: string, issueId: string }> }) {
  const { projectId, issueId } = use(params);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [events, setEvents] = useState<ErrorEvent[]>([]);
  const [activeTab, setActiveTab] = useState<"stack" | "breadcrumbs" | "context" | "events" | "ai">("stack");
  
  // AI Insights states
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightProvider, setInsightProvider] = useState("");
  
  // Phase 3: Auto-Heal states
  const [showHealModal, setShowHealModal] = useState(false);
  const [healing, setHealing] = useState(false);
  const [healResult, setHealResult] = useState<{ patch: string; pr_url: string; message: string } | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const [issueData, eventsData] = await Promise.all([
          api.issue(projectId, issueId),
          api.issueEvents(projectId, issueId),
        ]);
        setIssue(issueData);
        setEvents(eventsData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchIssue();
  }, [projectId, issueId]);

  const fetchAiInsights = async () => {
    if (insight) return;
    setLoadingInsight(true);
    try {
      const data = await api.issueAiInsights(projectId, issueId);
      setInsight((data as Record<string, string>).insight || (data as Record<string, string>).analysis);
      setInsightProvider((data as Record<string, string>).provider || "AI");
    } catch (e) {
      console.error(e);
      setInsight("Failed to fetch AI insights. Check backend connectivity.");
    } finally {
      setLoadingInsight(false);
    }
  };

  useEffect(() => {
    if (activeTab === "ai") {
      fetchAiInsights();
    }
  }, [activeTab]);

  const handleSelfHeal = async () => {
    setHealing(true);
    try {
      const res = await api.healIssue(projectId, issueId);
      if (res.status === "success") {
        setHealResult({
          patch: res.patch,
          pr_url: res.pr.pr_url,
          message: res.pr.message
        });
      }
    } catch (e) {
      console.error(e);
      alert("Failed to self-heal issue.");
    } finally {
      setHealing(false);
    }
  };

  if (!issue) return <PageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl">
      <Link href={`/dashboard/${projectId}/issues`} className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
        ← Back to issues
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="danger">{issue.type}</Badge>
          <Badge className="bg-secondary border border-border text-text-primary">{issue.status.toUpperCase()}</Badge>
        </div>
        <h1 className="text-xl font-semibold text-text-primary break-words">{issue.title}</h1>
        <div className="text-sm text-text-secondary mt-1">{issue.culprit}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="text-xs text-text-muted mb-1">First seen</div>
          <div className="text-sm font-medium">{formatDistanceToNow(new Date(issue.first_seen), { addSuffix: true })}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="text-xs text-text-muted mb-1">Last seen</div>
          <div className="text-sm font-medium">{formatDistanceToNow(new Date(issue.last_seen), { addSuffix: true })}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="text-xs text-text-muted mb-1">Times seen</div>
          <div className="text-sm font-medium">{issue.times_seen}</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-xl">
          <div className="text-xs text-text-muted mb-1">Users affected</div>
          <div className="text-sm font-medium">{issue.users_affected}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Tab selection headers */}
        <div className="flex items-center border-b border-border bg-secondary/30 px-2 overflow-x-auto whitespace-nowrap scrollbar">
          <button
            onClick={() => setActiveTab("stack")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "stack" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <Terminal className="w-3.5 h-3.5" /> Stack Trace
          </button>
          <button
            onClick={() => setActiveTab("breadcrumbs")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "breadcrumbs" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Breadcrumbs
          </button>
          <button
            onClick={() => setActiveTab("context")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "context" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <FileText className="w-3.5 h-3.5" /> Context
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "events" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <FileText className="w-3.5 h-3.5" /> Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === "ai" ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary"}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> AI Root Cause
          </button>
        </div>
        
        <div className="p-0">
          {activeTab === "stack" && (
            events[0]?.stack_trace ? (
              <div className="divide-y divide-border">
                {events[0].stack_trace.map((frame: StackFrame, idx: number) => (
                  <div key={idx} className="p-4 font-mono text-[12px] hover:bg-secondary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-text-secondary font-medium">{frame.filename || 'unknown'}</span>
                      <span className="text-text-muted">in</span>
                      <span className="text-accent font-semibold">{frame.function || '<anonymous>'}</span>
                      {frame.lineno && <span className="text-text-muted">at line {frame.lineno}</span>}
                    </div>
                    {frame.context_line && (
                      <div className="bg-secondary/40 rounded-lg p-3 text-text-primary overflow-x-auto border border-border">
                        {frame.pre_context?.map((l: string, i: number) => <div key={`pre-${i}`} className="opacity-40">{l}</div>)}
                        <div className="text-danger bg-danger/10 -mx-3 px-3 py-0.5 font-semibold">{frame.context_line}</div>
                        {frame.post_context?.map((l: string, i: number) => <div key={`post-${i}`} className="opacity-40">{l}</div>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-secondary">No stack trace available.</div>
            )
          )}

          {activeTab === "breadcrumbs" && (
            events[0]?.breadcrumbs && events[0].breadcrumbs.length > 0 ? (
              <div className="relative p-6">
                <div className="absolute left-8 top-6 bottom-6 w-px bg-border"></div>
                <div className="space-y-6 relative">
                  {events[0].breadcrumbs.map((crumb, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`w-4 h-4 rounded-full mt-1 border-2 border-bg-primary shrink-0 z-10 ${crumb.level === 'error' ? 'bg-danger' : crumb.level === 'warning' ? 'bg-warning' : 'bg-info'}`} />
                      <div className="flex-1 bg-secondary/30 border border-border rounded-lg p-3 text-xs">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-text-primary capitalize">{crumb.category}</span>
                          <span className="text-text-muted">{crumb.timestamp ? formatDistanceToNow(new Date(crumb.timestamp), { addSuffix: true }) : ''}</span>
                        </div>
                        <div className="text-text-secondary font-mono">{crumb.message || (crumb.data ? JSON.stringify(crumb.data) : '')}</div>
                      </div>
                    </div>
                  ))}
                  {/* The crash event */}
                  <div className="flex gap-4">
                    <div className="w-4 h-4 rounded-full mt-1 border-2 border-bg-primary bg-danger shrink-0 z-10 animate-pulse" />
                    <div className="flex-1 bg-danger/10 border border-danger/20 rounded-lg p-3 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-danger capitalize">Exception</span>
                        <span className="text-text-muted">Now</span>
                      </div>
                      <div className="text-danger font-mono font-semibold">{issue.title}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-text-secondary">No breadcrumbs tracked for this event. Upgrade your SDK to enable automatic breadcrumbs.</div>
            )
          )}

          {activeTab === "context" && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {events[0] && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">User Context</h3>
                    {events[0].user_id || events[0].user_email ? (
                      <div className="bg-secondary/20 border border-border rounded-lg p-3 text-xs space-y-2">
                        {events[0].user_id && <div><span className="text-text-muted w-20 inline-block">ID:</span> <span className="font-mono text-text-primary">{events[0].user_id}</span></div>}
                        {events[0].user_email && <div><span className="text-text-muted w-20 inline-block">Email:</span> <span className="font-mono text-text-primary">{events[0].user_email}</span></div>}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted italic">No user data associated.</div>
                    )}

                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 pt-4">Environment Details</h3>
                    <div className="bg-secondary/20 border border-border rounded-lg p-3 text-xs space-y-2">
                      <div><span className="text-text-muted w-24 inline-block">Platform:</span> <span className="text-text-primary capitalize">{events[0].platform || 'Unknown'}</span></div>
                      <div><span className="text-text-muted w-24 inline-block">Environment:</span> <span className="text-text-primary capitalize">{events[0].environment}</span></div>
                      {events[0].browser && <div><span className="text-text-muted w-24 inline-block">Browser:</span> <span className="text-text-primary">{events[0].browser}</span></div>}
                      {events[0].os && <div><span className="text-text-muted w-24 inline-block">OS:</span> <span className="text-text-primary">{events[0].os}</span></div>}
                      {events[0].url && <div><span className="text-text-muted w-24 inline-block">URL:</span> <a href={events[0].url} target="_blank" rel="noreferrer" className="text-accent hover:underline break-all">{events[0].url}</a></div>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2">Tags</h3>
                    {events[0].tags && Object.keys(events[0].tags).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(events[0].tags).map(([k, v]) => (
                          <Badge key={k} className="bg-secondary/50 text-text-primary border-border"><span className="text-text-muted mr-1">{k}:</span>{String(v)}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-text-muted italic">No custom tags.</div>
                    )}

                    <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-2 pt-4">Extra Context</h3>
                    {events[0].extra && Object.keys(events[0].extra).length > 0 ? (
                      <pre className="bg-secondary/20 border border-border rounded-lg p-3 text-xs font-mono text-text-primary overflow-x-auto">
                        {JSON.stringify(events[0].extra, null, 2)}
                      </pre>
                    ) : (
                      <div className="text-xs text-text-muted italic">No extra metadata.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "events" && (
            <div className="divide-y divide-border">
              {events.length === 0 ? (
                <div className="p-8 text-center text-text-secondary">No events logged yet.</div>
              ) : (
                events.map((ev, idx) => (
                  <div key={ev.id || idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-text-primary">{ev.message || "No error message"}</p>
                      <p className="text-text-muted mt-1">
                        Environment: <span className="text-text-secondary font-medium">{ev.environment}</span> · OS: <span className="text-text-secondary font-medium">{ev.os || "unknown"}</span> · Browser: <span className="text-text-secondary font-medium">{ev.browser || "unknown"}</span>
                      </p>
                    </div>
                    <span className="text-text-muted shrink-0">{formatDistanceToNow(new Date(ev.received_at), { addSuffix: true })}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "ai" && (
            <div className="p-6 space-y-4">
              {loadingInsight ? (
                <div className="py-8 text-center text-text-secondary flex flex-col items-center justify-center gap-2">
                  <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-text-muted">Analyzing stack traces...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {insightProvider && (
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-[10px] uppercase font-bold text-accent tracking-wider flex items-center gap-1"><Sparkles className="w-3 h-3" /> Orbit AI Engine</span>
                      <span className="text-[10px] text-text-muted">Generated by: {insightProvider}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-text-primary space-y-2">
                    {insight}
                  </div>
                  
                  {/* Self Heal Trigger */}
                  {!healResult && (
                    <div className="pt-4 border-t border-border mt-6">
                      <button 
                        onClick={() => setShowHealModal(true)}
                        className="bg-accent text-bg-primary font-bold text-sm px-6 py-3 rounded-full hover:bg-white transition flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" /> Self-Heal (Open PR)
                      </button>
                    </div>
                  )}

                  {/* Heal Result Display */}
                  {healResult && (
                    <div className="mt-8 border border-accent/30 bg-accent/5 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                          <Check className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">Orbit AI Generated Patch</h3>
                      </div>
                      <p className="text-sm text-text-secondary mb-4">{healResult.message}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-xs uppercase font-bold text-text-muted mb-2 tracking-wider">Git Diff</h4>
                        <pre className="bg-bg-primary border border-border rounded-lg p-4 text-xs font-mono text-text-primary overflow-x-auto">
                          {healResult.patch.split('\\n').map((line, i) => (
                            <div key={i} className={
                              line.startsWith('+') ? 'text-accent bg-accent/10 px-1 -mx-1' : 
                              line.startsWith('-') ? 'text-danger bg-danger/10 px-1 -mx-1' : ''
                            }>
                              {line}
                            </div>
                          ))}
                        </pre>
                      </div>
                      
                      <a 
                        href={healResult.pr_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-text-primary text-bg-primary font-bold text-sm px-5 py-2.5 rounded-full hover:bg-text-secondary transition"
                      >
                        Review Pull Request →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Permission Modal */}
      {showHealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-accent">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold text-text-primary">Orbit AI Axis Requesting Permission</h2>
              </div>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Orbit is about to connect to your GitHub repository and automatically generate a pull request to resolve the issue: <strong>{issue.title}</strong>.
                <br /><br />
                Are you sure you want to grant Orbit permission to modify your codebase?
              </p>
              
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowHealModal(false)}
                  disabled={healing}
                  className="px-4 py-2 rounded-full text-sm font-medium text-text-secondary hover:text-text-primary transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleSelfHeal();
                    setShowHealModal(false);
                  }}
                  disabled={healing}
                  className="px-6 py-2 rounded-full bg-accent text-bg-primary text-sm font-bold hover:bg-white transition disabled:opacity-50 flex items-center gap-2"
                >
                  {healing ? <span className="w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" /> : null}
                  Grant Permission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
