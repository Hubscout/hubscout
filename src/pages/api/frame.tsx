// @ts-ignore

import sharp from "sharp";
import satori from "satori";
import posthog from "posthog-js";

import { client, embedder as embeddingFunction } from "@/lib/chroma";
import { _fetchResultForHash } from "@/helpers/fetchCastResults";
import { join } from "path";
import * as fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";

export const revalidate = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const post = posthog.init(process.env.POSTHOG_URL as string, {
      api_host: "https://app.posthog.com",
    });

    const { buttonIndex, fid, inputText } = req.body.untrustedData;
    const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
    const fontData = fs.readFileSync(fontPath);
    const headersList = headers();

    const host = headersList.get("host"); // to get domain

    console.log({ host });
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
    console.log("results", results);

    // grab the casts + their replies from the hashes
    const hash_results = results.ids?.[0] ?? [];

    // if there are no results, return an empty array
    if (hash_results.length === 0)
      return new Response("No results found", { status: 404 });

    // fetch the results
    const cast_results = await Promise.all(
      hash_results.map(_fetchResultForHash)
    );

    console.log({ cast_results });
    const cast = cast_results[0] as any;

    // console.log({ fid, hash });

    // if (!fid || !hash) {
    //   return res.status(400).send("Invalid message");
    // }
    /*
    <meta name="fc:frame:button:1" content="Previous">
                <meta name="fc:frame:button:2" content="Next">
*/

    if (!cast) return new Response("No cast found", { status: 404 });
    const svg = await satori(
      <div
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "f4f4f4",
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",

            justifyContent: "center",
            padding: 20,
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {/* Use the Data URL as the image source */}
            <img src={cast.author.pfp.url} width={300} height={250} />
            <h1 style={{ marginLeft: 10 }}>{cast.author.fname}</h1>
          </div>
          <p>{cast.text}</p>
        </div>
      </div>,
      {
        width: 500,
        height: 300,
        fonts: [
          {
            data: fontData,
            name: "Roboto",
            style: "normal",
            weight: 400,
          },
        ],
      }
    );

    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();
    const data = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Hubscout</title>
        <meta property="og:title" content="Hubscout">
        <meta property="og:image" content="${pngBuffer}">
        <meta name="fc:frame" content="vNext">
        <meta name="fc:frame:image" content="${pngBuffer}">
        <meta property="fc:frame:button:1" content="Open App">
        <meta property="fc:frame:button:1:action" content="redirect">
        <meta property="fc:frame:button:1:url" content="${
          host ?? "https://www.hubscout.xyz"
        }/${encodeURIComponent(inputText)}">
    </head>
    </html>
  `;
    // Correctly creating and returning a NextResponse object with image/png content type
    res.send(data);
  }
}
