import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { filtersSchema, paymentSchema } from "@/lib/validations";
import type { Payment } from "@/types";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const parsed = filtersSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid filters" }, { status: 400 });

  const { search, status, method, dateFrom, dateTo, sortBy = "payment_date", sortDir = "desc", page = 1, limit = 50 } = parsed.data;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const supabase = getServiceSupabase();
  let query = supabase.from("payments").select("*", { count: "exact" });

  if (search) query = query.or(`member_name.ilike.%${search}%,transaction_ref.ilike.%${search}%`);
  if (status && status !== "All") query = query.eq("status", status);
  if (method && method !== "All") query = query.eq("payment_method", method);
  if (dateFrom) query = query.gte("payment_date", dateFrom);
  if (dateTo) query = query.lte("payment_date", dateTo);

  const { data, error, count } = await query.order(sortBy, { ascending: sortDir === "asc" }).range(from, to);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: (data ?? []) as Payment[], total: count ?? 0, page, totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)) });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payment" }, { status: 400 });

  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from("payments").insert(parsed.data).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data as Payment, message: "Payment added" }, { status: 201 });
}
