import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "RevenueLeak OS",
  description: "Opportunity-driven revenue recovery platform for home-service companies.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
