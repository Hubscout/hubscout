"use client";
import "@farcaster/auth-kit/styles.css";
import "@/styles/index.scss";
import { AuthKitProvider } from "@farcaster/auth-kit";

import FarcasterSignIn from "./FarcasterSignIn";

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
      {/* <div className={`fixed top-4 right-4 bg-purple-500`}>
        <FarcasterSignIn />
      </div> */}
      {children}
    </AuthKitProvider>
  );
}
