import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY ?? "undefined");

export { neynar };

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
