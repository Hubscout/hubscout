// pages/api/hash/[dynamic].js
import { NextApiRequest, NextApiResponse } from "next";

export const revalidate = 0;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the request method is POST
  if (req.method === "POST") {
    // Method Not Allowed
    // Extract the dynamic part from the query object
    const { hash } = req.query;

    // Construct the redirect URL using the dynamic part
    const redirectUrl = `https://www.hubscout.xyz/${hash}`;

    // Perform the redirect
    res.redirect(307, redirectUrl);
  }
}