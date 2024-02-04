// @ts-ignore

import sharp from "sharp";
import satori from "satori";
import posthog from "posthog-js";
import { client, embedder as embeddingFunction } from "@/lib/chroma";
import {
  _fetchResultForCast,
  _fetchResultForHash,
} from "@/helpers/fetchCastResults";
import { join } from "path";
import * as fs from "fs";

import { NextApiRequest, NextApiResponse } from "next";

export const revalidate = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const start = Date.now();
    const post = posthog.init(process.env.POSTHOG_URL as string, {
      api_host: "https://app.posthog.com",
    });

    const { buttonIndex, fid, inputText } = req.body.untrustedData;

    console.log({ fid, inputText });
    posthog.capture("search_frame", { fid, inputText });

    // define the collection for casts
    const collection = await client.getCollection({
      embeddingFunction,
      name: "farcaster_search_v2",
    });

    // grab the results for the search
    const results = await collection.query({
      nResults: 1,
      queryTexts: [inputText],
    });
    const middle = Date.now();
    console.log("Time taken to fetch embeddings", middle - start);
    console.log("results", results);

    // grab the casts + their replies from the hashes
    const hash_results = results.ids?.[0] ?? [];
    console.log("hash_results", hash_results);
    // if there are no results, return an empty array
    if (hash_results.length === 0)
      return new Response("No results found", { status: 404 });

    const hash = hash_results[0];
    console.log("hash", hash);

    const data = `<!DOCTYPE html>
    <html>
    <head>
        <title>Hubscout</title>
        <meta property="og:title" content="Hubscout">
        <meta property="og:image" content="https://www.hubscout.xyz/api/image?hash=${hash}">
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="https://www.hubscout.xyz/api/image?hash=${hash}">
        <meta property="fc:frame:button:1" content="Open Hubscout">
        <meta property="fc:frame:button:1:action" content="post_redirect">
        <meta
        property="fc:frame:post_url"
        content="https://www.hubscout.xyz/api/hash/${encodeURIComponent(inputText)}"
      />
    </head>
    <body>
<p>Hubscout</p>
    </body>
    </html>`;
    const end = Date.now();
    console.log("Time taken", end - start);
    // Correctly creating and returning a NextResponse object with image/png content type
    res.status(200).send(data);
  } else {
    res.status(405).send("Method not allowed");
  }
}
