"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState, Panel } from "@/components/shared/Panel";
import { useLogs } from "@/hooks/useLogs";
import { timeAgo } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export default function LogsPage(): JSX.Element {
  useLogs();
  const logs = useOrbitStore((state) => state.logs);
  return (
    <DashboardShell>
      <Panel>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-medium">Unified event stream</h2>
          <span className="text-xs text-muted">SSE live tail</span>
        </div>
        {logs.length ? (
          <div className="scrollbar max-h-[70vh] overflow-auto rounded-xl bg-canvas px-4 py-2 font-mono text-xs">
            {logs.map((log, index) => (
              <div className="flex gap-5 border-b border-line/50 py-3" key={`${log.timestamp}-${index}`}>
                <span className="w-16 shrink-0 text-muted">{timeAgo(log.timestamp)}</span>
                <span className="w-32 shrink-0 text-orbit">{log.source}</span>
                <span className="text-ink">{log.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="Live alerts and Docker events will appear here" />
        )}
      </Panel>
    </DashboardShell>
  );
}
