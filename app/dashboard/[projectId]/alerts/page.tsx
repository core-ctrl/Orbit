"use client";

import { useEffect, useState, useCallback, use } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { api } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell } from "lucide-react";
import type { AlertItem } from "@/types/orbit";

export default function AlertsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState("all");

  const fetchAlerts = useCallback(async () => {
    try {
      const data = await api.alerts();
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity === "all") return true;
    return alert.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">System Alerts</h1>
          <p className="text-text-secondary text-sm mt-1">Real-time alerts history triggered by your monitored systems.</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={filterSeverity} 
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm outline-none text-text-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <button 
            onClick={fetchAlerts}
            className="bg-secondary hover:bg-hover border border-border text-text-primary px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8"><ListSkeleton items={4} /></div>
        ) : filteredAlerts.length === 0 ? (
          <EmptyState 
            icon={Bell}
            title="No alerts triggered"
            description="All monitored systems are completely healthy."
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map(alert => (
              <div key={alert.id} className="flex items-start justify-between p-5 hover:bg-hover transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      alert.severity === "critical" ? "danger" : 
                      alert.severity === "warning" ? "warning" : "info"
                    }>
                      {alert.severity}
                    </Badge>
                    <span className="font-semibold text-text-primary">{alert.title}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{alert.message}</p>
                  <div className="text-xs text-text-muted flex items-center gap-2 mt-1">
                    <span>Source: <strong className="text-text-secondary font-medium">{alert.source}</strong></span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
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
