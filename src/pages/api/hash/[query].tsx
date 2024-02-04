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
    const { query } = req.query;
    console.log({ query });

    // Construct the redirect URL using the dynamic part
    const redirectUrl = `https://www.hubscout.xyz/${query}`;

    res.setHeader("Location", redirectUrl);

    // Set the status code to 302 for a temporary redirect and end the response
    res.status(302).end();
  }
}
