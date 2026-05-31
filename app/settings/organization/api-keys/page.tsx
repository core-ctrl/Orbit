"use client";

import { useState, useEffect, useCallback } from "react";
import { Key, Check } from "lucide-react";
import { api } from "@/lib/api";
import type { ApiKeyItem } from "@/types/orbit";

export default function ApiKeysPage() {
  const [orgId, setOrgId] = useState("");
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async (id: string) => {
    try {
      const data = await api.apiKeys(id);
      setApiKeys(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    api.organizations()
      .then(orgs => {
        if (orgs && orgs.length > 0) {
          const id = orgs[0].id;
          setOrgId(id);
          fetchApiKeys(id);
        }
      })
      .catch(console.error);
  }, [fetchApiKeys]);

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    try {
      const data = await api.createApiKey(orgId, newKeyName);
      setNewlyCreatedKey(data.raw_key || data.key_prefix);
      setNewKeyName("");
      fetchApiKeys(orgId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    if (!orgId) return;
    try {
      await api.revokeApiKey(orgId, keyId);
      fetchApiKeys(orgId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 max-w-4xl space-y-6">
      <div className="border-b border-[var(--glass-border)] pb-4">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">API Keys</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Manage programmatic access to your organization's data.</p>
      </div>

      <section className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-medium text-text-primary mb-2 flex items-center gap-2"><Key className="w-5 h-5 text-accent" /> Generate API Key</h2>
        <p className="text-sm text-text-secondary mb-4">Provision tokens to query Orbit's raw data programmatically or ingestion via custom scrapers.</p>
        
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
  );
}
