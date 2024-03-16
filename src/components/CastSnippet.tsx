/* eslint-disable @next/next/no-img-element */

import { getRelativeTime } from "@/helpers/getRelativeTime";
import { imageList } from "@/helpers/utils";
import { like, recast, reply } from "@/svg";
import { FarcasterEmbed } from "react-farcaster-embed";
import "react-farcaster-embed/dist/styles.css"; // include default styles or write your own

export function CastSnippet({
  avatar,
  displayName,
  username,
  timestamp,
  text,
  showRail,
  embeds,
}: CastSnippetProps) {
  // Filter embeds to include only those whose URL ends with one of the image extensions
  let imageEmbeds = embeds
    ? embeds.filter((embed) => {
        // Extract the URL from the embed object
        const url = embed.url;
        if (!url) return false;
        // Check if the URL ends with one of the image extensions (case-insensitive)
        return imageList.some((extension) =>
          url.toLowerCase().endsWith(extension)
        );
      })
    : [];

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
        {imageEmbeds.length > 0 && (
          <img
            src={imageEmbeds[0].url} // Use the first image URL
            alt="Embedded content"
            className="max-w-full max-h-72 rounded-lg " // Adjust styling as needed
          />
        )}
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

interface Embeds {
  url: string;
}
interface CastSnippetProps {
  avatar?: string;
  displayName?: string;
  username?: string;
  timestamp?: string;
  text?: string;
  showRail?: boolean;
  embeds?: Embeds[];
}
