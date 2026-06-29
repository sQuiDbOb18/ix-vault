import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { paymentUpdateSchema, uuidSchema } from "@/lib/validations";
import type { Payment } from "@/types";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = uuidSchema.safeParse(params.id);
  if (!id.success) return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });
  const { data, error } = await getServiceSupabase().from("payments").select("*").eq("id", id.data).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ data: data as Payment });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = uuidSchema.safeParse(params.id);
  if (!id.success) return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });
  const body = await request.json();
  const parsed = paymentUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payment" }, { status: 400 });
  const { data, error } = await getServiceSupabase().from("payments").update(parsed.data).eq("id", id.data).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data as Payment, message: "Payment updated" });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = uuidSchema.safeParse(params.id);
  if (!id.success) return NextResponse.json({ error: "Invalid payment id" }, { status: 400 });

  const supabase = getServiceSupabase();
  const existing = await supabase.from("payments").select("receipt_path").eq("id", id.data).single();
  if (existing.error) return NextResponse.json({ error: existing.error.message }, { status: 404 });
  const receiptPath = existing.data?.receipt_path as string | null;
  if (receiptPath) {
    const removed = await supabase.storage.from("receipts").remove([receiptPath]);
    if (removed.error) return NextResponse.json({ error: removed.error.message }, { status: 500 });
  }

  const { error } = await supabase.from("payments").delete().eq("id", id.data);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Payment deleted" });
}
