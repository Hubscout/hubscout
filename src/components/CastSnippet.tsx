/* eslint-disable @next/next/no-img-element */
"use client";
import { getRelativeTime } from "@/helpers/getRelativeTime";
import { generateFallbackAvatar, imageList, videoList } from "@/helpers/utils";
import "react-farcaster-embed/dist/styles.css"; // include default styles or write your own
import { WarpcastIcon } from "./icons";
import { useEffect, useState } from "react";
import Video from "./Video";

export function CastSnippet({
  avatar,
  displayName,
  username,
  timestamp,
  text,
  showRail,
  embeds,
  hash,
}: CastSnippetProps) {
  const [relativeTime, setRelativeTime] = useState(() =>
    getRelativeTime(timestamp ?? 0)
  );

  const [avatarUrl, setAvatarUrl] = useState<any>(avatar);

  // Handle image loading error
  const handleImageError = () => {
    let url = generateFallbackAvatar(username);
    setAvatarUrl(url); // Set to fallback URL
  };

  useEffect(() => {
    // This updates the relative time client-side, after initial hydration
    const timer = setInterval(() => {
      setRelativeTime(getRelativeTime(timestamp ?? 0));
    }, 60000); // Update every minute as an example

    return () => clearInterval(timer);
  }, [timestamp]);

  // Filter embeds to include only those whose URL ends with one of the image extensions
  let finishedEmbeds = embeds
    ? embeds.filter((embed) => {
        // Extract the URL from the embed object
        const url = embed.url;
        if (!url) return false;
        // Check if the URL ends with one of the image extensions (case-insensitive)
        return (
          imageList.some((extension) =>
            url.toLowerCase().endsWith(extension)
          ) ||
          videoList.some((extension) => url.toLowerCase().endsWith(extension))
        );
      })
    : [];

  let embed = finishedEmbeds && finishedEmbeds[0] ? finishedEmbeds[0] : null;

  let embedType = imageList.some((extension) =>
    embed?.url.toLowerCase().endsWith(extension)
  )
    ? "image"
    : "video";

  return (
    <div
      className="gap-3 w-full relative"
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
      }}
    >
      <div className="col-fs-c w-9 gap-2 h-full">
        <img
          className="h-9 w-9 object-cover rounded-full"
          alt="@"
          src={avatarUrl}
          onError={handleImageError}
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
            @{username} • {relativeTime}
          </span>
        </span>
        {embed && embedType === "image" ? (
          <img
            src={embed.url} // Use the first image URL
            alt="Embedded image"
            className="max-w-full max-h-72 rounded-lg " // Adjust styling as needed
          />
        ) : embed ? (
          <Video videoUrl={embed.url} />
        ) : null}
        <p
          className="text-sm font-medium font-slate-700 opacity-75 break-words w-full p-2"
          style={{ wordBreak: "break-word" }}
        >
          {text}
        </p>
        <a
          target="_blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
          href={`https://warpcast.com/${username}/${hash?.slice(0, 8)}`}
          className="absolute bottom-0 right-0" // Applied absolute positioning classes
        >
          <WarpcastIcon />
        </a>
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
  hash?: string;
}
