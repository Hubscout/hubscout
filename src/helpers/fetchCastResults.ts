import { client, embedder as embeddingFunction } from "@/lib/chroma";
import { type CastWithPossibleParent } from "@/components/Cast";
import { neynar } from "@/lib/neynar";

export async function fetchCastResults(query: string): Promise<CastWithPossibleParent[]> {
  // define the collection for casts
  const collection = await client.getCollection({ embeddingFunction, name });
  // grab the results for the search
  const results = await collection.query({ nResults, queryTexts: [decodeURIComponent(query)] });
  // grab the casts + their replies from the hashes
  return await Promise.all(results.ids?.[0].map(_fetchResultForHash));
}

async function _fetchResultForHash(hash_partial: string) {
  // reconstruct the hash
  const hash = `0x${hash_partial}`;

  // grab the cast in question
  const { result } = await neynar.lookUpCastByHash(hash);
  const cast: CastWithPossibleParent = result?.cast ?? null;
  const threadHash = cast?.threadHash;

  // if there's a parent_hash, grab the parent
  if (threadHash !== cast.hash) {
    cast.parent = await neynar.lookUpCastByHash(threadHash).then((r) => r.result?.cast ?? undefined);
  }

  return cast;
}

const name = "farcaster_search"; // farcaster_embedding_profiles;
const nResults = 25;
