"use client";

import { useState, useEffect, useCallback } from "react";
import { Globe, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

export default function OrganizationSettingsPage() {
  const [orgId, setOrgId] = useState("");
  const [loading, setLoading] = useState(true);

  // Status Page states
  const [statusTitle, setStatusTitle] = useState("");
  const [statusSlug, setStatusSlug] = useState("");
  const [isPublicPage, setIsPublicPage] = useState(true);
  const [saveStatusPageMsg, setSaveStatusPageMsg] = useState("");

  const fetchStatusPageConfig = useCallback(async (id: string) => {
    try {
      const data = await api.statusPageConfig(id);
      setStatusTitle(data.title || "");
      setStatusSlug(data.slug || "");
      setIsPublicPage(data.is_public);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    // Get org id by first fetching projects (since there is no direct api.myOrg())
    // Or we can just fetch organizations and pick the first one
    api.organizations()
      .then(orgs => {
        if (orgs && orgs.length > 0) {
          const id = orgs[0].id;
          setOrgId(id);
          fetchStatusPageConfig(id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [fetchStatusPageConfig]);

  const handleSaveStatusPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
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

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8 border-b border-[var(--glass-border)] pb-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">General Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage organization-wide configurations like your public Status Page.</p>
      </div>

      <div className="space-y-6">
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" /> Publish Status Page
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Create a public operational status website for customers to review ongoing incidents and component latency measurements.
          </p>
          
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading config...
            </div>
          ) : (
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
          )}
        </section>

        {!loading && statusSlug && (
          <section className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Developer Embeds
            </h3>
            
            <div>
              <span className="text-xs font-semibold text-text-primary block mb-1">Public Page URL</span>
              <a 
                href={`/status/${statusSlug}`} 
                target="_blank"
                rel="noreferrer"
                className="text-xs text-accent hover:underline break-all"
              >
                {typeof window !== 'undefined' ? window.location.origin : ''}/status/{statusSlug}
              </a>
            </div>

            <div>
              <span className="text-xs font-semibold text-text-primary block mb-1">GitHub README Status Badge</span>
              <p className="text-[10px] text-text-muted mb-2">Embed this SVG markdown inside project README files for live status checking:</p>
              <div className="font-mono text-xs bg-black/60 border border-border p-3 rounded-lg text-text-primary break-all select-all">
                {`[![Orbit Status](${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/projects/YOUR_PROJECT_ID/badge.svg)](${typeof window !== 'undefined' ? window.location.origin : ''}/status/${statusSlug})`}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
