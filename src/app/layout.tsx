import "@farcaster/auth-kit/styles.css";
import { WithProgressBar } from "@/components/WithProgressBar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "@/styles/index.scss";
import { RouteChangeListener } from "./route-change-listener";
import FarcasterAuthComponent from "./FarcasterAuthComponent";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <FarcasterAuthComponent>
          <WithProgressBar>{children}</WithProgressBar>
          <Analytics />
          <RouteChangeListener />
        </FarcasterAuthComponent>
      </body>
    </html>
  );
}
