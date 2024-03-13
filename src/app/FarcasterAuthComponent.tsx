"use client";
import "@farcaster/auth-kit/styles.css";
import "@/styles/index.scss";

import { AuthKitProvider, SignInButton, useProfile } from "@farcaster/auth-kit";

export default function FarcasterAuthComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "hubscout.xyz",
    siweUri: "https://hubscout.xyz/login",
  };

  return (
    <AuthKitProvider config={config}>
      <div className={`absolute top-4 right-4`}>
        <SignInButton />
      </div>
      {children}
    </AuthKitProvider>
  );
}
