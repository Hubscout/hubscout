"use client";

import { useProfile } from "@farcaster/auth-kit";

const FarcasterProfileInfo = () => {
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();

  return {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  };
};

export default FarcasterProfileInfo;
