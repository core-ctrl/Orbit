import { cn } from "@/lib/utils";
import React from "react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon, className, ...props }: StatCardProps) {
  return (
    <div className={cn("p-5 rounded-lg border border-border bg-card hover:border-border-hover transition-colors flex flex-col gap-2", className)} {...props}>
      <div className="flex items-center justify-between text-text-secondary">
        <span className="text-[13px] font-medium">{title}</span>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-text-primary">{value}</span>
        {subtitle && <span className="text-[13px] text-text-muted">{subtitle}</span>}
      </div>
    </div>
  );
}
