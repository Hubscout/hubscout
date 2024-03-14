"use client";
import { SignInButton, useProfile, useSignIn } from "@farcaster/auth-kit";

const FarcasterSignIn = () => {
  const {
    isAuthenticated,
    profile: { username, fid, bio, displayName, pfpUrl },
  } = useProfile();
  const { signIn, signOut, data } = useSignIn({
    onSuccess: ({ fid }) => console.log("Your fid:", fid),
  });

  return (
    <div className="w-full">
      {isAuthenticated ? (
        <button
          className={` bg-purple-500 w-32 p-2 `}
          onClick={() => {
            signOut();
          }}
        >
          <div className="flex flex-row text-center items-center w-3/4 justify-between">
            <img src={pfpUrl} className="w-12 h-11 rounded-full" />
            <p className="text-xs text-white">@{username}</p>
          </div>
        </button>
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default FarcasterSignIn;
