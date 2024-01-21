import { client, embedder as embeddingFunction } from "@/lib/chroma";
import dayjs from "@/lib/dayjs";
import { neynar } from "@/lib/neynar";
import { GetResponse, Metadata } from "chromadb";

/**
 * Indexes all users from the farcaster protocol
 *
 * considerations:
 * - if a user changes their profile, we need to re-embed it.
 * - we want to eliminate as much spam as possible, a few options:
 *      - we could only index active users, but ppl like @gregfromstl won't get indexed (bad)
 *      - we could only index users with a certain amount of followers (i.e. > 10)
 *      - we could only index users with a certain amount of posts (i.e. > 10) - can't get this data in a single call
 *      - we could only index users with a username as opposed to an FID, since that costs more money and harder to spam
 * - we want the embeddings to work across the user's data, name, username, bio. So anytime anything
 *   changes, we should just re-embed the entire user object and re-save the metadata.
 */

// collection name — don't touch!
const name = "users-v1";

export default async function indexAllUsers() {
  // initialize vars
  let start = dayjs().valueOf();

  // fetch all the users from merkle
  const users = await _fetchRecentUsers();

  return users;

  // log time it took
  console.log(`[INDEXER]: Found ${users.length} users in ${(dayjs().valueOf() - start) / 1000}s`);

  // get the chroma data
  const { collection, existing_users } = await _getChromaData();

  // iterate over each user, and re-index if necessary
  // keys to store for user in metadata = fid, username, displayName, bio, custodyAddress, pfpUrl, followerCount, followingCount, verifications, activeStatus
  // for await (const user of users) {
  //   // get the existing user
  //   const existing_user = existing_users.find(({ id }) => id === user.id) ?? null;

  //   if (!existing_user) {
  //     await collection.upsert({
  //       ids: [user.fid.toString()],
  //       metadatas: [user.metadata],
  //       documents: [_constructUserEmbedding(user)],
  //     });
  //   }

  //   // if there's no existing user, we index and embed it
  //   if (!existing_user.id) {
  //     await collection.upsert({
  //       ids: [user.fid.toString()],
  //       metadata: {
  //         fid: user.fid,
  //         username: user.username,
  //         displayName: user.displayName,
  //         bio: user?.profile?.bio?.text ?? null,
  //         custodyAddress: user.custodyAddress,
  //         pfpUrl: user?.pfp?.url ?? null,
  //         followerCount: user.followerCount,
  //         followingCount: user.followingCount,
  //         verifications: user.verifications,
  //         activeStatus: user.activeStatus,
  //       },
  //       document: user,
  //     });
  //   }
  // }

  // // get all the existing users
  // const existing_users = await collection.get().then(_reconstructExistingUsers);

  // for await (const user of users_to_index) {
  //   // get the existing user
  //   const existing_user = existing_users.find((u) => u.id === user.fid) ?? {};

  //   await collection.upsert({
  //     ids: [user.fid.toString()],
  //     metadata: {
  //       fid: user.fid,
  //       username: user.username,
  //       displayName: user.displayName,
  //       bio: user?.profile?.bio?.text ?? null,
  //       custodyAddress: user.custodyAddress,
  //       pfpUrl: user?.pfp?.url ?? null,
  //       followerCount: user.followerCount,
  //       followingCount: user.followingCount,
  //       verifications: user.verifications,
  //       activeStatus: user.activeStatus,
  //     },
  //     document: user,
  //   });

  //   // if there's no existing user, we index and embed it

  //   // we need to re-embed the user if the username, displayName, or bio has changed

  //   // if any other data has changed, we overwrite the details but do not re-embed them - save money
  //   const metadata = {
  //     ...existing_user?.metadata,
  //     ...user,
  //   };
  // }
}

function _reconstructExistingUsers({ ids, metadatas, documents }: GetResponse): ChromaUser[] {
  return ids.map((id, i: number) => ({
    id,
    metadata: metadatas[i] as UserMetadata | null,
    document: documents[i],
  }));
}

/**
 * Grabs all users from WC api and formats objects
 */
async function _fetchRecentUsers(): Promise<ChromaUser[]> {
  let cursor = null;
  let users = [];

  const baseEndpoint = "https://api.warpcast.com/v2/recent-users?filter=off&limit=1000";
  const endpoint = (cursor: string | null) => `${baseEndpoint}${cursor ? `&cursor=${cursor}` : ""}`;
  const options = { headers: { Authorization: `Bearer ${process.env.MERKLE_API_KEY}` } };

  do {
    // fetch the users
    const { result, next } = await fetcher(endpoint(cursor), options);

    // add the users to the array
    users.push(...(result.users ?? []));

    // update the cursor
    cursor = next?.cursor ?? null;

    // log the progress
    console.log(`[INDEXER]: fetched ${users.length} users`);
  } while (cursor);

  // format and return the users
  return users.map((user) => {
    const id = user.fid.toString();
    const metadata = _constructUserMetadata(user);
    const document = _constructUserEmbedding(metadata);

    return { id, metadata, document };
  });
}

function _constructUserMetadata(user: any): UserMetadata {
  return {
    fid: user.fid,
    username: user.username,
    displayName: user.displayName,
    bio: user?.profile?.bio?.text ?? null,
    custodyAddress: user.custodyAddress,
    placeDescription: user?.profile?.location?.description ?? null,
    placeId: user?.profile?.location?.placeId ?? null,
    pfpUrl: user?.pfp?.url ?? null,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    verifications: user.verifications,
    activeStatus: user.activeStatus,
  };
}

function _constructUserEmbedding({ displayName, username, bio, placeDescription }: UserMetadata): any {
  return `${displayName} (@${username})${placeDescription ? ` in ${placeDescription}` : ""}${bio ? ` – ${bio}` : ""}`;
}

/**
 * Constructs the user embedding
 */
async function _getChromaData() {
  // get the chroma collection
  const collection = await client.getOrCreateCollection({ name, embeddingFunction });

  // get all the existing users
  const existing_users = await collection.get().then(_reconstructExistingUsers);

  // return the data
  return { collection, existing_users };
}

const fetcher = async (endpoint: string, options: any) => await fetch(endpoint, options).then((r) => r.json());

interface UserMetadata {
  fid: number;
  username: string;
  displayName: string;
  bio: string | null;
  custodyAddress: string;
  placeDescription: string | null;
  placeId: string | null;
  pfpUrl: string | null;
  followerCount: number;
  followingCount: number;
  verifications: any[];
  activeStatus: string;
}

interface ChromaUser {
  id: string;
  metadata: UserMetadata | null;
  document: any;
}
