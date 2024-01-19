/* eslint-disable @next/next/no-img-element */

import { getRelativeTime } from "@/helpers/getRelativeTime";
import { like, recast, reply } from "@/svg";

export function CastSnippet({
  avatar,
  displayName,
  username,
  timestamp,
  text,
  numLikes,
  numReplies,
  numRecasts,
  showRail,
}: CastSnippetProps) {
  return (
    <div
      className="gap-3"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
      }}
    >
      <div className="col-fs-c gap-2 h-full">
        <img className="h-9 w-9 object-cover rounded-full" alt="@" src={avatar} />
        {showRail && <div style={{ width: 2 }} className="rounded-full flex-1 mb-2 bg-slate-100" />}
      </div>
      <div className="flex-1 col gap-1">
        <span className="row gap-1 text-slate-700 leading-5 text-sm">
          <span className="font-semibold">{displayName}</span>
          <span className="font-medium opacity-50">
            @{username} • {getRelativeTime(timestamp ?? 0)}
          </span>
        </span>
        <span className="text-sm font-medium font-slate-700 opacity-75">{text}</span>
        <div />
        <div className="row text-sm gap-4 opacity-50 font-medium text-slate-700">
          <div className="svg-small row-c-c gap-1">
            {like} {numLikes}
          </div>
          <div className="svg-small row-c-c gap-1">
            {recast} {numRecasts}
          </div>
          <div className="svg-small row-c-c gap-1">
            {reply} {numReplies}
          </div>
        </div>
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
  numLikes?: number;
  numReplies?: number;
  numRecasts?: number;
  showRail?: boolean;
}
