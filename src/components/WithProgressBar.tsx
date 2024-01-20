"use client";

import { Next13ProgressBar } from "next13-progressbar";

export function WithProgressBar({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Next13ProgressBar color="#8562CE" />
    </>
  );
}
