"use client";
import create from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      farcasterUser: null,
      setFarcasterUser: (farcasterUser) =>
        set((state) => ({ ...state, farcasterUser })),
    }),
    {
      name: "user-store", // unique name of the store
      getStorage: () => localStorage, // specify the storage to use (localStorage is the default)
    }
  )
);

export default useStore;
