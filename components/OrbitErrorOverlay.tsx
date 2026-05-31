"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Bug, ChevronDown, ExternalLink, X } from "lucide-react";

export interface OrbitErrorItem {
  id: string;
  message: string;
  type?: string;
  stack?: string;
  url?: string;
  release?: string;
  environment?: Record<string, unknown>;
  timestamp: string;
}

export interface OrbitErrorOverlayProps {
  errors: OrbitErrorItem[];
  onDismiss?: (id: string) => void;
  onDisable?: () => void;
  onReport?: (error: OrbitErrorItem) => void;
  position?: "bottom-right" | "top-right" | "bottom-left";
}

const positionClasses: Record<NonNullable<OrbitErrorOverlayProps["position"]>, string> = {
  "bottom-right": "bottom-4 right-4",
  "top-right": "right-4 top-4",
  "bottom-left": "bottom-4 left-4",
};

function formatEnvironment(environment?: Record<string, unknown>): string {
  if (!environment) return "Unknown runtime";
  const browser = typeof environment.browser === "string" ? environment.browser : null;
  const os = typeof environment.os === "string" ? environment.os : null;
  return [browser, os].filter(Boolean).join(" on ") || "Captured runtime";
}

export function OrbitErrorOverlay({
  errors,
  onDismiss,
  onDisable,
  onReport,
  position = "bottom-right",
}: OrbitErrorOverlayProps): JSX.Element | null {
  const [expanded, setExpanded] = useState(true);
  const visibleErrors = useMemo(() => errors.slice(0, 5), [errors]);

  if (visibleErrors.length === 0) return null;

  const latest = visibleErrors[0];

  return (
    <aside
      className={`fixed z-[100] w-[min(420px,calc(100vw-32px))] overflow-hidden rounded-[22px] border border-red-300/20 bg-[#120909]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl ${positionClasses[position]}`}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex w-full items-center justify-between border-b border-white/10 p-4 text-left"
      >
        <span className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-red-400/15 text-red-200">
            <Bug className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-sm font-black uppercase tracking-[0.14em]">Orbit caught an error</span>
            <span className="block max-w-[280px] truncate text-xs text-white/55">{latest.message}</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded ? (
        <div className="max-h-[420px] overflow-y-auto p-3">
          <div className="mb-3 rounded-[16px] border border-red-300/15 bg-red-400/10 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-200" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{latest.type ?? "Unhandled error"}</p>
                <p className="mt-1 text-xs leading-5 text-white/62">{latest.message}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/35">
                  {formatEnvironment(latest.environment)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {visibleErrors.map((error) => (
              <div key={error.id} className="rounded-[14px] border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{error.message}</p>
                    <p className="mt-1 text-[11px] text-white/40">
                      {new Date(error.timestamp).toLocaleTimeString()} {error.release ? `- ${error.release}` : ""}
                    </p>
                  </div>
                  {onDismiss ? (
                    <button
                      type="button"
                      onClick={() => onDismiss(error.id)}
                      className="rounded-full p-1 text-white/40 transition hover:bg-white/10 hover:text-white"
                      aria-label="Dismiss error"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            {onReport ? (
              <button
                type="button"
                onClick={() => onReport(latest)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase text-black transition hover:bg-[#a7ff2f]"
              >
                Report
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            ) : null}
            {onDisable ? (
              <button
                type="button"
                onClick={onDisable}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-black uppercase text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Disable
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
