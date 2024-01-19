"use client";

import { arrow } from "@/svg";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initValue }: SearchBarProps) {
  const [value, setValue] = useState<string>(decodeURIComponent(initValue));
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    router.push(`/${encodeURIComponent(value)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full col">
      <div className="row-fs-c w-full gap-2">
        <input
          name="query"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for something semantically..."
          className="bg-slate-100 hasText:bg-white placeholder:text-slate-400 placeholder:font-medium border-2 border-slate-100 text-sm font-medium text-slate-800 pr-4 pl-4 focus:bg-white outline-none flex-1 h-10 rounded-full"
        />
        <button
          type="submit"
          className={classNames([
            "svg-large col-c-c rounded-full h-10 w-10 fill-white",
            {
              "opacity-25 pointer-none cursor-not-allowed": value.length < 3,
            },
          ])}
          style={{ backgroundColor: "#8562CE" }}
        >
          {arrow}
        </button>
      </div>
      <div className="opacity-75 col w-full border-2 border-transparent">
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
