"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { api } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";

export function useEndpoints() {
  const setEndpoints = useOrbitStore((state) => state.setEndpoints);
  const query = useQuery({
    queryKey: ["endpoints"],
    queryFn: api.endpoints,
    refetchInterval: 15000
  });
  useEffect(() => {
    if (query.data) setEndpoints(query.data);
  }, [query.data, setEndpoints]);
  return query;
}

export function useEndpointHistory(name: string) {
  return useQuery({
    queryKey: ["endpoint-history", name],
    queryFn: () => api.endpointHistory(name),
    enabled: Boolean(name),
    refetchInterval: 15000
  });
}
