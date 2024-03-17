import OpenAI from "openai";
import { v4 } from "uuid";

export const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    const id = v4();
    localStorage.setItem("userId", id);
    userId = id;
  }
  return userId;
};

export const imageList = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];

export const videoList = [".mp4", ".webm", ".ogg", ".mov", ".m3u8"];

export const formatNeynarCast = (cast: any) => {
  return {
    ...cast,
    display_name: cast.author?.displayName,
    username: cast.author?.username,
  };
};

export const generateEmbedding = async (input: string) => {
  if (!input) return null;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: input.replace(/(\r\n|\n|\r)/gm, ""),
    dimensions: 512,
  });

  return embedding.data[0].embedding;
};

export function generateFallbackAvatar(username: any) {
  const initials = username
    .split(" ")
    .map((name: any) => name[0])
    .join("")
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <rect width="100%" height="100%" fill="#007bff"/>
    <text x="50%" y="50%" dy="0.35em" fill="#ffffff" font-size="50" text-anchor="middle" font-family="Arial, sans-serif">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
