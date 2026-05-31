"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, clearToken } from "@/lib/api";

export default function DashboardRoot() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const orgs = await api.organizations();

        if (orgs.length === 0) {
          router.push("/onboarding");
          return;
        }

        const firstOrg = orgs[0];
        const projects = await api.projects(firstOrg.id);

        if (projects.length === 0) {
          router.push("/onboarding");
          return;
        }

        router.push(`/dashboard/${projects[0].id}/issues`);
      } catch {
        clearToken();
        router.push("/login");
      }
    };
    init();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading dashboard...</p>
      </div>
    </div>
  );
}
