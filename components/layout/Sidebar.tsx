"use client";

import {
  Bell,
  Boxes,
  Database,
  Gauge,
  HardDrive,
  Logs,
  Radar,
  Settings,
  Waypoints,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useOrbitStore } from "@/store/orbitStore";

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  dockerOnly?: boolean;
}

const links: NavLink[] = [
  { href: "/", label: "Command Center", icon: Gauge },
  { href: "/docker", label: "Containers", icon: Boxes, dockerOnly: true },
  { href: "/endpoints", label: "Endpoints", icon: Radar },
  { href: "/databases", label: "Databases", icon: Database },
  { href: "/infrastructure", label: "Infrastructure", icon: HardDrive },
  { href: "/logs", label: "Logs", icon: Logs },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function Sidebar(): JSX.Element {
  const pathname = usePathname();
  const docker = useOrbitStore((state) => state.docker);
  const visibleLinks = links.filter((link) => !link.dockerOnly || docker?.available !== false);
  return (
    <aside className="border-b border-line bg-surface/80 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-7 lg:py-8">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-orbit/10 text-orbit">
          <Waypoints className="h-5 w-5" />
        </span>
        <div>
          <p className="text-lg font-semibold tracking-[0.24em]">ORBIT</p>
          <p className="text-xs text-muted">Observability Console</p>
        </div>
      </div>
      <nav className="scrollbar flex gap-1 overflow-auto px-3 pb-4 lg:block lg:px-4">
        {visibleLinks.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              href={href}
              key={href}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm transition lg:mb-1",
                active
                  ? "bg-orbit/10 text-orbit"
                  : "text-muted hover:bg-panel hover:text-ink"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
