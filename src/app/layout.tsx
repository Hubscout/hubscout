import { WithProgressBar } from "@/components/WithProgressBar";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "@/styles/index.scss";

export const metadata: Metadata = {
  title: "Hubscout",
  description: "Farcaster Semantic Search Engine",
};

export const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WithProgressBar>{children}</WithProgressBar>
      </body>
    </html>
  );
}
