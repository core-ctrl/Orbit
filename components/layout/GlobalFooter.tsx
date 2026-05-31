import Link from "next/link";
import { Orbit } from "lucide-react";

export function GlobalFooter() {
  return (
    <footer className="mt-auto py-6 px-6 text-xs text-text-muted flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-4 border-t border-border/50">
      <div className="flex items-center gap-2 lg:mr-4 mb-2 lg:mb-0">
        <Orbit className="h-4 w-4" />
        <span>&copy; {new Date().getFullYear()} Core-Ctrl, Inc.</span>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link href="/legal/terms" className="hover:text-text-primary transition-colors">Terms</Link>
        <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
        <Link href="/legal/security" className="hover:text-text-primary transition-colors">Security</Link>
        <Link href="/status" className="hover:text-text-primary transition-colors">Status</Link>
        <Link href="https://github.com/core-ctrl/Orbit/issues" className="hover:text-text-primary transition-colors">Community</Link>
        <Link href="/docs" className="hover:text-text-primary transition-colors">Docs</Link>
        <Link href="mailto:support@core-ctrl.com" className="hover:text-text-primary transition-colors">Contact</Link>
        <button className="hover:text-text-primary transition-colors cursor-pointer">Manage cookies</button>
        <button className="hover:text-text-primary transition-colors cursor-pointer">Do not share my personal information</button>
      </div>
    </footer>
  );
}
