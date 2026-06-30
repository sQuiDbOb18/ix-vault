import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getServiceSupabase } from "@/lib/supabase";

const maxSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Receipt file is required" }, { status: 400 });
  if (file.size > maxSize) return NextResponse.json({ error: "Receipt must be 5MB or smaller" }, { status: 400 });
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") return NextResponse.json({ error: "Receipt must be an image or PDF" }, { status: 400 });

  const ext = file.name.includes(".") ? file.name.split(".").pop() : file.type.split("/").pop();
  const receiptPath = `uploads/${crypto.randomUUID()}-${Date.now()}.${ext}`;
  const supabase = getServiceSupabase();
  const upload = await supabase.storage.from("receipts").upload(receiptPath, file, { contentType: file.type, upsert: false });
  if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 500 });
  const publicUrl = supabase.storage.from("receipts").getPublicUrl(receiptPath);
  return NextResponse.json({ receipt_url: publicUrl.data.publicUrl, receipt_path: receiptPath });
}
