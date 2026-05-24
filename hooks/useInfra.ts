"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { api } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";

export function useInfra() {
  const setSystem = useOrbitStore((state) => state.setSystem);
  const query = useQuery({
    queryKey: ["system"],
    queryFn: api.system,
    refetchInterval: 10000
  });
  useEffect(() => {
    if (query.data) setSystem(query.data);
  }, [query.data, setSystem]);
  return query;
}
