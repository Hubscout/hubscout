import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params: { username } }: { params: { username: string } },
) {
  if (!username) {
    return NextResponse.json([], { status: 400 });
  }
  try {
    const response = await axios.get(
      `https://api.neynar.com/v1/farcaster/user-by-username?username=${username}&viewer_fid=3`,
      {
        headers: {
          accept: "application/json",
          api_key: process.env.NEYNAR_API_KEY,
        },
      },
    );

    if (response.data) {
      return NextResponse.json(response.data.result.user);
    } else {
      return NextResponse.json([], { status: 500 });
    }
  } catch (error) {
    console.log("error", error);
    return NextResponse.json([], { status: 500 });
  }
}
