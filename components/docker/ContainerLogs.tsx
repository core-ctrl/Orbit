"use client";

import { useEffect, useState } from "react";

import { EmptyState, Panel } from "@/components/shared/Panel";
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
    <Panel className="min-h-[480px]">
      <h2 className="mb-4 font-medium">Log stream {name ? `/ ${name}` : ""}</h2>
      {!id ? (
        <EmptyState message="Select a container to stream its logs" />
      ) : lines.length ? (
        <pre className="scrollbar max-h-[410px] overflow-auto whitespace-pre-wrap rounded-xl bg-canvas p-4 font-mono text-xs leading-6 text-muted">
          {lines.join("\n")}
        </pre>
      ) : (
        <EmptyState message="Waiting for log output" />
      )}
    </Panel>
  );
}
