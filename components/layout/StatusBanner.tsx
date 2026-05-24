"use client";

import { AlertTriangle, Container } from "lucide-react";

import { useOrbitStore } from "@/store/orbitStore";

export function StatusBanner({ offline }: { offline: boolean }): JSX.Element | null {
  const docker = useOrbitStore((state) => state.docker);
  if (offline) {
    return (
      <div className="mx-4 mt-5 flex items-center gap-3 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger sm:mx-7">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Orbit backend is unreachable. Check your deployed API URL or start the local service.
      </div>
    );
  }
  if (docker && !docker.available) {
    return (
      <div className="mx-4 mt-5 flex items-center gap-3 rounded-xl border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber sm:mx-7">
        <Container className="h-4 w-4 shrink-0" />
        Docker monitoring is unavailable. Mount the Docker socket to enable containers and logs.
      </div>
    );
  }
  return null;
}
