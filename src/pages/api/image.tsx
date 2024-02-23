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
    console.log("hash", hash);
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
      console.log({ cast });
      if (!cast) {
        return res.status(404).send("Cast not found");
      }
      const styles = {
        outerDiv: {
          justifyContent: "flex-start",
          alignItems: "center",
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#f4f4f4", // Light grey background
          padding: 50,
          lineHeight: 1.2,
          fontSize: 24,
        },
        innerDiv: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          padding: 20,
        },
        rowDiv: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center", // Ensure vertical alignment in the row
        },
        heading: {
          marginLeft: 10,
          color: "#333", // Changed to dark for contrast against light background
          fontSize: 24, // Large font size for the heading
        },
        cast: {
          color: "#333", // Changed to dark for visibility
          fontSize: 16, // Smaller font size for the text
          marginTop: 20, // Added space between the heading and the text
          textAlign: "center", // Center-align the text
          maxWidth: "80%", // Limit width for better readability
          fontWeight: "bold", // Bold font weight for the heading
        },
        image: {
          width: 150,
          height: 100,
          borderRadius: 8, // Optional: added for rounded corners
        },
      };

      const svg = await satori(
        <div style={styles.outerDiv}>
          <div style={styles.innerDiv as any}>
            <div style={styles.rowDiv as any}>
              {/* Use the Data URL as the image source */}
              <img src={cast.author.pfp.url} style={styles.image} />
              <h1 style={styles.heading}>{cast.author.username}</h1>
            </div>
            <p style={styles.cast as any}>{cast.text}</p>
          </div>
        </div>,
        {
          width: 500,
          height: 200,
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
