import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";
import { subDays, subMonths, subWeeks, subYears } from "date-fns";

import supabase from "@/lib/supabase";
import OpenAI from "openai";
import { formatNeynarCast } from "./utils";
export const maxDuration = 10; // This function can run for a maximum of 5 min
export const revalidate = 60 * 30; // 30 minutes
export async function fetchCastResults(
  query: string,
  timeQuery?: "day" | "week" | "month" | "three_months" | "year" | null,
  channel?: string | null,
  author?: string | null,
  fid?: string | null,
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
      authorfid: author,
      query_embedding: queryEmbedding,
      match_count: nResults,
      userfid: fid ? parseInt(fid) : 3,
      optionaltimestamp: startTime,
      optionalparenturl: channel ? decodeURIComponent(channel) : null,
    };

    const { data, error } = await supabase.rpc(
      "match_casts_adaptive",
      params,
    );

    // if there's an error, return an empty array
    if (error) {
      console.log("error in fetchcast", error);
      return [];
    }

    if (!data || !data.length) return [];
    // grab the casts + their replies from the hashes
    let cast_ids = data.map((d: any) => d.hash);
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
  const hash = `0x${hash_partial}`;

  // grab the cast in question
  const neynarResult = await neynar.lookUpCastByHash(hash);
  const cast: CastWithPossibleParent = neynarResult?.result?.cast ?? null;

  return cast;
}

export async function _fetchResultForHash(hash_partial: string) {
  // reconstruct the hash

  const cast = await _fetchResultForCast(hash_partial);

  if (!cast) return null;

  // // grab the cast in question
  // const castFetch = await supabase.from("casts").select(
  //   "*",
  // )
  //   .eq("hash", hash) as any;

  // let cast = castFetch.data[0];
  // console.log("cast", cast);
  // // if there's no cast, return null
  // if (!cast) return null;

  // const authorFetch = await supabase.from("fnames").select("*").eq(
  //   "fid",
  //   cast.fid,
  // );

  // if (authorFetch && authorFetch.data && authorFetch.data.length) {
  //   cast.author = authorFetch.data[0];
  //   if (cast.author && cast.author.pfp && cast.author.pfp.url) {
  //     cast.author.pfp = cast.author.pfp.url;
  //   }
  // }

  // grab the thread hash
  const threadHash = cast?.threadHash;

  // if there's a parent_hash, grab the parent
  if (cast?.hash && threadHash !== cast?.hash) {
    cast.parent = formatNeynarCast(
      await neynar
        .lookUpCastByHash(threadHash)
        .then((r) => r.result?.cast ?? undefined),
    );
  }

  // return the cast
  return cast;
}

const nResults = 100;
