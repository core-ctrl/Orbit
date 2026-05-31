"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useSocket } from "@/hooks/useSocket";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Called once at layout level — singleton socket persists across all page navigations
  useSocket();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
