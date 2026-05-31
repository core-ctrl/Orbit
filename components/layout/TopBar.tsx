"use client";

import { useState } from "react";
import { Bell, Activity, Server, Cpu, HardDrive, Check } from "lucide-react";
import { useOrbitStore } from "@/store/orbitStore";
import { formatDistanceToNow } from "date-fns";

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const connected = useOrbitStore((s) => s.connected);
  const alerts = useOrbitStore((s) => s.alerts);
  const system = useOrbitStore((s) => s.system);

  const unread = alerts.slice(0, 5);

  return (
    <header className="h-16 border-b border-border bg-primary/40 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* Status Indicator */}
        <div className="flex items-center gap-2.5 glass-card px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full z-10 ${connected ? "bg-emerald-400" : "bg-red-500"}`} />
            {connected && <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />}
          </div>
          <span className="text-[13px] font-medium text-text-primary hidden sm:block">
            {connected ? "System Online" : "Disconnected"}
          </span>
        </div>

        {/* System Metrics */}
        {system ? (
          <div className="hidden md:flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Cpu className="w-3.5 h-3.5 text-accent" />
              <span>CPU:</span>
              <span className={`${system.cpu_percent > 80 ? "text-red-400" : "text-text-primary"}`}>
                {system.cpu_percent.toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <HardDrive className="w-3.5 h-3.5 text-accent" />
              <span>RAM:</span>
              <span className={`${system.memory_percent > 85 ? "text-red-400" : "text-text-primary"}`}>
                {system.memory_percent.toFixed(0)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <div className="h-4 w-16 skeleton rounded" />
            <div className="h-4 w-16 skeleton rounded" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {system && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-text-muted glass-card px-3 py-1.5 rounded-full border-border/50">
            <Server className="w-3.5 h-3.5" />
            {system.hostname}
          </div>
        )}
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full glass-card hover:bg-white/10 flex items-center justify-center text-text-secondary relative transition-colors shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unread.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-primary rounded-full text-[9px] text-white flex items-center justify-center font-bold shadow-sm">
                {unread.length > 9 ? "9+" : unread.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 glass-card-elevated rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="p-3.5 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
                <span className="font-semibold text-sm text-text-primary flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  Alerts
                </span>
                {unread.length > 0 && (
                  <span className="text-[10px] bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {unread.length} New
                  </span>
                )}
              </div>
              
              {unread.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-1">
                    <Check className="w-6 h-6 text-emerald-500" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">All Clear</span>
                  <span className="text-xs text-text-muted">System is healthy and nominal</span>
                </div>
              ) : (
                <div className="divide-y divide-border/50 max-h-[350px] overflow-y-auto">
                  {unread.map((a) => (
                    <div key={a.id} className="p-3.5 hover:bg-white/5 transition-colors cursor-default group">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-text-primary group-hover:text-white transition-colors line-clamp-1">
                          {a.title}
                        </span>
                        <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          a.severity === "critical" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                          a.severity === "warning" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                          "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        }`}>{a.severity}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{a.message}</p>
                      <div className="text-[10px] font-medium text-text-muted mt-2 flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-border" />
                        {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
