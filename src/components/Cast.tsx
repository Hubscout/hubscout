import type { User, Cast as CastProps } from "@neynar/nodejs-sdk/build/neynar-api/v1";
import { CastSnippet } from "@/components/CastSnippet";
import Link from "next/link";

export function Cast({ parent, ...cast }: CastWithPossibleParent) {
  // if there is a parent, we want to show that first
  const first_cast: CastWithPossibleParent = parent ?? cast;
  // then, we show the cast or nothing if there's no parent
  const second_cast: CastWithPossibleParent | null = parent ? cast : null;
  // need to force the author types for now -- something's fucked with the types
  const first_author = first_cast.author as User;
  const second_author = (second_cast?.author as User) ?? null;

  const firstProps = {
    avatar: first_author.pfp.url,
    displayName: first_author.displayName,
    username: first_author.username,
    timestamp: first_cast.timestamp,
    text: first_cast.text,
    numLikes: first_cast.reactions.count,
    numReplies: first_cast.replies.count,
    numRecasts: first_cast.recasts.count,
    showRail: !!second_cast,
  };

  const secondProps = second_cast && {
    avatar: second_author.pfp.url,
    displayName: second_author.displayName,
    username: second_author.username,
    timestamp: second_cast.timestamp,
    text: second_cast.text,
    numLikes: second_cast.reactions.count,
    numReplies: second_cast.replies.count,
    numRecasts: second_cast.recasts.count,
  };

  return (
    <Link
      target="_blank"
      href={`https://warpcast.com/${first_author.username}/${first_cast.hash.slice(0, 8)}`}
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
