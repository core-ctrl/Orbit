import { SettingsSidebar } from "@/components/layout/SettingsSidebar";
import { GlobalFooter } from "@/components/layout/GlobalFooter";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      <SettingsSidebar />
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <main className="flex-1 p-6">
          {children}
        </main>
        <GlobalFooter />
      </div>
    </div>
  );
}
