import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";
import { memberSchema } from "@/lib/validations";
import type { Member, Payment } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = getServiceSupabase();
  const membersResult = await supabase.from("members").select("*").order("name", { ascending: true });
  if (membersResult.error) return NextResponse.json({ error: membersResult.error.message }, { status: 500 });
  const paymentsResult = await supabase.from("payments").select("member_name,amount,status,payment_date");
  if (paymentsResult.error) return NextResponse.json({ error: paymentsResult.error.message }, { status: 500 });

  const payments = (paymentsResult.data ?? []) as Pick<Payment, "member_name" | "amount" | "status" | "payment_date">[];
  const members = ((membersResult.data ?? []) as Member[]).map((member) => {
    const memberPayments = payments.filter((payment) => payment.member_name === member.name);
    return {
      ...member,
      total_paid: memberPayments.filter((payment) => payment.status === "Paid").reduce((sum, payment) => sum + payment.amount, 0),
      total_pending: memberPayments.filter((payment) => payment.status !== "Paid").reduce((sum, payment) => sum + payment.amount, 0),
      payment_count: memberPayments.length,
      last_payment_date: memberPayments.sort((a, b) => b.payment_date.localeCompare(a.payment_date))[0]?.payment_date ?? null
    };
  });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = memberSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid member" }, { status: 400 });
  const supabase = getServiceSupabase();
  const normalizedName = parsed.data.name.trim().toLowerCase();
  const existing = await supabase.from("members").select("*");
  if (existing.error) return NextResponse.json({ error: existing.error.message }, { status: 500 });
  const duplicate = ((existing.data ?? []) as Member[]).find((member) => member.name.trim().toLowerCase() === normalizedName);
  if (duplicate) return NextResponse.json(duplicate);

  const { data, error } = await supabase.from("members").insert(parsed.data).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Member, { status: 201 });
}
