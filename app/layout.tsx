import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "@/app/globals.css";
import { Providers } from "@/app/providers";
import { GeistSans } from "geist/font/sans";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "Orbit | SaaS Application Monitoring",
  description: "Monitor everything. Fix it before it breaks."
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-primary text-primary antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
