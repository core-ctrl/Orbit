"use client";

import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { eventStreamUrl } from "@/lib/api";

export function ContainerLogs({ id, name }: { id: string | null; name?: string }): JSX.Element {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    setLines([]);
    if (!id) return;
    const source = new EventSource(eventStreamUrl(`/docker/containers/${id}/logs`));
    source.onmessage = (event: MessageEvent<string>) => {
      const payload = JSON.parse(event.data) as { line: string };
      setLines((current) => [...current, payload.line].slice(-200));
    };
    return () => source.close();
  }, [id]);

  return (
    <div className="glass-card p-6 min-h-[480px]">
      <h2 className="mb-4 font-semibold text-text-primary text-sm flex items-center gap-2">
        <Terminal className="w-4 h-4 text-accent" />
        Log stream {name ? `/ ${name}` : ""}
      </h2>
      {!id ? (
        <EmptyState 
          icon={Terminal}
          title="No container selected"
          description="Select a container to stream its logs" 
        />
      ) : lines.length ? (
        <pre className="scrollbar max-h-[410px] overflow-auto whitespace-pre-wrap rounded-xl bg-secondary/30 border border-border p-4 font-mono text-xs leading-6 text-text-secondary">
          {lines.join("\n")}
        </pre>
      ) : (
        <EmptyState 
          icon={Terminal}
          title="Waiting for logs"
          description="Listening for container output..." 
        />
      )}
    </div>
  );
}
