import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export const revalidate = 60 * 30; // 5 minutes
export async function GET() {
  try {
    const { data, error } = await supabase.from("channels").select("*");

    if (error) {
      throw error;
    }
    const channels = data;

    return NextResponse.json(channels);
  } catch (e) {
    console.log("error in get_channels", e);
    return NextResponse.json([]);
  }
}
