// @ts-ignore
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import { join } from "path";
import { promisify } from "util";
import sharp from "sharp";
import satori from "satori";
import { _fetchResultForCast } from "@/helpers/fetchCastResults";

const readFile = promisify(fs.readFile);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { hash } = req.query;
    if (!hash) {
      // Specify the path to the public folder and the image name
      const imagePath = join(process.cwd(), "public", "hubscout.png");

      // Asynchronously read the image file
      const imageBuffer = await readFile(imagePath);

      // Set the appropriate content type for the image
      res.setHeader("Content-Type", "image/png");

      // Optionally set caching headers
      res.setHeader("Cache-Control", "public, max-age=31557600"); // Adjust caching needs

      // Send the image buffer in the response
      res.status(200).send(imageBuffer);
    } else {
      const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
      const fontData = fs.readFileSync(fontPath);
      // console.log({ fid, hash });

      // if (!fid || !hash) {
      //   return res.status(400).send("Invalid message");
      // }
      /*
    <meta name="fc:frame:button:1" content="Previous">
                <meta name="fc:frame:button:2" content="Next">
*/

      const cast = (await _fetchResultForCast(hash as string)) as any;

      if (!cast) {
        return res.status(404).send("Cast not found");
      }

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

      const pngBuffer = await sharp(Buffer.from(svg))
        .toFormat("png")
        .toBuffer();
      res.setHeader("Content-Type", "image/png");

      // Optionally set caching headers
      res.setHeader("Cache-Control", "public, max-age=31557600"); // Adjust caching needs

      // Send the image buffer in the response
      res.status(200).send(pngBuffer);
    }
  } catch (error) {
    console.error(error);
    // Send an error response if something goes wrong
    res.status(500).send("Error retrieving image");
  }
}
