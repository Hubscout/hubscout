import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { query } }: { params: { query: string } },
) {
  if (!query) {
    return NextResponse.json([], { status: 400 });
  }
  try {
    const response = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/search?q=${query}&viewer_fid=3`,
      {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY,
        },
      },
    );

    if (response.data) {
      return NextResponse.json(response.data.result.users);
    } else {
      return NextResponse.json([], { status: 500 });
    }
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
