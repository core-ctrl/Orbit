import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "@/app/globals.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "Orbit | Monitoring Command Center",
  description: "Self-hosted application and container monitoring."
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-canvas font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
