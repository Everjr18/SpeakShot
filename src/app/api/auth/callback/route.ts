import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>(
    { cookies },
    {
      options: {
        supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    },
  );

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  const redirectUrl = searchParams.get("redirect_to") ?? "/dashboard";
  return NextResponse.redirect(new URL(redirectUrl, origin));
}
