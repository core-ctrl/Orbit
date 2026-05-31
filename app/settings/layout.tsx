import { SettingsSidebar } from "@/components/layout/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex">
      <SettingsSidebar />
      <main className="flex-1 ml-[240px]">
        {children}
      </main>
    </div>
  );
}
