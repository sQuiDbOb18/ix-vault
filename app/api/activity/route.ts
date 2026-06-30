import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import type { ActivityLog } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { data, error } = await getServiceSupabase().from("activity_log").select("*").order("created_at", { ascending: false }).limit(10);
    if (error) {
      console.error("Activity query failed", error);
      return NextResponse.json({ error: "Unable to load activity" }, { status: 500 });
    }
    return NextResponse.json((data ?? []) as ActivityLog[]);
  } catch (error) {
    console.error("Activity route failed", error);
    return NextResponse.json({ error: "Unable to load activity" }, { status: 500 });
  }
}
