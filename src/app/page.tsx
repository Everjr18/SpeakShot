import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <header className="space-y-4 text-center">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Next.js + Supabase Auth listo para despegar
        </h1>
        <p className="text-muted-foreground">
          Usa este punto de partida para crear productos SaaS rápidos: autenticación
          segura, UI accesible con shadcn/ui, Server Actions, Docker y un pipeline
          de despliegue reproducible están configurados desde el día cero.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              Ir a Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs"
              target="_blank"
              rel="noreferrer"
            >
              Docs Supabase
            </a>
          </Button>
        </div>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Autenticación híbrida</CardTitle>
            <CardDescription>
              Google OAuth + email/password + magic link (flag) con Server Actions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Validación con zod y formularios react-hook-form.</p>
            <p>Toasts con sonner y estados de carga accesibles.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prod ready desde el inicio</CardTitle>
            <CardDescription>
              Docker multi-stage, docker compose y GitHub Actions listos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Deploy automático a GHCR + VPS via SSH.</p>
            <p>MCP de Supabase conectado para operar tu base de datos con asistentes.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
