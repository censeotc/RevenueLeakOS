import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RevenueLeakOS — Stop Losing Revenue",
    template: "%s | RevenueLeakOS",
  },
  description:
    "RevenueLeakOS helps service businesses recover missed calls, unanswered estimates, and lost customers through automated follow-up workflows.",
  keywords: ["revenue recovery", "HVAC software", "service business CRM", "estimate follow-up", "missed call recovery"],
  openGraph: {
    title: "RevenueLeakOS — Stop Losing Revenue",
    description: "Recover missed calls, unanswered estimates, and lost customers automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
