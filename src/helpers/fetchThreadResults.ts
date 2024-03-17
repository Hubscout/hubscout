import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";
import { subDays, subMonths, subWeeks, subYears } from "date-fns";

import supabase from "@/lib/supabase";
import OpenAI from "openai";
import { formatNeynarCast } from "./utils";
import { randomUUID } from "crypto";
import { getCastResultsInfo } from "./fetchCastResults";

export interface SearchResponse {
  thread: any;
}

export const maxDuration = 10; // This function can run for a maximum of 5 min
export const revalidate = 60 * 30; // 30 minutes

export async function fetchThreadInfo(hash: string) {
  let cast = await neynar.lookUpCastByHashOrWarpcastUrl(
    hash,
    "hash",
  );
  if (!cast || !cast.cast || !cast.cast.thread_hash) {
    return null;
  }
  const thread = await neynar.fetchAllCastsInThread(cast.cast.thread_hash);
  if (!thread || !thread.result || !thread.result.casts) {
    return null;
  }
  let threadCasts = thread.result.casts as any[];
  if (threadCasts.length === 0) {
    return null;
  }
  threadCasts = threadCasts.map((cast) => {
    cast.avatar = cast.author.pfp.url;
    cast.username = cast.author.username;
    cast.displayName = cast.author.displayName;
    cast.embeds = cast.embeds ?? [];
    return cast;
  });

  return threadCasts;
}

export async function fetchRecommendedCasts(hash: string, limit: number) {
  const { data, error } = await supabase.rpc("hybrid_search_neighbors", {
    cast_hash: hash,
    match_count: limit ?? 5,
  });
  if (error) {
    console.log("error in fetchRecommendedCasts", error);
    return [];
  }
  const casts = await getCastResultsInfo(data);
  return casts;
}
export async function fetchThreadResults(
  hash: string,
): Promise<SearchResponse> {
  const startTimeRequest = Date.now();
  // const requestId = randomUUID();

  let finishedHash = decodeURIComponent(hash);
  try {
    let [thread] = await Promise.all([
      await fetchThreadInfo(finishedHash.slice(2)),
    ]);

    const endTimeRequest = Date.now();
    const totalDuration = endTimeRequest - startTimeRequest;
    console.log("Total duration", totalDuration, "ms");

    return {
      thread,
    };
  } catch (e) {
    //still log the error

    console.log("error in fetchcast", e);
    return { thread: [] };
  }
}

export async function _fetchResultForCast(hash_partial: string) {
  // reconstruct the hash
  const hash = `${hash_partial}`;

  let attempt = 0;
  const maxAttempts = 3; // You can adjust the max attempts as needed

  while (attempt < maxAttempts) {
    try {
      // grab the cast in question
      const neynarResult = await neynar.lookUpCastByHash(hash);
      const cast: CastWithPossibleParent = neynarResult?.result?.cast ?? null;
      return cast;
    } catch (error: any) {
      return null;
    }
  }
}

export async function _fetchResultForHash(hash_partial: string) {
  // reconstruct the hash

  const cast = await _fetchResultForCast(hash_partial);

  if (!cast) return null;

  // grab the thread hash
  const threadHash = cast?.threadHash;

  // if there's a parent_hash, grab the parent
  if (cast?.hash && threadHash !== cast?.hash) {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        cast.parent = formatNeynarCast(
          await neynar
            .lookUpCastByHash(threadHash)
            .then((r) => r.result?.cast ?? undefined),
        );
      } catch (error: any) {
        console.log("error in fetchResultForHash", error);
      }
    }
  }

  // return the cast
  return cast;
}

const nResults = 5;
