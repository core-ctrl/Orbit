"use client";

import { useEffect, useState, use } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertOctagon, RefreshCw, Clock, Flame } from "lucide-react";
import { api } from "@/lib/api";
import type { PublicStatusData } from "@/types/orbit";

export default function PublicStatusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [data, setData] = useState<PublicStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchStatus = async () => {
    try {
      const result = await api.publicStatus(slug);
      setData(result);
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin block mx-auto" />
          <p className="text-xs text-text-secondary font-semibold">Retrieving system statuses...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4">
        <div className="text-center max-w-sm space-y-3">
          <AlertOctagon className="w-10 h-10 text-danger mx-auto" />
          <h1 className="text-lg font-bold">Status Page Unavailable</h1>
          <p className="text-xs text-text-secondary">This status page does not exist or has been set to private. Contact the organization administrators.</p>
        </div>
      </div>
    );
  }

  const getOverallConfig = (status: string) => {
    switch (status) {
      case "major_outage":
        return {
          bg: "bg-red-500/10 border-red-500/20",
          text: "text-red-400",
          icon: <AlertOctagon className="w-8 h-8 text-red-400 animate-pulse" />,
          label: "Active Outages Reported"
        };
      case "degraded":
        return {
          bg: "bg-orange-500/10 border-orange-500/20",
          text: "text-orange-400",
          icon: <AlertOctagon className="w-8 h-8 text-orange-400 animate-pulse" />,
          label: "Degraded System Performance"
        };
      default:
        return {
          bg: "bg-green-500/10 border-green-500/20",
          text: "text-green-400",
          icon: <CheckCircle className="w-8 h-8 text-green-400" />,
          label: "All Systems Operational"
        };
    }
  };

  const statusConfig = getOverallConfig(data.overall_status);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-xl font-bold text-text-primary">{data.title}</h1>
            <p className="text-xs text-text-secondary mt-1">Real-time status updates powered by Orbit</p>
          </div>
          <button
            onClick={fetchStatus}
            className="p-2 bg-secondary border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Big Alert Indicator */}
        <div className={`border rounded-xl p-6 flex items-center gap-4 ${statusConfig.bg}`}>
          {statusConfig.icon}
          <div>
            <h2 className={`text-lg font-semibold ${statusConfig.text}`}>{statusConfig.label}</h2>
            <p className="text-xs text-text-secondary mt-0.5">Last updated {formatDistanceToNow(new Date(), { addSuffix: true })}</p>
          </div>
        </div>

        {/* Services Status Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-md">
          <div className="px-5 py-4 border-b border-border bg-secondary/20">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Service Components</h3>
          </div>
          <div className="divide-y divide-border font-mono text-xs">
            {data.endpoints.map((ep: any) => (
              <div key={ep.name} className="px-5 py-4 flex items-center justify-between">
                <span className="font-semibold text-text-primary">{ep.name}</span>
                <div className="flex items-center gap-4">
                  {ep.latency_ms && <span className="text-text-muted">{ep.latency_ms.toFixed(0)}ms</span>}
                  <Badge variant={ep.status === "up" ? "success" : "danger"}>
                    {ep.status === "up" ? "Operational" : "Outage"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents timeline */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-accent" /> Incidents History
          </h3>

          <div className="bg-card border border-border rounded-xl p-5 space-y-6">
            {data.incidents.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No incidents reported in the past 90 days.</p>
            ) : (
              data.incidents.map((inc: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-start relative">
                  {idx < data.incidents.length - 1 && (
                    <div className="absolute left-2.5 top-6 bottom-0 w-px bg-border -mb-6" />
                  )}
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-border ${inc.status === "resolved" ? "bg-secondary text-text-muted" : "bg-red-500/10 text-red-400"}`}>
                    <Clock className="w-3 h-3" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary">{inc.title}</span>
                      <span className={`text-[10px] uppercase font-extrabold px-1.5 rounded-md ${inc.status === "resolved" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
                        {inc.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-muted">
                      Logged {formatDistanceToNow(new Date(inc.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
