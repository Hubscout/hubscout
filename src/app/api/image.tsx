// @ts-ignore

import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/db";

import { promisify } from "util";
import sharp from "sharp";
import satori from "satori";
import { join } from "path";
import * as fs from "fs";
import * as os from "os";
import { Chessboard } from "react-chessboard";
import prisma from "./../../../prisma/client";
import im from "imagemagick";
import * as gif from "gif-frames";
const unlinkAsync = promisify(fs.unlink);
const supabaseBucket = process.env.NEXT_PUBLIC_BUCKET_NAME;

const writeFile = promisify(fs.writeFile);

const fontPath = join(process.cwd(), "Roboto-Regular.ttf");
const fontData = fs.readFileSync(fontPath);

export const revalidate = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { gameId, turn } = req.query;
  console.log("turn", turn);
  console.log("gameId", gameId);
  if (!gameId) {
    throw new Error("Game ID not provided");
  }
  const game = await prisma.lichessGame.findUnique({
    where: { id: gameId as string },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  try {
    const { gameId } = req.query; // Or however you obtain the game ID
    let supabasePath = `${gameId}/${turn ?? "0"}.png`;

    if (imageURL) {
      const response = await fetch(imageURL);
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const dataUrl = `data:image/png;base64,${base64Image}`; // Adjust the MIME type if necessary

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
            {/* Use the Data URL as the image source */}
            <img src={dataUrl} width={300} height={250} />
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
      res.setHeader("Cache-Control", "max-age=10");
      res.status(200).send(pngBuffer);
      return;
    }
    console.log("image not found");
    const url = `https://lichess1.org/game/export/gif/white/${gameId}.gif?theme=brown&piece=cburnett`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching GIF: ${response.statusText}`);
      }
      const filePath = `${os.tmpdir()}/image.gif`;
      console.log("filePath", filePath);

      // Or the correct path to your directory
      // await ensureDirectoryExists(directory);
      console.log("reading file");
      const readFileAsync = promisify(fs.readFile);
      const arrayBuffer = await response.arrayBuffer();
      const gifBuffer = Buffer.from(arrayBuffer);
      console.log("gifBuffer", gifBuffer);

      const write = await writeFile(filePath, gifBuffer);
      console.log("write", write);
      // const image = await convertImage(filePath);
      const image = await convertAndUploadImage(
        filePath,
        gameId as string,
        turn
      );
      console.log("image", image);

      const imageFrame = `${os.tmpdir()}/${turn ?? "0"}.png`;
      // Check if the file exists before attempting to read
      if (!fs.existsSync(imageFrame)) {
        console.log(`File not found: ${imageFrame}`);
      }

      const imageBuffer = await readFileAsync(imageFrame);

      const base64Image = Buffer.from(imageBuffer).toString("base64");
      const dataUrl = `data:image/png;base64,${base64Image}`; // Adjust the MIME type if necessary

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
            {/* Use the Data URL as the image source */}
            <img src={dataUrl} width={300} height={250} />
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
      res.setHeader("Cache-Control", "max-age=10");
      res.status(200).send(pngBuffer);
      // const deleteFiles = await countAndDeleteGeneratedImages("tmp/");
      // console.log(`Deleted ${deleteFiles} files`);

      return;

      // Process the GIF with ImageMagick or similar
      // Example: exec(`convert -some-options ${gifBuffer} output.gif`, ...);

      // After processing, you can send the GIF back or save it and send a URL
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching or processing the GIF");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating image");
  }
}