import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getBrowserSupabase() {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Missing public Supabase environment variables");
  }
  return createClient(supabaseUrl, anonKey);
}

export function getServiceSupabase() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing server Supabase environment variables");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
