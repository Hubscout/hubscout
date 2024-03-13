import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  res: NextResponse,
  {}: {},
) {
  return NextResponse.json("Too many requests", { status: 429 });
}
