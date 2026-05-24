"use client";

import { LogOut, Radio } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { clearToken } from "@/lib/api";
import { useOrbitStore } from "@/store/orbitStore";

const headings: Record<string, string> = {
  "/": "Command Center",
  "/docker": "Docker Containers",
  "/endpoints": "Endpoint Monitoring",
  "/databases": "Database Health",
  "/infrastructure": "Infrastructure",
  "/logs": "Live Logs",
  "/alerts": "Alert Feed",
  "/settings": "Settings"
};

export function TopBar(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const connected = useOrbitStore((state) => state.connected);
  const title = headings[pathname] ?? "Orbit";

  const logout = (): void => {
    clearToken();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-7">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Monitoring</p>
        <h1 className="mt-1 text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-line bg-panel px-3 py-2 text-xs text-muted sm:flex">
          <Radio className={connected ? "h-3.5 w-3.5 text-orbit" : "h-3.5 w-3.5 text-amber"} />
          {connected ? "Live" : "Connecting"}
        </div>
        <button
          type="button"
          onClick={logout}
          aria-label="Sign out"
          className="rounded-xl border border-line bg-panel p-2.5 text-muted transition hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
