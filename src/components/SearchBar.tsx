"use client";

import { useRouter } from "next13-progressbar";
import classNames from "classnames";
import { useState } from "react";
import { arrow } from "@/svg";
import { constructHref } from "./UsernameFilter";
import { sendEventToAmplitude } from "@/lib/amplitude";
import { getUserId } from "@/helpers/utils";
import FarcasterProfileInfo from "@/app/FarcasterProfileInfo";

export function SearchBar({ initValue, time, channel, fid }: SearchBarProps) {
  const [value, setValue] = useState<string>(decodeURIComponent(initValue));
  const router = useRouter();
  const {
    isAuthenticated,
    profile: { username, fid: userFid, bio, displayName, pfpUrl },
  } = FarcasterProfileInfo();

  async function onSubmit(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      const userId = getUserId();
      await sendEventToAmplitude(userId, "search", {
        query: decodeURIComponent(value),
      });
    } catch (e) {
      console.error(e);
    }
    router.push(`${constructHref(value, time, channel, fid, userFid ?? null)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full row-fs-c w-full gap-2">
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
    </form>
  );
}

export interface SearchBarProps {
  initValue: string;
  time?: string | null;
  channel?: string | null;
  fid?: string | null;
}
