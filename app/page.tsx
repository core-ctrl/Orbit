"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { WidgetGrid } from "@/components/widgets/WidgetGrid";
import { useLogs } from "@/hooks/useLogs";

export default function CommandCenterPage(): JSX.Element {
  useLogs();
  return (
    <DashboardShell>
      <WidgetGrid />
    </DashboardShell>
  );
}
