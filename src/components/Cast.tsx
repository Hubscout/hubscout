"use client";
import type { Cast as CastProps } from "@neynar/nodejs-sdk/build/neynar-api/v1";
import { CastSnippet } from "@/components/CastSnippet";
import Link from "next/link";
import { sendEventToAmplitude } from "@/lib/amplitude";
import { getUserId } from "@/helpers/utils";
export function Cast({ parent, ...cast }: CastWithPossibleParent) {
  // if there is a parent, we want to show that first
  const first_cast: CastWithPossibleParent = parent ?? cast;

  // then, we show the cast or nothing if there's no parent
  const second_cast: CastWithPossibleParent | null = parent ? cast : null;

  // need to force the author types for now -- something's fucked with the types
  const first_author = first_cast.author as any;
  const second_author = (second_cast?.author as any) ?? null;

  const firstProps = {
    avatar: first_author.pfp_url as any,
    displayName: first_author.display_name,
    username: first_author.username,
    timestamp: first_cast.timestamp,
    text: first_cast.text,
    showRail: !!second_cast,
    embeds: first_cast.embeds,
    hash: first_cast.hash,
  };

  const secondProps = second_cast && {
    avatar: second_author.pfp_url as any,
    displayName: second_author.display_name,
    username: second_author.username,
    timestamp: second_cast.timestamp,
    text: second_cast.text,
    embeds: second_cast.embeds,
    hash: second_cast.hash,
  };

  return (
    <Link
      // target="_blank"
      onClick={async () => {
        try {
          const userId = getUserId();
          await sendEventToAmplitude(userId, "click_query_cast", {
            hash: first_cast.hash,
          });
        } catch (e) {
          console.error(e);
        }
      }}
      href={`/cast/${first_cast.hash}`}
      // href={`https://warpcast.com/${first_author.username}/${first_cast.hash.slice(0, 8)}`}
      className="border-2 border-slate-100 cursor-pointer hover:border-slate-200 w-full p-3 rounded-xl"
    >
      {first_cast && <CastSnippet {...firstProps} />}
      {second_cast && <CastSnippet {...secondProps} />}
    </Link>
  );
}

export interface CastWithPossibleParent extends CastProps {
  [x: string]: any;
  parent?: CastProps;
}
