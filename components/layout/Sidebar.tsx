"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard, AlertCircle, Activity, Clock, Server, Container,
  Database, FileText, Bell, Settings, BookOpen, ChevronDown,
  Flame, GitCommit, BarChart3, LogOut, Palette
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { api, clearToken } from "@/lib/api";
import type { Project } from "@/types/orbit";

const navSections = [
  {
    label: "Monitor",
    items: [
      { name: "Overview", href: "", icon: LayoutDashboard },
      { name: "Issues", href: "/issues", icon: AlertCircle },
      { name: "Incidents", href: "/incidents", icon: Flame },
      { name: "Performance", href: "/performance", icon: Activity },
      { name: "Metrics", href: "/metrics", icon: BarChart3 },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { name: "Uptime", href: "/uptime", icon: Clock },
      { name: "Infrastructure", href: "/infrastructure", icon: Server },
      { name: "Docker", href: "/docker", icon: Container },
      { name: "Databases", href: "/databases", icon: Database },
    ],
  },
  {
    label: "Explore",
    items: [
      { name: "Logs", href: "/logs", icon: FileText },
      { name: "Deployments", href: "/deployments", icon: GitCommit },
      { name: "Alerts", href: "/alerts", icon: Bell },
    ],
  },
];

export function Sidebar() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const baseUrl = projectId ? `/dashboard/${projectId}` : '';

  const [projectName, setProjectName] = useState("Orbit");
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [unresolvedCount, setUnresolvedCount] = useState<number | null>(null);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const fetchUnresolvedCount = useCallback(async () => {
    try {
      const data = await api.issues(projectId, { status: "unresolved" });
      if (Array.isArray(data)) {
        setUnresolvedCount(data.length);
      }
    } catch {}
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    const loadData = async () => {
      try {
        const projectData = await api.project(projectId);
        if (projectData?.name) setProjectName(projectData.name);

        if (projectData?.org_id) {
          const projects = await api.projects(projectData.org_id);
          if (Array.isArray(projects)) setProjectsList(projects);
        }
      } catch (err) {
        console.error(err);
      }

      try {
        const userData = await api.me();
        if (userData?.name) setUserName(userData.name);
        if (userData?.email) setUserEmail(userData.email);
      } catch {}
    };

    loadData();
    fetchUnresolvedCount();
    const interval = setInterval(fetchUnresolvedCount, 15000);
    return () => clearInterval(interval);
  }, [projectId, fetchUnresolvedCount]);

  const switchProject = (id: string) => {
    setShowProjectDropdown(false);
    const pathSegments = pathname.split("/");
    if (pathSegments.length > 3) {
      const restPath = pathSegments.slice(4).join("/");
      router.push(`/dashboard/${id}/${restPath || "issues"}`);
    } else {
      router.push(`/dashboard/${id}/issues`);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] border-r border-[var(--glass-border)] flex flex-col z-50"
      style={{ background: 'var(--gradient-sidebar)', backdropFilter: 'blur(20px)' }}
    >
      {/* Logo / Project Switcher */}
      <div className="relative flex items-center h-14 px-4 border-b border-[var(--glass-border)] justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'var(--gradient-accent)' }}
          >
            {projectName[0]?.toUpperCase() || "O"}
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate max-w-[110px]">
            {projectName}
          </span>
        </div>

        {projectsList.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 rounded-md hover:bg-[var(--glass-bg-hover)] transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            {showProjectDropdown && (
              <div className="absolute right-0 mt-2 w-48 glass-card-elevated py-1 z-50 animate-scale-in">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--glass-border)] mb-1">
                  Switch Project
                </div>
                {projectsList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => switchProject(p.id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[var(--glass-bg-hover)] truncate ${
                      p.id === projectId
                        ? "text-[var(--accent)] font-semibold"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar py-3 px-2 flex flex-col gap-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <div className="px-2 mb-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {section.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const fullHref = `${baseUrl}${item.href}`;
                const isActive =
                  pathname === fullHref ||
                  (item.href !== "" && pathname?.startsWith(fullHref));
                const hasBadge =
                  item.name === "Issues" &&
                  unresolvedCount !== null &&
                  unresolvedCount > 0;

                return (
                  <Link
                    key={item.name}
                    href={fullHref}
                    className={`sidebar-link ${isActive ? "active" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    {hasBadge && (
                      <Badge
                        variant="danger"
                        className="text-[10px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center font-semibold"
                      >
                        {unresolvedCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-[var(--glass-border)] flex flex-col gap-0.5">
        <Link
          href={`${baseUrl}/appearance`}
          className={`sidebar-link ${pathname?.includes("/appearance") ? "active" : ""}`}
        >
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4" />
            Appearance
          </div>
        </Link>
        <Link
          href="/settings"
          className={`sidebar-link ${pathname?.includes("/settings") ? "active" : ""}`}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4" />
            Settings
          </div>
        </Link>
        <Link
          href={`${baseUrl}/docs`}
          className="sidebar-link"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4" />
            Docs
          </div>
        </Link>

        {/* Theme & User */}
        <div className="mt-2 pt-2 border-t border-[var(--glass-border)] space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-[var(--text-muted)] uppercase font-semibold tracking-wider">Theme</span>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--glass-bg-hover)] transition-colors group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
              style={{ background: 'var(--gradient-accent)' }}
            >
              {userName[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <span className="text-xs font-medium text-[var(--text-primary)] truncate">{userName}</span>
              {userEmail && (
                <span className="text-[10px] text-[var(--text-muted)] truncate">{userEmail}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--glass-bg-elevated)] text-[var(--text-muted)] hover:text-[var(--danger)] transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
