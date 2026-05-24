"use client";

import { Database } from "lucide-react";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/Panel";
import { useOrbitStore } from "@/store/orbitStore";

export default function DatabasesPage(): JSX.Element {
  const databases = useOrbitStore((state) => state.databases);
  return (
    <DashboardShell>
      {databases.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {databases.map((database) => (
            <section className="panel p-5" key={database.name}>
              <div className="flex items-center justify-between">
                <Database className="h-5 w-5 text-orbit" />
                <Badge tone={database.status === "up" ? "good" : "danger"}>{database.status}</Badge>
              </div>
              <h2 className="mt-5 font-medium">{database.name}</h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted">{database.type}</p>
              <p className="mt-5 text-2xl font-semibold">{database.latency_ms ?? "--"} <span className="text-sm text-muted">ms</span></p>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState message="No databases configured in orbit.config.yaml" />
      )}
    </DashboardShell>
  );
}
