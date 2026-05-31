"use client";

import { useEffect, useRef } from "react";
import { getToken } from "@/lib/api";
import { connectSocket } from "@/lib/socket";
import { useOrbitStore } from "@/store/orbitStore";
import type {
  AlertItem,
  ContainerUpdate,
  EndpointMetric,
  LogEntry,
  SslCertificate,
  SystemMetric,
  DatabaseHealth,
} from "@/types/orbit";

// Singleton — connection persists across page navigations
let socketRef: ReturnType<typeof connectSocket> | null = null;
let isConnecting = false;

export function useSocket(): void {
  const setConnected = useOrbitStore((s) => s.setConnected);
  const setSystem = useOrbitStore((s) => s.setSystem);
  const setDocker = useOrbitStore((s) => s.setDocker);
  const setEndpoints = useOrbitStore((s) => s.setEndpoints);
  const setDatabases = useOrbitStore((s) => s.setDatabases);
  const setSsl = useOrbitStore((s) => s.setSsl);
  const setAlerts = useOrbitStore((s) => s.setAlerts);
  const pushAlert = useOrbitStore((s) => s.pushAlert);
  const pushLog = useOrbitStore((s) => s.pushLog);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    // If already connected, skip
    if (socketRef?.connected || isConnecting) return;

    isConnecting = true;
    const socket = connectSocket();
    socketRef = socket;

    socket.on("connect", () => {
      setConnected(true);
      isConnecting = false;
      console.log("[Orbit] Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      console.log("[Orbit] Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      setConnected(false);
      isConnecting = false;
      if (err.message === "websocket error") {
        console.warn("[Orbit] WebSocket unavailable, falling back to HTTP polling.");
      } else {
        console.error("[Orbit] Socket error:", err.message);
      }
    });

    // Real-time data events
    socket.on("system:update", (metric: SystemMetric) => setSystem(metric));

    socket.on("containers:update", (update: ContainerUpdate) =>
      setDocker(update.status, update.containers)
    );

    socket.on("endpoints:update", (metrics: EndpointMetric[]) =>
      setEndpoints(metrics)
    );

    socket.on("databases:update", (dbs: DatabaseHealth[]) =>
      setDatabases(dbs)
    );

    socket.on("ssl:update", (certs: SslCertificate[]) => setSsl(certs));

    socket.on("alerts:snapshot", (items: AlertItem[]) => setAlerts(items));

    socket.on("alert:new", (alert: AlertItem) => {
      pushAlert(alert);
      // Browser notification if permitted
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(`Orbit Alert: ${alert.title}`, {
          body: alert.message,
          icon: "/favicon.ico",
        });
      }
    });

    socket.on("container:event", (event: { name: string; action: string }) => {
      const log: LogEntry = {
        timestamp: new Date().toISOString(),
        source: event.name,
        message: `Container event: ${event.action}`,
      };
      pushLog(log);
    });

    // Note: We do NOT return a cleanup that disconnects — singleton stays alive
  }, [pushAlert, pushLog, setAlerts, setConnected, setDatabases, setDocker, setEndpoints, setSsl, setSystem]);
}
