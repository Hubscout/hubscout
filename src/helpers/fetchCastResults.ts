import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";
import { subDays, subMonths, subWeeks, subYears } from "date-fns";

import supabase from "@/lib/supabase";
import OpenAI from "openai";
export const maxDuration = 10; // This function can run for a maximum of 5 min
export async function fetchCastResults(
  query: string,
  timeQuery?: "day" | "week" | "month" | "three_months" | "year" | null,
  channel?: string | null,
  author?: string | null,
): Promise<CastWithPossibleParent[]> {
  try {
    // Determine the start timestamp based on the time query
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
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: finishedQuery,
    });
    const queryEmbedding = embedding.data[0].embedding;

    const params = {
      query_embedding: queryEmbedding,
      n_results: nResults,
      channel,
      filter_timestamp: startTime,
      author,
      fid: null,
    };

    const { data, error } = await supabase.rpc(
      "get_casts_embeddings_dynamic",
      params,
    );

    // // grab the results for the search
    // const results = await collection.query({
    //   nResults,
    //   queryTexts: [],
    //   where: startTime
    //     ? // timestamp: { $gte: startTime.getTime() },
    //       // username: { $eq: "dwr" },
    //       {
    //         timestamp: {
    //           $gt: startTime.getTime(),
    //         },
    //       }
    //     : undefined,
    // });
    // console.log("results", results);

    if (!data || !data.length) return [];
    // grab the casts + their replies from the hashes
    let cast_ids = data.map((d: any) => d.id);
    // fetch the results
    const cast_results = await Promise.all(
      cast_ids.map(_fetchResultForHash),
    );

    // return the results
    return cast_results.filter((f) => f !== null) as CastWithPossibleParent[];
  } catch (e) {
    console.log("error in fetchcast", e);
    return [];
  }
}

export async function _fetchResultForCast(hash_partial: string) {
  // reconstruct the hash
  const hash = `${hash_partial}`;

  // grab the cast in question
  const neynarResult = await neynar.lookUpCastByHash(hash);
  const cast: CastWithPossibleParent = neynarResult?.result?.cast ?? null;

  // if there's no cast, return null
  if (!cast) return null;

  return cast;
}

export async function _fetchResultForHash(hash_partial: string) {
  // reconstruct the hash
  const hash = `${hash_partial}`;

  // grab the cast in question
  const neynarResult = await neynar.lookUpCastByHash(hash);
  const cast: CastWithPossibleParent = neynarResult?.result?.cast ?? null;

  // if there's no cast, return null
  if (!cast) return null;

  // grab the thread hash
  const threadHash = cast?.threadHash;

  // if there's a parent_hash, grab the parent
  if (cast?.hash && threadHash !== cast?.hash) {
    cast.parent = await neynar
      .lookUpCastByHash(threadHash)
      .then((r) => r.result?.cast ?? undefined);
  }

  // return the cast
  return cast;
}

const nResults = 25;
