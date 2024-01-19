import { fetchCastResults } from "@/helpers/fetchCastResults";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 5; // 5 minutes

export async function GET({ headers }: NextRequest, { params }: { params: { query: string } }) {
  const token = headers.get("Authorization");

  if (token !== "ballerkevin") return NextResponse.json("invalid token sers", { status: 420 });

  try {
    const casts = await fetchCastResults(params.query);
    return NextResponse.json({ status: "ok", casts });
  } catch (e) {
    return NextResponse.json("Bad request", { status: 400 });
  }
}
