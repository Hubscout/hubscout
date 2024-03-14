import { fetchCastResults } from "@/helpers/fetchCastResults";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 60 * 30; // 30 minutes
export const maxDuration = 60; // This function can run for a maximum of 5 min

export async function GET(
  _: NextRequest,
  {},
) {
  const url = new URL(_.nextUrl);
  const { searchParams } = url;
  const query = searchParams.get("query");
  const timeQuery = searchParams.get("timeQuery") as
    | "day"
    | "week"
    | "month"
    | "three_months"
    | "year"
    | null;
  const parent_url = searchParams.get("parent_url");
  const author = searchParams.get("author");
  const fid = searchParams.get("fid");

  if (!query) {
    return NextResponse.json({ result: [] }, { status: 400 });
  }
  try {
    const result = await fetchCastResults(
      query,
      timeQuery,
      parent_url,
      author,
      fid,
    );
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ result: [] }, { status: 500 });
  }
}
