import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SignOutMenuItem from "@/components/auth/SignOutMenuItem";
import ThemeToggle from "@/components/ThemeToggle";
import { getSupabaseActionClient, getSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

function getInitials(value?: string | null) {
  if (!value) return "PM";
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function signOut() {
  "use server";

  const supabase = getSupabaseActionClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function Navbar() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile:
    | {
        display_name: string | null;
        avatar_url: string | null;
      }
    | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    profile = data ?? null;
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            ✦
          </span>
          Prompt maestro
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-full px-2 py-1 text-sm",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt="Avatar" />
                    <AvatarFallback>{getInitials(profile?.display_name ?? user.email)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[10rem] truncate sm:inline-flex">
                    {profile?.display_name ?? user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sesión activa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <SignOutMenuItem action={signOut} />
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
