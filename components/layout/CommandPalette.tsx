"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { 
  Search, Terminal, Flame, GitCommit, Activity, BarChart3, 
  Clock, Server, Container, Database, FileText, Bell, Settings, BookOpen, Keyboard
} from "lucide-react";

export function CommandPalette() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const projectId = params?.projectId as string;
  const baseUrl = projectId ? `/dashboard/${projectId}` : '';

  const [isOpen, setIsOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commandItems = [
    { name: "Go to Overview", href: "", icon: Server },
    { name: "Go to Issues", href: "/issues", icon: Terminal },
    { name: "Go to Incidents", href: "/incidents", icon: Flame },
    { name: "Go to Deployments", href: "/deployments", icon: GitCommit },
    { name: "Go to Performance APM", href: "/performance", icon: Activity },
    { name: "Go to Custom Metrics", href: "/metrics", icon: BarChart3 },
    { name: "Go to Uptime Monitors", href: "/uptime", icon: Clock },
    { name: "Go to Infrastructure", href: "/infrastructure", icon: Server },
    { name: "Go to Docker Status", href: "/docker", icon: Container },
    { name: "Go to Database Health", href: "/databases", icon: Database },
    { name: "Go to Log Explorer", href: "/logs", icon: FileText },
    { name: "Go to Alerts History", href: "/alerts", icon: Bell },
    { name: "Go to Project Settings", href: "/settings", icon: Settings },
  ];

  const filteredCommands = commandItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Toggle Command Palette with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
        setShowShortcuts(false);
        setSearch("");
        setSelectedIndex(0);
      }

      // 2. Toggle Keyboard Shortcuts Helper with ? (only if input is not focused)
      if (e.key === "?" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
        setIsOpen(false);
      }

      // 3. Escape key to close modals
      if (e.key === "Escape") {
        setIsOpen(false);
        setShowShortcuts(false);
      }

      // 4. Sequential keyboard shortcuts (e.g., g + i)
      if (e.key === "g" && document.activeElement?.tagName !== "INPUT") {
        const nextKeyHandler = (nextEvent: KeyboardEvent) => {
          if (nextEvent.key === "o") { e.preventDefault(); router.push(`${baseUrl}`); }
          else if (nextEvent.key === "i") { e.preventDefault(); router.push(`${baseUrl}/issues`); }
          else if (nextEvent.key === "c") { e.preventDefault(); router.push(`${baseUrl}/incidents`); }
          else if (nextEvent.key === "d") { e.preventDefault(); router.push(`${baseUrl}/deployments`); }
          else if (nextEvent.key === "p") { e.preventDefault(); router.push(`${baseUrl}/performance`); }
          else if (nextEvent.key === "m") { e.preventDefault(); router.push(`${baseUrl}/metrics`); }
          else if (nextEvent.key === "l") { e.preventDefault(); router.push(`${baseUrl}/logs`); }
          else if (nextEvent.key === "a") { e.preventDefault(); router.push(`${baseUrl}/alerts`); }
          else if (nextEvent.key === "s") { e.preventDefault(); router.push(`${baseUrl}/settings`); }
          
          window.removeEventListener("keydown", nextKeyHandler);
        };
        window.addEventListener("keydown", nextKeyHandler);
        // Timeout cleanup to prevent hanging listener
        setTimeout(() => window.removeEventListener("keydown", nextKeyHandler), 1500);
      }

      // 5. Arrow key navigation in command palette
      if (isOpen && filteredCommands.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          const target = filteredCommands[selectedIndex];
          if (target) {
            router.push(`${baseUrl}${target.href}`);
            setIsOpen(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showShortcuts, search, selectedIndex, filteredCommands, baseUrl]);

  if (!isOpen && !showShortcuts) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 pt-[15vh]">
      {/* 1. Command Palette Dialog */}
      {isOpen && (
        <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center px-4 border-b border-border bg-secondary/20">
            <Search className="w-5 h-5 text-text-muted shrink-0" />
            <input
              type="text"
              placeholder="Search views, routes, or commands..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent border-0 outline-none px-3 py-4 text-sm text-text-primary placeholder:text-text-muted"
              autoFocus
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto scrollbar p-2 space-y-0.5">
            {filteredCommands.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-6">No matching routes found.</p>
            ) : (
              filteredCommands.map((cmd, idx) => (
                <button
                  key={cmd.name}
                  onClick={() => {
                    router.push(`${baseUrl}${cmd.href}`);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${idx === selectedIndex ? "bg-accent text-white" : "text-text-secondary hover:text-text-primary hover:bg-hover"}`}
                >
                  <div className="flex items-center gap-3">
                    <cmd.icon className="w-4 h-4 shrink-0" />
                    <span>{cmd.name}</span>
                  </div>
                  <span className="text-[10px] opacity-60">Go</span>
                </button>
              ))
            )}
          </div>
          <div className="bg-secondary/40 border-t border-border px-4 py-2 flex justify-between text-[10px] text-text-muted">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span>Esc to close</span>
          </div>
        </div>
      )}

      {/* 2. Keyboard Shortcuts Helper Modal */}
      {showShortcuts && (
        <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl relative">
          <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-accent animate-pulse" /> Global Keyboard Shortcuts
          </h2>
          <div className="space-y-3">
            {[
              { keys: ["Cmd", "K"], label: "Toggle Command Palette" },
              { keys: ["?"], label: "Toggle Shortcuts Helper" },
              { keys: ["g", "o"], label: "Go to Overview" },
              { keys: ["g", "i"], label: "Go to Issues" },
              { keys: ["g", "c"], label: "Go to Incidents" },
              { keys: ["g", "d"], label: "Go to Deployments" },
              { keys: ["g", "p"], label: "Go to Performance" },
              { keys: ["g", "m"], label: "Go to Metrics" },
              { keys: ["g", "l"], label: "Go to Logs" },
              { keys: ["g", "a"], label: "Go to Alerts" },
              { keys: ["g", "s"], label: "Go to Settings" }
            ].map((shortcut, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                <span className="text-text-secondary">{shortcut.label}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((k, kIdx) => (
                    <kbd key={kIdx} className="bg-secondary border border-border text-text-primary px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shadow-sm">
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowShortcuts(false)}
              className="bg-accent hover:bg-accent-hover text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
