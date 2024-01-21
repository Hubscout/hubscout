import { WithProgressBar } from "@/components/WithProgressBar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/index.scss";
import posthog from "posthog-js";

export const metadata: Metadata = {
  title: "Hubscout",
  description: "Farcaster Semantic Search Engine",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  posthog.init(process.env.POSTHOG_URL as string, {
    api_host: "https://us.posthog.com",
  });

  return (
    <html lang="en">
      <body className={inter.className}>
        <WithProgressBar>{children}</WithProgressBar>
        <Analytics />
      </body>
    </html>
  );
}
