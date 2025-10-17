import { createClient } from "@supabase/supabase-js";
import {
  createServerActionClient,
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "./types";

export function getSupabaseServerClient(): SupabaseClient<Database> {
  return createServerComponentClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
}

export function getSupabaseActionClient(): SupabaseClient<Database> {
  return createServerActionClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
}

export function getSupabaseRouteClient(): SupabaseClient<Database> {
  return createRouteHandlerClient<Database>({ cookies }) as unknown as SupabaseClient<Database>;
}

export function getSupabaseServiceRoleClient(): SupabaseClient<Database> {
  return createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
