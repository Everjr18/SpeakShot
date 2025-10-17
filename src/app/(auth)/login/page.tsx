import { redirect } from "next/navigation";
import GoogleButton from "@/components/auth/GoogleButton";
import EmailPasswordForm from "@/components/auth/EmailPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Inicia sesión en Prompt maestro
          </CardTitle>
          <CardDescription>
            Autenticación segura con Supabase. Elige Google o correo electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <GoogleButton />

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase text-muted-foreground">
              o usa tu email
            </span>
          </div>

          <EmailPasswordForm />
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Inicio rápido: crea tu proyecto en Supabase, habilita proveedor Google y
        completa las variables de entorno. El dashboard se desbloquea al iniciar sesión.
      </p>
    </div>
  );
}
