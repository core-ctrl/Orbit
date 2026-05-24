import { create } from "zustand";

import type {
  AlertItem,
  ContainerMetric,
  DatabaseHealth,
  DockerStatus,
  EndpointMetric,
  LogEntry,
  SslCertificate,
  SystemMetric
} from "@/types/orbit";

interface OrbitState {
  connected: boolean;
  system: SystemMetric | null;
  systemHistory: SystemMetric[];
  docker: DockerStatus | null;
  containers: ContainerMetric[];
  endpoints: EndpointMetric[];
  databases: DatabaseHealth[];
  ssl: SslCertificate[];
  alerts: AlertItem[];
  logs: LogEntry[];
  setConnected: (connected: boolean) => void;
  setSystem: (system: SystemMetric) => void;
  setDocker: (docker: DockerStatus, containers: ContainerMetric[]) => void;
  setEndpoints: (endpoints: EndpointMetric[]) => void;
  setDatabases: (databases: DatabaseHealth[]) => void;
  setSsl: (ssl: SslCertificate[]) => void;
  setAlerts: (alerts: AlertItem[]) => void;
  pushAlert: (alert: AlertItem) => void;
  pushLog: (log: LogEntry) => void;
}

export const useOrbitStore = create<OrbitState>((set) => ({
  connected: false,
  system: null,
  systemHistory: [],
  docker: null,
  containers: [],
  endpoints: [],
  databases: [],
  ssl: [],
  alerts: [],
  logs: [],
  setConnected: (connected) => set({ connected }),
  setSystem: (system) =>
    set((state) => ({ system, systemHistory: [...state.systemHistory, system].slice(-40) })),
  setDocker: (docker, containers) => set({ docker, containers }),
  setEndpoints: (endpoints) => set({ endpoints }),
  setDatabases: (databases) => set({ databases }),
  setSsl: (ssl) => set({ ssl }),
  setAlerts: (alerts) => set({ alerts }),
  pushAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 100) })),
  pushLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 200) }))
}));
