import { fetchCastResults } from "@/helpers/fetchCastResults";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 5; // 5 minutes

export async function GET(
  { headers }: NextRequest,
  {
    params,
  }: {
    params: {
      query: string;
      time?: "day" | "week" | "month" | "year";
      contains?: string;
    };
  }
) {
  const token = headers.get("Authorization");
  const time = params.time ?? null;
  const contains = params.contains ?? null;

  if (token !== "ballerkevin")
    return NextResponse.json("invalid token sers", { status: 420 });

  try {
    const casts = await fetchCastResults(params.query, time, contains);
    return NextResponse.json({ status: "ok", casts });
  } catch (e) {
    return NextResponse.json("Bad request", { status: 400 });
  }
}
