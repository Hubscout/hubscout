// COPYRIGHT 2024 HUBSCOUT INC. ALL RIGHTS RESERVED.

/**
 * @name FarcasterHubReplicator (matts-replicator)
 * @description Indexes farcaster hub data into a prisma collection
 * @version 0.0.1
 * @license MIT
 *
 * To-do:
 * - [ ] Add a way to index users
 * - [ ] Add a way to index posts
 * - [ ] Add a way to index comments
 * - [ ] Add a way to index likes
 */

import { getSSLHubRpcClient } from "@farcaster/hub-nodejs";

export const replicator = async () => {
  const hub = await getSSLHubRpcClient("https://hub.farcaster.app:443");

  const start = async () => {
    // const res = await hub.getHubInfo();
    // console.log(res);
  };

  return {
    hub,
    start,
  };
};

export interface Replicator {
  hub: ReturnType<typeof getSSLHubRpcClient>;
  start: () => Promise<void>;
}
