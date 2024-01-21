import { NextResponse } from "next/server";
import indexAllUsers from "../../../../../indexer/users";

export async function GET() {
  return NextResponse.json(await indexAllUsers());
}
