"use client";
import "@/styles/index.scss";
import "@farcaster/auth-kit/styles.css";
import { AuthKitProvider, SignInButton } from "@farcaster/auth-kit";

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
      <div className="absolute top-4 right-4 bg-purple-500">
        <SignInButton />
      </div>
      {children}
    </AuthKitProvider>
  );
}
