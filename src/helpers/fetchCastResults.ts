import { client, embedder as embeddingFunction } from "@/lib/chroma";
import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";

export async function fetchCastResults(query: string): Promise<CastWithPossibleParent[]> {
  // define the collection for casts
  const collection = await client.getCollection({ embeddingFunction, name });
  // grab the results for the search
  const results = await collection.query({
    nResults,
    queryTexts: [decodeURIComponent(query)],
  });
  // grab the casts + their replies from the hashes
  const hash_results = results.ids?.[0] ?? [];

  // if there are no results, return an empty array
  if (hash_results.length === 0) return [];

  // fetch the results
  const cast_results = await Promise.all(hash_results.map(_fetchResultForHash));

  // return the results
  return cast_results.filter((f) => f !== null) as CastWithPossibleParent[];
}

async function _fetchResultForHash(hash_partial: string) {
  // reconstruct the hash
  const hash = `0x${hash_partial}`;

  // grab the cast in question
  const neynarResult = await neynar.lookUpCastByHash(hash);
  const cast: CastWithPossibleParent = neynarResult?.result?.cast ?? null;

  // if there's no cast, return null
  if (!cast) return null;

  // grab the thread hash
  const threadHash = cast?.threadHash;

  // if there's a parent_hash, grab the parent
  if (cast?.hash && threadHash !== cast?.hash) {
    cast.parent = await neynar.lookUpCastByHash(threadHash).then((r) => r.result?.cast ?? undefined);
  }

  // return the cast
  return cast;
}

const name = "farcaster_search"; // farcaster_embedding_profiles;
const nResults = 25;
