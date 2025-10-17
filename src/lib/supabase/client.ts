"use client";

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const rawSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

const supabaseUrl = rawSupabaseUrl;
const supabaseAnonKey = rawSupabaseAnonKey;

let client: SupabaseClient<Database> | undefined;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!client) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
      },
    }) as unknown as SupabaseClient<Database>;
  }
  return client;
}

export { getSupabaseBrowserClient as supabaseBrowserClient };
