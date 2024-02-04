// @ts-ignore
import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs";
import { join } from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
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
  } catch (error) {
    console.error(error);
    // Send an error response if something goes wrong
    res.status(500).send("Error retrieving image");
  }
}
