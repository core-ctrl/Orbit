"use client";

import { useEffect } from "react";

import { eventStreamUrl, getToken } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";
import type { LogEntry } from "@/types/orbit";

export function useLogs(): void {
  const pushLog = useOrbitStore((state) => state.pushLog);
  useEffect(() => {
    if (!getToken()) return;
    const source = new EventSource(eventStreamUrl("/logs/stream"));
    source.onmessage = (event: MessageEvent<string>) => {
      pushLog(JSON.parse(event.data) as LogEntry);
    };
    return () => source.close();
  }, [pushLog]);
}
