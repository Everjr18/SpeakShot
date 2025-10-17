import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hola, {profile?.display_name ?? user.email}</CardTitle>
          <CardDescription>
            ¡Bienvenido al dashboard protegido! Amplía este espacio con tus métricas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-foreground">Información de la sesión</h3>
            <dl className="grid gap-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Correo</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID de usuario</dt>
                <dd className="font-mono text-xs">{user.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Creado</dt>
                <dd>
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleString()
                    : "Pendiente"}
                </dd>
              </div>
            </dl>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Siguientes pasos recomendados</h3>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              <li>Conecta tus datos reales (RLS ya activa).</li>
              <li>Agrega tests gracias a Vitest/Playwright preconfigurados.</li>
              <li>Personaliza el pipeline de despliegue (Workflows → deploy).</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
