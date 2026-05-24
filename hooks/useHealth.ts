"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { api } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";

export function useHealth() {
  const setDatabases = useOrbitStore((state) => state.setDatabases);
  const setSsl = useOrbitStore((state) => state.setSsl);
  const setAlerts = useOrbitStore((state) => state.setAlerts);
  const databases = useQuery({
    queryKey: ["databases"],
    queryFn: api.databases,
    refetchInterval: 30000
  });
  const ssl = useQuery({ queryKey: ["ssl"], queryFn: api.ssl, refetchInterval: 60000 });
  const alerts = useQuery({
    queryKey: ["alerts"],
    queryFn: api.alerts,
    refetchInterval: 30000
  });
  useEffect(() => {
    if (databases.data) setDatabases(databases.data);
  }, [databases.data, setDatabases]);
  useEffect(() => {
    if (ssl.data) setSsl(ssl.data);
  }, [setSsl, ssl.data]);
  useEffect(() => {
    if (alerts.data) setAlerts(alerts.data);
  }, [alerts.data, setAlerts]);
  return { databases, ssl, alerts };
}
