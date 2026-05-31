"use client";

import { useEffect, useState, useCallback, use } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, ShieldAlert, CheckCircle, MessageSquare, User, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { ListSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { Incident, IncidentUpdate } from "@/types/orbit";

export default function IncidentsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [updates, setUpdates] = useState<IncidentUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState("minor");
  const [status, setStatus] = useState("open");
  const [updateMessage, setUpdateMessage] = useState("");

  const fetchIncidents = useCallback(async () => {
    try {
      const data = await api.incidents(projectId);
      setIncidents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchIncidentDetails = async (id: string) => {
    try {
      const data = await api.incident(projectId, id);
      setSelectedIncident(data);
      setUpdates(data.updates || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [projectId]);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIncident(projectId, { title, severity });
      setIsModalOpen(false);
      setTitle("");
      setSeverity("minor");
      setStatus("open");
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncident || !updateMessage) return;
    try {
      await api.addIncidentUpdate(projectId, selectedIncident.id, {
        message: updateMessage,
        status: selectedIncident.status,
      });
      setUpdateMessage("");
      fetchIncidentDetails(selectedIncident.id);
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  const updateIncidentState = async (updatesObj: Partial<Incident>) => {
    if (!selectedIncident) return;
    try {
      await api.updateIncident(projectId, selectedIncident.id, updatesObj);
      fetchIncidentDetails(selectedIncident.id);
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical": return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "major": return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    }
  };

  const getStatusColor = (stat: string) => {
    switch (stat) {
      case "resolved": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "monitoring": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default: return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    }
  };

  if (loading) {
    return <ListSkeleton items={4} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Incident Management</h1>
          <p className="text-text-secondary text-sm mt-1">Track active outages, root cause investigations, and real-time updates</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-glow transition-all"
        >
          <Plus className="w-4 h-4" /> Trigger Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {incidents.length === 0 ? (
              <EmptyState 
                icon={CheckCircle}
                title="All systems operational"
                description="No active or resolved incidents reported. Enjoy the quiet!"
              />
            ) : (
              <div className="divide-y divide-border">
                {incidents.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={() => fetchIncidentDetails(inc.id)}
                    className={`w-full text-left p-5 flex items-start gap-4 hover:bg-hover transition-colors ${selectedIncident?.id === inc.id ? "bg-hover/50" : ""}`}
                  >
                    <Flame className={`w-5 h-5 shrink-0 mt-0.5 ${inc.status === "resolved" ? "text-text-muted" : "text-danger"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-text-primary truncate">{inc.title}</span>
                        <Badge className={getSeverityColor(inc.severity)}>{inc.severity}</Badge>
                        <Badge className={getStatusColor(inc.status)}>{inc.status}</Badge>
                      </div>
                      <div className="text-xs text-text-secondary">
                        Created {formatDistanceToNow(new Date(inc.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Incident Details */}
        <div className="space-y-4">
          {selectedIncident ? (
            <div className="bg-card border border-border rounded-xl p-5 space-y-5">
              <div className="border-b border-border pb-4">
                <h2 className="text-base font-semibold text-text-primary mb-2">{selectedIncident.title}</h2>
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(selectedIncident.status)}`}>
                    {selectedIncident.status}
                  </span>
                </div>
                
                {/* Quick actions */}
                <div className="flex gap-2">
                  <select
                    value={selectedIncident.status}
                    onChange={(e) => updateIncidentState({ status: e.target.value as Incident['status'] })}
                    className="bg-secondary border border-border rounded-lg px-2 py-1 text-xs outline-none text-text-primary"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="identified">Identified</option>
                    <option value="monitoring">Monitoring</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  
                  <select
                    value={selectedIncident.severity}
                    onChange={(e) => updateIncidentState({ severity: e.target.value as Incident['severity'] })}
                    className="bg-secondary border border-border rounded-lg px-2 py-1 text-xs outline-none text-text-primary"
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Updates log */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Timeline Updates
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto scrollbar pr-1">
                  {updates.length === 0 ? (
                    <p className="text-xs text-text-muted">No updates posted yet.</p>
                  ) : (
                    updates.map((up) => (
                      <div key={up.id} className="text-xs border border-border bg-secondary/30 rounded-lg p-3">
                        <div className="flex items-center justify-between text-text-muted mb-1 font-medium">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> Staff Update</span>
                          <span>{formatDistanceToNow(new Date(up.created_at), { addSuffix: true })}</span>
                        </div>
                        <p className="text-text-primary leading-relaxed">{up.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddUpdate} className="pt-2 border-t border-border space-y-2">
                  <textarea
                    placeholder="Write a timeline update..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    rows={2}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-text-primary text-primary hover:bg-white text-xs font-semibold py-2 rounded-lg transition-transform active:scale-[0.98]"
                  >
                    Post Update
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-5 text-center text-text-secondary flex flex-col items-center py-10">
              <ShieldAlert className="w-6 h-6 text-text-muted mb-2 animate-bounce" />
              <p className="text-xs font-medium">Select an incident to view its detailed timeline, update severity/status, or add updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Trigger Incident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl relative">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2"><AlertTriangle className="text-danger w-5 h-5" /> Trigger New Incident</h2>
            <form onSubmit={handleCreateIncident} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Major checkout failure"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary outline-none"
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg p-2 text-sm text-text-primary outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
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
                  Trigger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
