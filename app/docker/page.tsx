"use client";

import { useEffect, useState } from "react";

import { ContainerCard } from "@/components/docker/ContainerCard";
import { ContainerLogs } from "@/components/docker/ContainerLogs";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/shared/Panel";
import { useOrbitStore } from "@/store/orbitStore";

export default function DockerPage(): JSX.Element {
  const containers = useOrbitStore((state) => state.containers);
  const docker = useOrbitStore((state) => state.docker);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    if (!selected && containers[0]) setSelected(containers[0].id);
  }, [containers, selected]);
  const selectedContainer = containers.find((container) => container.id === selected);
  return (
    <DashboardShell>
      {!docker?.available ? (
        <EmptyState message="Docker is disabled or the socket is not mounted" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(360px,1fr)_1.35fr]">
          <div className="space-y-4">
            {containers.length ? containers.map((container) => (
              <ContainerCard key={container.id} container={container} selected={selected === container.id} onSelect={() => setSelected(container.id)} />
            )) : <EmptyState message="No containers are currently visible" />}
          </div>
          <ContainerLogs id={selected} name={selectedContainer?.name} />
        </div>
      )}
    </DashboardShell>
  );
}
