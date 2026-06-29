import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    has_username: !!process.env.ADMIN_USERNAME,
    has_password_hash: !!process.env.ADMIN_PASSWORD_HASH,
    has_nextauth_secret: !!process.env.NEXTAUTH_SECRET,
    has_nextauth_url: !!process.env.NEXTAUTH_URL,
    nextauth_url_value: process.env.NEXTAUTH_URL,
    username_value: process.env.ADMIN_USERNAME,
    hash_starts_with: process.env.ADMIN_PASSWORD_HASH?.substring(0, 7)
  });
}
