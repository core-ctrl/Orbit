"use client";

import { Play, RotateCw, Square } from "lucide-react";

import { useContainerAction } from "@/hooks/useDocker";

export function ContainerActions({ id }: { id: string }): JSX.Element {
  const action = useContainerAction();
  const run = (operation: "start" | "stop" | "restart"): void => {
    action.mutate({ id, action: operation });
  };
  return (
    <div className="flex gap-2">
      <button onClick={() => run("start")} disabled={action.isPending} type="button" aria-label="Start" className="rounded-lg border border-line p-2 text-muted hover:text-orbit disabled:opacity-50">
        <Play className="h-4 w-4" />
      </button>
      <button onClick={() => run("stop")} disabled={action.isPending} type="button" aria-label="Stop" className="rounded-lg border border-line p-2 text-muted hover:text-danger disabled:opacity-50">
        <Square className="h-4 w-4" />
      </button>
      <button onClick={() => run("restart")} disabled={action.isPending} type="button" aria-label="Restart" className="rounded-lg border border-line p-2 text-muted hover:text-amber disabled:opacity-50">
        <RotateCw className="h-4 w-4" />
      </button>
    </div>
  );
}
