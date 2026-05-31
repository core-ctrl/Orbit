"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { clearToken } from "@/lib/api";

const settingsSections = [
  {
    label: "Account",
    items: [
      { name: "Account Details", href: "/settings/account" },
      { name: "Security", href: "/settings/account/security" },
      { name: "Notifications", href: "/settings/account/notifications" },
      { name: "Email Addresses", href: "/settings/account/emails" },
      { name: "Subscriptions", href: "/settings/account/subscriptions" },
      { name: "Authorized Applications", href: "/settings/account/authorized-apps" },
      { name: "Identities", href: "/settings/account/identities" },
      { name: "Close Account", href: "/settings/account/close" },
    ],
  },
  {
    label: "Organization",
    items: [
      { name: "General Settings", href: "/settings/organization" },
      { name: "Stats & Usage", href: "/settings/organization/stats" },
      { name: "Projects", href: "/settings/organization/projects" },
      { name: "Teams", href: "/settings/organization/teams" },
      { name: "Members", href: "/settings/organization/members" },
      { name: "Security & Privacy", href: "/settings/organization/security" },
      { name: "Auth", href: "/settings/organization/auth" },
      { name: "Audit Log", href: "/settings/organization/audit-log" },
      { name: "API Keys", href: "/settings/organization/api-keys" },
    ],
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearToken();
    router.push("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] border-r border-[var(--glass-border)] flex flex-col z-50 bg-bg-primary">
      {/* Header / Back Button */}
      <div className="flex items-center h-14 px-4 border-b border-[var(--glass-border)]">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors w-full"
        >
          <ChevronLeft className="w-4 h-4" />
          Settings
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar py-4 px-3 flex flex-col gap-6">
        {settingsSections.map((section) => (
          <div key={section.label}>
            <div className="px-3 mb-2 text-[13px] font-bold text-[var(--text-primary)] flex items-center justify-between">
              {section.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                      isActive 
                        ? "bg-[var(--accent)] text-white font-medium shadow-glow" 
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)]"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[var(--glass-border)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-danger/10 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
