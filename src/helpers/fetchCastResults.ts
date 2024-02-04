import { client, embedder as embeddingFunction } from "@/lib/chroma";
import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";
import { IncludeEnum } from "chromadb";
export const maxDuration = 300; // This function can run for a maximum of 5 min
export async function fetchCastResults(
  query: string,
  timeQuery?: "day" | "week" | "month" | "year" | null
): Promise<CastWithPossibleParent[]> {
  try {
    // define the collection for casts
    const collection = await client.getCollection({
      embeddingFunction,
      name: "farcaster_search_v2",
    });

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
        case "year":
          startTime = subYears(now, 1);
          break;
        default:
          startTime = null;
      }
    }

    // grab the results for the search
    const results = await collection.query({
      nResults,
      queryTexts: [decodeURIComponent(query)],
      where: startTime
        ? // timestamp: { $gte: startTime.getTime() },
          // username: { $eq: "dwr" },
          {
            timestamp: {
              $gt: startTime.getTime(),
            },
          }
        : undefined,
    });
    console.log("results", results);

    // grab the casts + their replies from the hashes
    const hash_results = results.ids?.[0] ?? [];

    // if there are no results, return an empty array
    if (hash_results.length === 0) return [];

    // fetch the results
    const cast_results = await Promise.all(
      hash_results.map(_fetchResultForHash)
    );

    // return the results
    return cast_results.filter((f) => f !== null) as CastWithPossibleParent[];
  } catch (e) {
    console.log("error in fetchcast", e);
    return [];
  }
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
