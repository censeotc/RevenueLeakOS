import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "RevenueLeak OS",
  description: "Opportunity-centered revenue recovery workspace for home-service operators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
