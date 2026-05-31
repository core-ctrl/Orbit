"use client";

import { useEffect, useState, use } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { GitCommit, Calendar, Tag, User, Server } from "lucide-react";
import { api } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { Deployment } from "@/types/orbit";

export default function DeploymentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const data = await api.deployments(projectId);
        setDeployments(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "failed": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "deploying": return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse";
      default: return "bg-green-500/20 text-green-400 border border-green-500/30";
    }
  };

  if (loading) {
    return <ListSkeleton items={4} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Deployment Tracking</h1>
        <p className="text-text-secondary text-sm mt-1">Timeline of system releases, build tags, and code commits</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden">
        {deployments.length === 0 ? (
          <EmptyState 
            icon={Server}
            title="No deployments recorded"
            description="Log deployments using our CLI or GitHub Actions Integration. Verify docs for setup examples."
          />
        ) : (
          <div className="relative border-l border-border ml-3 pl-8 space-y-8">
            {deployments.map((dep, idx) => (
              <div key={dep.id} className="relative">
                {/* Node Dot Icon */}
                <span className="absolute -left-[45px] top-1 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-text-secondary">
                  <GitCommit className="w-4 h-4" />
                </span>

                <div className="bg-secondary/40 border border-border rounded-xl p-5 hover:bg-secondary/60 transition-colors">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-text-primary">{dep.version}</span>
                      <Badge className={getStatusColor(dep.status)}>{dep.status}</Badge>
                      <span className="text-xs bg-hover border border-border text-text-secondary px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {dep.environment}
                      </span>
                    </div>
                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(dep.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {dep.commit_message && (
                    <p className="text-sm font-medium text-text-primary mb-3">
                      {dep.commit_message}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-text-secondary flex-wrap border-t border-border/50 pt-3 mt-3">
                    {dep.commit_sha && (
                      <span className="font-mono bg-hover px-2 py-1 rounded border border-border">
                        sha: {dep.commit_sha.substring(0, 7)}
                      </span>
                    )}
                    {dep.author_name && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-text-muted" /> Released by {dep.author_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
