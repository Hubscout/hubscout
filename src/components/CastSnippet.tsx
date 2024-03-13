/* eslint-disable @next/next/no-img-element */

import { getRelativeTime } from "@/helpers/getRelativeTime";
import { like, recast, reply } from "@/svg";

export function CastSnippet({
  avatar,
  displayName,
  username,
  timestamp,
  text,
  showRail,
}: CastSnippetProps) {
  return (
    <div
      className="gap-3 w-full"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
      }}
    >
      <div className="col-fs-c w-9 gap-2 h-full">
        <img
          className="h-9 w-9 object-cover rounded-full"
          alt="@"
          src={avatar}
        />
        {showRail && (
          <div
            style={{ width: 2 }}
            className="rounded-full flex-1 mb-2 bg-slate-100"
          />
        )}
      </div>
      <div className="w-full col gap-1">
        <span className="row gap-1 text-slate-700 leading-5 text-sm">
          <span className="font-semibold">{displayName}</span>
          <span className="font-medium opacity-50">
            @{username} • {getRelativeTime(timestamp ?? 0)}
          </span>
        </span>
        <p
          className="text-sm font-medium font-slate-700 opacity-75 break-words w-full"
          style={{ wordBreak: "break-word" }}
        >
          {text}
        </p>
        <div />
        <div className="row text-sm gap-4 opacity-50 font-medium text-slate-700"></div>
        <div />
        <div />
      </div>
    </div>
  );
}

interface CastSnippetProps {
  avatar?: string;
  displayName?: string;
  username?: string;
  timestamp?: string;
  text?: string;
  showRail?: boolean;
}
