"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Panel } from "@/components/shared/Panel";
import { api } from "@/lib/api";

export default function SettingsPage(): JSX.Element {
  const config = useQuery({ queryKey: ["config"], queryFn: api.config });
  const [yaml, setYaml] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (config.data) setYaml(config.data.raw_yaml);
  }, [config.data]);
  const update = useMutation({
    mutationFn: api.updateConfig,
    onSuccess: () => setMessage("Configuration saved. Monitors reload automatically."),
    onError: () => setMessage("Configuration could not be validated or saved.")
  });
  const save = (): void => {
    setMessage("");
    update.mutate(yaml);
  };
  return (
    <DashboardShell>
      <Panel>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-medium">orbit.config.yaml</h2>
            <p className="mt-1 text-sm text-muted">
              Define apps, endpoints, databases, certificates, and Docker access in one file.
            </p>
          </div>
          <button type="button" onClick={save} disabled={update.isPending} className="flex items-center gap-2 rounded-xl bg-orbit px-4 py-2.5 text-sm font-medium text-canvas disabled:opacity-60">
            <Save className="h-4 w-4" /> {update.isPending ? "Saving..." : "Save config"}
          </button>
        </div>
        {message && <p className="mb-4 rounded-xl border border-line bg-surface p-3 text-sm text-muted">{message}</p>}
        <textarea
          aria-label="Orbit YAML configuration"
          value={yaml}
          onChange={(event) => setYaml(event.target.value)}
          spellCheck={false}
          className="scrollbar min-h-[62vh] w-full rounded-xl border border-line bg-canvas p-5 font-mono text-sm leading-6 text-ink outline-none focus:border-orbit/40"
          placeholder={config.isLoading ? "Loading configuration..." : "Configuration unavailable"}
        />
      </Panel>
    </DashboardShell>
  );
}
