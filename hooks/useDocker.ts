"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { api } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";

export function useDocker() {
  const setDocker = useOrbitStore((state) => state.setDocker);
  const status = useQuery({
    queryKey: ["docker-status"],
    queryFn: api.dockerStatus,
    refetchInterval: 10000
  });
  const containers = useQuery({
    queryKey: ["containers"],
    queryFn: api.containers,
    refetchInterval: 10000
  });
  useEffect(() => {
    if (status.data && containers.data) setDocker(status.data, containers.data);
  }, [containers.data, setDocker, status.data]);
  return { status, containers };
}

export function useContainerAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "start" | "stop" | "restart" }) =>
      api.containerAction(id, action),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["containers"] });
    }
  });
}
