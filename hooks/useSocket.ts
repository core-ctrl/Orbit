"use client";

import { useEffect } from "react";

import { getToken } from "@/lib/api";
import { connectSocket } from "@/lib/socket";
import { useOrbitStore } from "@/store/orbitStore";
import type {
  AlertItem,
  ContainerUpdate,
  EndpointMetric,
  LogEntry,
  SystemMetric
} from "@/types/orbit";

export function useSocket(): void {
  const setConnected = useOrbitStore((state) => state.setConnected);
  const setSystem = useOrbitStore((state) => state.setSystem);
  const setDocker = useOrbitStore((state) => state.setDocker);
  const setEndpoints = useOrbitStore((state) => state.setEndpoints);
  const pushAlert = useOrbitStore((state) => state.pushAlert);
  const pushLog = useOrbitStore((state) => state.pushLog);

  useEffect(() => {
    if (!getToken()) return;
    const socket = connectSocket();
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("system:update", (metric: SystemMetric) => setSystem(metric));
    socket.on("containers:update", (update: ContainerUpdate) =>
      setDocker(update.status, update.containers)
    );
    socket.on("endpoints:update", (metrics: EndpointMetric[]) => setEndpoints(metrics));
    socket.on("alert:new", (alert: AlertItem) => pushAlert(alert));
    socket.on("container:event", (event: { name: string; action: string }) => {
      const log: LogEntry = {
        timestamp: new Date().toISOString(),
        source: event.name,
        message: `Container event: ${event.action}`
      };
      pushLog(log);
    });
    return () => {
      socket.disconnect();
      setConnected(false);
    };
  }, [pushAlert, pushLog, setConnected, setDocker, setEndpoints, setSystem]);
}
