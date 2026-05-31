"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trash, Bell, Plus, Database, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import type { Integration } from "@/types/orbit";

export default function ProjectSettingsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("general");
  
  // General details
  const [projectName, setProjectName] = useState("");
  const [platform, setPlatform] = useState("nextjs");
  const [timezone, setTimezone] = useState("UTC");
  const [environment, setEnvironment] = useState("production");
  
  const [saveStatus, setSaveStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Integrations states
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [integrationProvider, setIntegrationProvider] = useState("slack");
  const [webhookUrl, setWebhookUrl] = useState("");

  // Backup states
  const [backupLoading, setBackupLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importStatus, setImportStatus] = useState("");

  useEffect(() => {
    api.project(projectId)
      .then(data => {
        if (data) {
          setProjectName(data.name || "");
          setPlatform(data.platform || "nextjs");
          setTimezone(data.timezone || "UTC");
          setEnvironment(data.environment || "production");
        }
      })
      .catch(console.error);
  }, [projectId]);

  const fetchIntegrations = useCallback(async () => {
    try {
      const data = await api.integrations(projectId);
      setIntegrations(data);
    } catch (e) {
      console.error(e);
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === "integrations") {
      fetchIntegrations();
    }
  }, [activeTab, fetchIntegrations]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");
    try {
      await api.updateProject(projectId, { name: projectName, platform, timezone, environment });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
      window.dispatchEvent(new Event("storage")); // trigger sidebar update if needed
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.deleteProject(projectId);
      router.push("/settings/organization/projects");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

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
      e.target.value = "";
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/settings/organization/projects" className="text-sm text-text-muted hover:text-text-primary flex items-center gap-1 mb-4 w-fit transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Projects
        </Link>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Project Settings: {projectName}</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Configure project-specific settings, integrations, and backups.</p>
      </div>

      <div className="flex items-center gap-6 border-b border-border overflow-x-auto whitespace-nowrap scrollbar pb-1 mb-6">
        {[
          { id: "general", label: "General" },
          { id: "integrations", label: "Integrations" },
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

      {activeTab === "backups" && (
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Database className="w-5 h-5 text-accent" /> Data Backups & Export</h2>
          <p className="text-sm text-text-secondary mb-6">Create downloadable archives of your project telemetry, logs, and configuration data.</p>
          
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
              {backupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />} 
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
        </section>
      )}
    </div>
  );
}
