"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";
import { StatusBanner } from "@/components/layout/StatusBanner";
import { TopBar } from "@/components/layout/TopBar";
import { useDocker } from "@/hooks/useDocker";
import { useEndpoints } from "@/hooks/useEndpoints";
import { useHealth } from "@/hooks/useHealth";
import { useInfra } from "@/hooks/useInfra";
import { useSocket } from "@/hooks/useSocket";
import { getToken } from "@/lib/api";

export function DashboardShell({ children }: { children: ReactNode }): JSX.Element | null {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const infra = useInfra();
  useDocker();
  useEndpoints();
  useHealth();
  useSocket();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar />
        <StatusBanner offline={infra.isError} />
        <main className="p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
