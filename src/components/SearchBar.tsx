"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initValue }: SearchBarProps) {
  const [value, setValue] = useState<string>(decodeURIComponent(initValue));
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full col">
      <input
        name="query"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for something semantically..."
        className="bg-slate-50 hasText:bg-white placeholder:text-slate-400 placeholder:font-medium border-2 border-slate-50 text-sm font-medium text-slate-800 pr-4 pl-4 focus:bg-white outline-none w-full h-10 rounded-full"
      />
      <div className="opacity-50 col w-full border-2 border-transparent">
        <div className="h-2" />
        <span className="pl-4 text-xs font-semibold uppercase text-slate-400">Tap enter to search</span>
        <div className="h-1" />
        <span className="pl-4 text-xs font-semibold uppercase text-slate-400">
          DC{" "}
          <Link style={{ color: "#8562CE" }} target="_blank" href="https://warpcast.com/matthew">
            Matthew
          </Link>{" "}
          or{" "}
          <Link style={{ color: "#8562CE" }} target="_blank" href="https://warpcast.com/kevinoconnell">
            Kevin
          </Link>{" "}
          for API
        </span>
      </div>
    </form>
  );
}

export interface SearchBarProps {
  initValue: string;
}
