"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, Shield, Key, Bell, User, Check, RefreshCw, Globe, Eye, Database, Download } from "lucide-react";
import { api } from "@/lib/api";
import type { Integration, ApiKeyItem, AuditLogEntry } from "@/types/orbit";

export default function SettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");
  
  // General details
  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState("nextjs");
  const [timezone, setTimezone] = useState("UTC");
  const [environment, setEnvironment] = useState("production");
  const [orgId, setOrgId] = useState("");
  
  // User details
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  const [saveStatus, setSaveStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Integrations states
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationProvider, setIntegrationProvider] = useState("slack");
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // API Keys states
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Status Page states
  const [statusTitle, setStatusTitle] = useState("");
  const [statusSlug, setStatusSlug] = useState("");
  const [isPublicPage, setIsPublicPage] = useState(true);
  const [saveStatusPageMsg, setSaveStatusPageMsg] = useState("");

  // Backup states
  const [backupLoading, setBackupLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  useEffect(() => {
    const loadProjectAndUser = async () => {
      try {
        const data = await api.project(projectId);
        if (data) {
          setProjectName(data.name || "");
          setPlatform(data.platform || "nextjs");
          setTimezone(data.timezone || "UTC");
          setEnvironment(data.environment || "production");
          setOrgId(data.org_id || "");
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const userData = await api.me();
        if (userData) {
          setUserName(userData.name || "");
          setUserEmail(userData.email || "");
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProjectAndUser();
  }, [projectId]);

  // Fetch integrations
  const fetchIntegrations = useCallback(async () => {
    try {
      const data = await api.integrations(projectId);
      setIntegrations(data);
    } catch (e) {
      console.error(e);
    }
  }, [projectId]);

  // Fetch API keys
  const fetchApiKeys = useCallback(async () => {
    if (!orgId) return;
    try {
      const data = await api.apiKeys(orgId);
      setApiKeys(data);
    } catch (e) {
      console.error(e);
    }
  }, [orgId]);

  // Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    if (!orgId) return;
    setLoadingAudit(true);
    try {
      const data = await api.auditLogs(orgId);
      setAuditLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAudit(false);
    }
  }, [orgId]);

  // Fetch Status Page configuration
  const fetchStatusPageConfig = useCallback(async () => {
    if (!orgId) return;
    try {
      const data = await api.statusPageConfig(orgId);
      setStatusTitle(data.title || "");
      setStatusSlug(data.slug || "");
      setIsPublicPage(data.is_public);
    } catch (e) {
      console.error(e);
    }
  }, [orgId]);

  useEffect(() => {
    if (activeTab === "integrations") {
      fetchIntegrations();
    } else if (activeTab === "api_keys" && orgId) {
      fetchApiKeys();
    } else if (activeTab === "audit_logs" && orgId) {
      fetchAuditLogs();
    } else if (activeTab === "status_page" && orgId) {
      fetchStatusPageConfig();
    }
  }, [activeTab, orgId, fetchIntegrations, fetchApiKeys, fetchAuditLogs, fetchStatusPageConfig]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      await api.updateProject(projectId, { name: projectName, platform, timezone, environment });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
      window.dispatchEvent(new Event("storage"));
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(projectId);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  // Add webhook integration
  const handleAddIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIntegration(projectId, { provider: integrationProvider, webhook_url: webhookUrl });
      setWebhookUrl("");
      fetchIntegrations();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    try {
      await api.deleteIntegration(projectId, id);
      fetchIntegrations();
    } catch (e) {
      console.error(e);
    }
  };

  // Create API Key
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.createApiKey(orgId, newKeyName);
      setNewlyCreatedKey(data.raw_key || data.key_prefix);
      setNewKeyName("");
      fetchApiKeys();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    try {
      await api.revokeApiKey(orgId, keyId);
      fetchApiKeys();
    } catch (e) {
      console.error(e);
    }
  };

  // Update Status Page Config
  const handleSaveStatusPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatusPageMsg("saving");
    try {
      await api.updateStatusPage(orgId, {
        title: statusTitle,
        slug: statusSlug,
        is_public: isPublicPage
      });
      setSaveStatusPageMsg("success");
      setTimeout(() => setSaveStatusPageMsg(""), 3000);
    } catch {
      setSaveStatusPageMsg("error");
      setTimeout(() => setSaveStatusPageMsg(""), 3000);
    }
  };

  const handleCreateBackup = async () => {
    setBackupLoading(true);
    try {
      const data = await api.exportBackup(projectId);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orbit-backup-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate backup.");
    } finally {
      setBackupLoading(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportStatus("");
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (payload.version !== "1.0") {
        throw new Error("Invalid backup version");
      }
      const result = await api.importBackup(projectId, payload);
      setImportStatus(`Import successful! Processed ${result.issues_processed} issues and ${result.performance_processed} performance records.`);
    } catch (e) {
      console.error(e);
      setImportStatus("Import failed. Please ensure the file is a valid Orbit backup.");
    } finally {
      setImportLoading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage project configurations, integrations, status pages, and security auditing.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-border overflow-x-auto whitespace-nowrap scrollbar pb-1">
        {[
          { id: "general", label: "General" },
          { id: "team", label: "Team" },
          { id: "integrations", label: "Integrations" },
          { id: "status_page", label: "Status Page" },
          { id: "api_keys", label: "API Keys" },
          { id: "audit_logs", label: "Audit Logs" },
          { id: "backups", label: "Data Backups" }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id ? 'border-accent text-text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="space-y-8">
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-medium text-text-primary mb-4">Project Information</h2>
            <form onSubmit={handleSaveChanges} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary outline-none focus:border-accent" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Platform</label>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary outline-none focus:border-accent"
                >
                  <option value="nextjs">Next.js</option>
                  <option value="python">Python</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Project ID</label>
                <input 
                  type="text" 
                  readOnly 
                  value={projectId} 
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2 text-text-muted outline-none cursor-not-allowed" 
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                  Save Changes
                </button>
                {saveStatus === "saving" && <span className="text-xs text-text-secondary animate-pulse">Saving...</span>}
                {saveStatus === "success" && <span className="text-xs text-success">✓ Settings saved successfully!</span>}
                {saveStatus === "error" && <span className="text-xs text-danger">⚠️ Error saving settings.</span>}
              </div>
            </form>
          </section>

          <section className="bg-card border border-danger/20 rounded-xl p-6">
            <h2 className="text-lg font-medium text-danger mb-2">Danger Zone</h2>
            <p className="text-sm text-text-secondary mb-4">Permanently delete this project and all its data. This cannot be undone.</p>
            <div className="flex items-center justify-between">
              {deleteConfirm ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-danger font-medium">Are you absolutely sure?</span>
                  <button onClick={handleDeleteProject} className="bg-danger text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger/80 transition-colors">
                    Yes, Delete
                  </button>
                  <button onClick={() => setDeleteConfirm(false)} className="bg-secondary text-text-primary px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-hover transition-colors">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setDeleteConfirm(true)} className="bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Delete Project
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "team" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="text-lg font-medium text-text-primary">Team Members</h2>
              <p className="text-sm text-text-secondary mt-1">Manage who has access to this project.</p>
            </div>
            <button className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
              Invite Member
            </button>
          </div>
          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-medium">
                  {userName[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{userName || "Current User"}</div>
                  <div className="text-sm text-text-secondary">{userEmail || "user@example.com"}</div>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Owner</Badge>
            </div>
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Bell className="w-5 h-5 text-accent" /> Connect Webhook Integration</h2>
            <p className="text-sm text-text-secondary mb-4">Post alerts directly to Slack channels or Discord webhooks when errors regression or incidents are detected.</p>
            
            <form onSubmit={handleAddIntegration} className="space-y-4 max-w-lg">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Provider</label>
                  <select
                    value={integrationProvider}
                    onChange={(e) => setIntegrationProvider(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  >
                    <option value="slack">Slack</option>
                    <option value="discord">Discord</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-secondary mb-1">Webhook URL</label>
                  <input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Integration
              </button>
            </form>
          </section>

          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/20">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Webhook Integrations</h3>
            </div>
            <div className="divide-y divide-border">
              {integrations.length === 0 ? (
                <p className="p-5 text-xs text-text-muted text-center">No alert channels configured. Webhooks will be skipped.</p>
              ) : (
                integrations.map((int) => (
                  <div key={int.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-text-primary capitalize">{int.provider} Integration</span>
                      <span className="text-xs text-text-muted block truncate max-w-md">{int.webhook_url}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteIntegration(int.id)}
                      className="text-danger hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "status_page" && (
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Globe className="w-5 h-5 text-accent" /> Publish Status Page</h2>
            <p className="text-sm text-text-secondary mb-4">Create a public operational status website for customers to review ongoing incidents and component latency measurements.</p>
            
            <form onSubmit={handleSaveStatusPage} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Status Page Title</label>
                <input
                  type="text"
                  placeholder="e.g. Orbit Service Status"
                  value={statusTitle}
                  onChange={(e) => setStatusTitle(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Status Page Slug Path</label>
                <input
                  type="text"
                  placeholder="e.g. orbit-health"
                  value={statusSlug}
                  onChange={(e) => setStatusSlug(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={isPublicPage}
                  onChange={(e) => setIsPublicPage(e.target.checked)}
                  className="rounded bg-secondary border-border border text-accent"
                />
                <label htmlFor="is_public" className="text-xs text-text-secondary">Allow public view (Available anonymously at status/slug)</label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors">
                  Save Configuration
                </button>
                {saveStatusPageMsg === "saving" && <span className="text-xs text-text-secondary animate-pulse">Saving...</span>}
                {saveStatusPageMsg === "success" && <span className="text-xs text-success">✓ Configuration saved!</span>}
                {saveStatusPageMsg === "error" && <span className="text-xs text-danger">⚠️ Error saving config.</span>}
              </div>
            </form>
          </section>

          {statusSlug && (
            <section className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-accent" /> Developer Embeds
              </h3>
              
              <div>
                <span className="text-xs font-semibold text-text-primary block mb-1">Public Page URL</span>
                <a 
                  href={`/status/${statusSlug}`} 
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent hover:underline break-all"
                >
                  http://localhost:3000/status/{statusSlug}
                </a>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-primary block mb-1">GitHub README Status Badge</span>
                <p className="text-[10px] text-text-muted mb-2">Embed this SVG markdown inside project README files for live status checking:</p>
                <div className="font-mono text-xs bg-black/60 border border-border p-3 rounded-lg text-text-primary break-all select-all">
                  {`[![Orbit Status](${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/projects/${projectId}/badge.svg)](${typeof window !== 'undefined' ? window.location.origin : ''}/status/${statusSlug})`}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {activeTab === "api_keys" && (
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Key className="w-5 h-5 text-accent" /> Generate API Key</h2>
            <p className="text-sm text-text-secondary mb-4">Provision tokens to query Orbit&apos;s raw data programmatically or ingestion via custom scrapers.</p>
            
            <form onSubmit={handleCreateApiKey} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Key Description Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. CI-deploy-key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-text-primary outline-none focus:border-accent"
                    required
                  />
                  <button type="submit" className="bg-text-primary text-bg-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors shrink-0">
                    Generate
                  </button>
                </div>
              </div>
            </form>
          </section>

          {newlyCreatedKey && (
            <section className="bg-green-500/10 border border-green-500/20 rounded-xl p-5 space-y-2">
              <span className="text-xs font-semibold text-green-400 flex items-center gap-1.5"><Check className="w-4 h-4" /> API Key Created Successfully!</span>
              <p className="text-xs text-text-secondary">Copy this key now. It will not be shown again for security reasons:</p>
              <div className="font-mono text-sm bg-black/60 border border-border p-3 rounded-lg text-text-primary break-all select-all">
                {newlyCreatedKey}
              </div>
            </section>
          )}

          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/20">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Workspace Keys</h3>
            </div>
            <div className="divide-y divide-border">
              {apiKeys.length === 0 ? (
                <p className="p-5 text-xs text-text-muted text-center">No API keys generated yet.</p>
              ) : (
                apiKeys.map((key) => (
                  <div key={key.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-text-primary">{key.name}</span>
                      <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                        <span>Prefix: <code className="bg-secondary px-1 py-0.5 rounded">{key.key_prefix}</code></span>
                        <span>·</span>
                        <span>Created {new Date(key.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeApiKey(key.id)}
                      className="text-danger hover:text-red-500 px-3 py-1.5 rounded-lg border border-danger/20 hover:bg-red-500/10 text-xs font-semibold transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "audit_logs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" /> Security Audit Log
            </h3>
            <button
              onClick={fetchAuditLogs}
              className="text-xs bg-secondary border border-border text-text-primary px-3 py-1.5 rounded-xl hover:bg-hover transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden font-mono text-xs shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-text-secondary text-[10px] uppercase tracking-wider text-left">
                    <th className="p-3 w-32">Timestamp</th>
                    <th className="p-3 w-28">User ID</th>
                    <th className="p-3 w-40">Action</th>
                    <th className="p-3">Target Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingAudit ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">Loading audit records...</td>
                    </tr>
                  ) : auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-muted">No audit events logged yet.</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/10 transition-colors">
                        <td className="p-3 text-text-muted">{new Date(log.created_at).toLocaleString()}</td>
                        <td className="p-3 text-accent truncate max-w-[100px]" title={log.user_id}>{log.user_id.split("-")[0]}</td>
                        <td className="p-3 font-semibold text-text-primary">{log.action}</td>
                        <td className="p-3 text-text-secondary">
                          {log.target_type} {log.target_id ? `(${log.target_id.split("-")[0]})` : ""}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "backups" && (
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Database className="w-5 h-5 text-accent" /> Data Backups & Export</h2>
            <p className="text-sm text-text-secondary mb-6">Create downloadable archives of your project telemetry, logs, and configuration data. Backups are retained for 30 days.</p>
            
            <div className="bg-secondary/30 border border-border rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-text-primary text-sm">Full Project Export</h3>
                <p className="text-xs text-text-muted mt-1">Includes all issues, incidents, logs, and metrics for this project.</p>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={backupLoading}
                className="w-full sm:w-auto bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-glow transition-all whitespace-nowrap"
              >
                {backupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} 
                {backupLoading ? "Generating..." : "Generate Backup"}
              </button>
            </div>

            <div className="bg-secondary/30 border border-border rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <div>
                <h3 className="font-semibold text-text-primary text-sm">Import Project Backup</h3>
                <p className="text-xs text-text-muted mt-1">Restore your project data from a previously generated backup JSON file.</p>
                {importStatus && (
                  <p className={`text-xs mt-2 ${importStatus.includes("failed") ? "text-danger" : "text-success"}`}>
                    {importStatus}
                  </p>
                )}
              </div>
              <div className="relative w-full sm:w-auto">
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportBackup}
                  disabled={importLoading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <button
                  disabled={importLoading}
                  className="w-full sm:w-auto bg-secondary hover:bg-hover disabled:opacity-50 border border-border text-text-primary px-5 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all whitespace-nowrap pointer-events-none"
                >
                  {importLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />} 
                  {importLoading ? "Importing..." : "Upload Backup File"}
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-medium text-text-primary mb-4">Recent Backups</h3>
              <div className="text-center py-8 text-text-muted text-sm border border-dashed border-border rounded-lg">
                No recent backups found. Generate your first backup above.
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
