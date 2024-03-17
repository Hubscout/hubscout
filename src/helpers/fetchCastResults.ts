import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";
import { subDays, subMonths, subWeeks, subYears } from "date-fns";

import supabase from "@/lib/supabase";
import OpenAI from "openai";
import { formatNeynarCast } from "./utils";
import { randomUUID } from "crypto";

export interface SearchResponse {
  casts: CastWithPossibleParent[];
  requestId: string;
}

export const maxDuration = 10; // This function can run for a maximum of 5 min
export const revalidate = 60 * 30; // 30 minutes

export async function getCastResultsInfo(casts: any): Promise<any[]> {
  let cast_ids = casts.map((d: any) =>
    d.hash ? d.hash.replace("\\", "0") : null
  );
  if (!cast_ids || !cast_ids.length) {
    return [];
  }
  const castsData = await neynar.fetchBulkCasts(cast_ids);
  if (
    !castsData || !castsData.result || !castsData.result.casts ||
    !castsData.result.casts.length
  ) {
    return [];
  }
  let cast_results = castsData.result.casts.map((cast) => {
    return {
      ...cast,
      avatar: cast.author.pfp_url,
      username: cast.author.username,
      displayName: cast.author.display_name,
      embeds: cast.embeds ?? [],
    };
  }) as any[];

  let parentHashes = Array.from(
    new Set(
      cast_results.map((c) =>
        c.thread_hash && c.thread_hash !== c.hash ? c.thread_hash : null
      ).filter(Boolean),
    ),
  );

  if (!parentHashes.length) return cast_results;

  let parentCastsData = await neynar.fetchBulkCasts(parentHashes);
  let parentCasts = parentCastsData.result.casts as any[];
  let parentCastsMap = new Map(parentCasts.map((c) => [c.hash, c]));

  cast_results.forEach((cast) => {
    if (
      cast.thread_hash && parentCastsMap.has(cast.thread_hash) &&
      cast.thread_hash !== cast.hash
    ) {
      cast.parent = parentCastsMap.get(cast.thread_hash);
    } else {
      cast.parent = null;
    }
  });

  return cast_results;
}

export async function fetchCastResults(
  query: string,
  timeQuery?: "day" | "week" | "month" | "three_months" | "year" | null,
  channel?: string | null,
  author?: string | null,
  fid?: string | null,
  limit?: number | null,
  offset?: number | null,
): Promise<SearchResponse> {
  const startTimeRequest = Date.now();
  const requestId = randomUUID();
  let startTime: Date | null = null;

  if (timeQuery) {
    const now = new Date();
    switch (timeQuery) {
      case "day":
        startTime = subDays(now, 1);
        break;
      case "week":
        startTime = subWeeks(now, 1);
        break;
      case "month":
        startTime = subMonths(now, 1);
        break;
      case "three_months":
        startTime = subMonths(now, 3);
        break;
      case "year":
        startTime = subYears(now, 1);
        break;
      default:
        startTime = null;
    }
  }
  let finishedQuery = decodeURIComponent(query);
  let queryEmbedding = null;
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: finishedQuery,
      dimensions: 512,
    });
    console.log(channel);
    queryEmbedding = embedding.data[0].embedding;
    let { data, error } = await supabase.rpc("hybrid_search", {
      query_text: finishedQuery,
      query_embedding: queryEmbedding,
      match_count: limit ?? nResults,
      optional_timestamp: startTime,
      offset_count: offset ?? 0,
      optional_parent_url: channel ? decodeURIComponent(channel) : null,
      // userfid: fid ? parseInt(fid) : 3,
      author_fid: author ? parseInt(author) : null,
    });

    if (error) {
      console.log("error in fetchcast", error);
      return { casts: [], requestId: requestId };
    }

    if (!data || !data.length) return { casts: [], requestId: requestId };

    const cast_results = await getCastResultsInfo(data);

    const endTimeRequest = Date.now();
    const totalDuration = endTimeRequest - startTimeRequest;
    try {
      const addRequest = await supabase.from("requests").insert(
        {
          id: requestId,
          feedback: 0,
          results: cast_results,
          embedding: queryEmbedding,
          text: finishedQuery,
          time: totalDuration,
          timestamp: startTime,
          channel: channel,
          user_fid: fid,
          author_fid: author,
        },
      );
    } catch (e) {
      console.log("error in addRequest", e);
    }

    return {
      casts: cast_results,
      requestId: requestId,
    };
  } catch (e) {
    //still log the error
    const endTimeRequest = Date.now();
    const totalDuration = endTimeRequest - startTimeRequest;
    try {
      const addRequest = await supabase.from("requests").insert(
        {
          id: requestId,
          feedback: 0,
          results: [],
          embedding: queryEmbedding,
          text: finishedQuery,
          time: totalDuration,
          timestamp: startTime,
          channel: channel,
          user_fid: fid,
          author_fid: author,
        },
      );
    } catch (e) {
      console.log("error in addRequest", e);
    }

    console.log("error in fetchcast", e);
    return { casts: [], requestId: requestId };
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
  if (!threadHash) return cast;

  // if there's a parent_hash, grab the parent
  if (cast?.hash && threadHash.toLowerCase() !== cast?.hash.toLowerCase()) {
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

const nResults = 100;
