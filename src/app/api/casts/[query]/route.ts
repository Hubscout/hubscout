import { fetchCastResults } from "@/helpers/fetchCastResults";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 5; // 5 minutes
export const maxDuration = 300; // This function can run for a maximum of 5 min
export async function GET(
  { headers }: NextRequest,
  {
    params,
  }: {
    params: {
      query: string;
      time?: "day" | "week" | "month" | "year";
    };
  }
) {
  const token = headers.get("Authorization");
  const time = params.time ?? null;

  if (token !== "ballerkevin")
    return NextResponse.json("invalid token sers", { status: 420 });

  try {
    const casts = await fetchCastResults(params.query, time);
    return NextResponse.json({ status: "ok", casts });
  } catch (e) {
    console.log("error in query", e);
    return NextResponse.json("Bad request", { status: 400 });
  }
}
