"use client";

import { Cpu, HardDrive, MemoryStick, Network } from "lucide-react";

import { AreaChart } from "@/components/charts/AreaChart";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState, Panel } from "@/components/shared/Panel";
import { StatCard } from "@/components/shared/StatCard";
import { formatBytes } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

export default function InfrastructurePage(): JSX.Element {
  const system = useOrbitStore((state) => state.system);
  const history = useOrbitStore((state) => state.systemHistory);
  const cpuData = history.map((item) => ({
    label: new Date(item.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    value: item.cpu_percent
  }));
  const memoryData = history.map((item) => ({
    label: new Date(item.timestamp).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    value: item.memory_percent
  }));
  return (
    <DashboardShell>
      {system ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="CPU" value={`${system.cpu_percent.toFixed(1)}%`} icon={<Cpu className="h-5 w-5" />} />
            <StatCard label="Memory" value={`${system.memory_percent.toFixed(1)}%`} hint={formatBytes(system.memory_used)} icon={<MemoryStick className="h-5 w-5" />} />
            <StatCard label="Disk" value={`${system.disk_percent.toFixed(1)}%`} hint={formatBytes(system.disk_used)} icon={<HardDrive className="h-5 w-5" />} />
            <StatCard label="Network RX" value={formatBytes(system.network_rx)} hint={`TX ${formatBytes(system.network_tx)}`} icon={<Network className="h-5 w-5" />} />
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel>
              <h2 className="mb-5 font-medium">CPU trend</h2>
              <div className="h-72"><AreaChart data={cpuData} unit="%" /></div>
            </Panel>
            <Panel>
              <h2 className="mb-5 font-medium">Memory trend</h2>
              <div className="h-72"><AreaChart data={memoryData} unit="%" color="#4cc9f0" /></div>
            </Panel>
          </div>
        </>
      ) : (
        <EmptyState message="Waiting for infrastructure metrics" />
      )}
    </DashboardShell>
  );
}
