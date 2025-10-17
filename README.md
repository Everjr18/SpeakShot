# Prompt maestro — Next.js + Supabase Auth Boilerplate

> Boilerplate pedagógico con Next.js 14 (App Router) + Supabase Auth (Google + email/password), shadcn/ui, Server Actions, Docker, CI/CD (GitHub Actions → GHCR + deploy por SSH) y MCP de Supabase. Lista para clonar, completar variables y poner en producción.

```
Next.js App Router
│
├─ Supabase (Auth + DB + MCP)
│   ├─ Google OAuth + email/password
│   └─ Tabla `profiles` con RLS owner-only
│
├─ UI shadcn + Tailwind + sonner
│   └─ Formularios tipados (react-hook-form + zod)
│
├─ Infra
│   ├─ Dockerfile multi-stage + docker-compose
│   ├─ GitHub Actions → GHCR + deploy SSH + rollback
│   └─ scripts/healthcheck.sh & scripts/rollback.sh
│
└─ DevX
    ├─ Validación de env (`src/lib/env.ts`)
    ├─ Flags (`src/lib/flags.ts`)
    ├─ Server Actions seguras
└─ MCP Supabase (SQL seguro; opcional Management API en cloud)
```

## 1. Requisitos previos

- Node.js ≥ 20.10
- npm 10.x (o PNPM/Yarn si prefieres, ajusta scripts)
- Cuenta Supabase + proyecto nuevo
- OAuth Google habilitado
- Acceso SSH a tu VPS (Docker + docker compose instalados)
- Cuenta GitHub configurada con GitHub Container Registry (GHCR)

## 2. Configurar variables de entorno

1. Duplica `.env.example` → `.env`.
2. Completa:

| Variable | Descripción |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (`Project Settings → API`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (`Settings → API`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo en servidor. **Nunca lo expongas en el cliente.** |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Credenciales OAuth de Google. |
| `SUPABASE_URL` | URL base de tu instancia (self-host) o reutiliza la del cloud. |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID` | Solo cloud: para Management API (PAT + ID). |
| `MCP_ALLOW_WRITE` | `true` solo si quieres habilitar SQL de escritura en MCP. |

## 3. Inicializar Supabase

1. Crea la tabla `profiles` (puedes ejecutar en SQL Editor o vía MCP):

```sql
create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
```

2. Activa RLS:

```sql
alter table public.profiles enable row level security;
```

3. Policies owner-only:

```sql
create policy "Profiles are accessible by owners" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their profile" on public.profiles
  for update using (auth.uid() = id);
```

4. (Opcional) Trigger post-signup para auto-crear perfil:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 4. Configurar Google OAuth (Supabase)

1. En Supabase: `Authentication → Providers → Google` → habilita.
2. Crea credenciales en [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Tipo: OAuth Client ID (Web).
   - Autorizaciones:
     - URI de redirección: `https://TU_DOMINIO/api/auth/callback` y `http://localhost:3000/api/auth/callback` para dev.
3. Copia `CLIENT_ID` y `CLIENT_SECRET` al `.env`.

## 5. Desarrollo local

```bash
npm install          # instala dependencias
npm run dev          # http://localhost:3000
```

Flujos a probar:
- `/login` → botón “Continuar con Google”.
- Formulario email/password (tabs Sign-in / Sign-up).
- Dashboard protegido (`/dashboard`), con tarjeta de perfil y botón Sign out.
- Navbar incluye toggle de tema (next-themes + shadcn).

## 6. Server Actions clave

- `src/app/(auth)/login/actions.ts`: sign-in Google, email/password y sign-up. Usa `createServerActionClient` y cookies de Supabase.
- `src/components/layout/Navbar.tsx`: Server Component que obtiene sesión y expone acción de sign out (`"use server"`).
- `src/app/dashboard/page.tsx`: Server Component protegido, redirige si no hay sesión.

## 7. Tailwind + shadcn/ui

- `tailwind.config.ts` apunta a `./src/**/*.{ts,tsx}` y trae preset de tokens.
- Componentes shadcn generados bajo `src/components/ui/*` (button, card, input, etc.).
- Formularios usan `<Form>` + `react-hook-form` + `zod`.
- Toasters con `sonner` (`src/components/ui/sonner.tsx`).

## 8. Docker & Compose

- `Dockerfile` multi-stage (deps → build → runner) con `HEALTHCHECK` a `/api/health`.
- `docker-compose.yml` listo para local/prod, exponiendo `3000:3000` y reusando `.env`.
- `scripts/healthcheck.sh` se reutiliza localmente y en contenedor.

Local smoke:

```bash
docker compose build
docker compose up -d
curl http://localhost:3000/api/health
docker compose down
```

## 9. CI/CD (GitHub Actions → GHCR + Swarm `docker service update`)

Archivo: `.github/workflows/deploy.yml`.

1. Se ejecuta en cada `push` a `master` (o manual vía `workflow_dispatch`).
2. Pasos principales:
   - `docker login ghcr.io` usando `GHCR_USERNAME` + `GHCR_TOKEN`.
   - `docker build` + `docker push` a `ghcr.io/everjr18/speakshot:latest`.
   - `ssh` al manager de tu Swarm y ejecutar:
     ```bash
     docker service update \
       --with-registry-auth \
       --image ghcr.io/everjr18/speakshot:latest \
       --force speakshot_web
     ```
     (Puedes cambiar `speakshot_web` por el nombre real de tu servicio).

### Secrets necesarios (GitHub → Settings → Secrets and variables → Actions)

| Secret | Descripción |
| --- | --- |
| `GHCR_USERNAME` | Usuario de GitHub con permiso `write:packages`. |
| `GHCR_TOKEN` | PAT con `write:packages` (para publicar en GHCR). |
| `SSH_HOST` | IP o dominio del nodo manager. |
| `SSH_USER` | Usuario SSH (root o equivalente). |
| `SSH_KEY` | Clave privada en formato PEM con acceso al servidor. |

> Nota: asegúrate de que el nodo manager pueda hacer `docker login ghcr.io` con el mismo token (el workflow ya ejecuta `docker login` remoto antes de actualizar el servicio).

## 10. MCP de Supabase

- Funciona tanto con Supabase cloud como autohosteado (Orion, Docker Compose, etc.).
- Variables relevantes:
  - `SUPABASE_URL`: dominio/base URL de tu instancia (self-host) o el mismo valor público del cloud.
  - `SUPABASE_SERVICE_ROLE_KEY`: clave de service role (solo disponible en servidor).
  - `MCP_ALLOW_WRITE`: controla si el asistente puede ejecutar `INSERT/UPDATE/DELETE`.
  - `SUPABASE_ACCESS_TOKEN` y `SUPABASE_PROJECT_ID`: **solo** para cloud si quieres habilitar Management API (no aplica a self-host).
- El `mcp.config.json` expone únicamente la capacidad SQL en modo lectura por defecto. Para self-host no necesitas el Management API; para cloud puedes añadirlo modulando la configuración según tus necesidades.
- Ejecuta el servidor MCP con:

```bash
SUPABASE_URL=https://tu-instancia \
SUPABASE_SERVICE_ROLE_KEY=... \
ALLOW_WRITE=${MCP_ALLOW_WRITE:-false} \
npx supabase-mcp@latest
```

- Ejemplos de prompts (Cursor/Claude/Windsurf):
  - “**MCP:** crea tabla `profiles` con RLS owner-only y muestra las policies resultantes.”
  - “**MCP:** describe tablas y sugiere endurecer policies (solo lectura).”
  - “**MCP:** inserta usuario demo si `MCP_ALLOW_WRITE=true`.”

## 11. Pruebas manuales sugeridas

1. `npm run dev` → completa `.env`, realiza login con Google.
2. Email/password sign-in y sign-up → verifica toasts de éxito/error.
3. Registro por email/password → confirma correo recibido y acceso a `/dashboard`.
4. Sign out desde el menú de usuario → redirige a `/login`.
5. `docker compose up` → app disponible en `http://localhost:3000`.
6. Ejecuta workflow `deploy` con secrets completos → comprueba app en VPS.
7. MCP: prompt “describe_tables” → validar respuesta sin writes.

## 12. Troubleshooting

| Problema | Solución |
| --- | --- |
| `Invalid environment variables` | Ver log de `src/lib/env.ts` (muestra keys faltantes). Asegura `.env` actualizado. |
| OAuth Google redirige a localhost | Verifica URIs de redirección en Google Cloud & Supabase. |
| Cookies no se persisten tras OAuth | Confirma ruta `/api/auth/callback` y que `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` sean correctos. |
| Despliegue falla en SSH | Revisa permisos de usuario, existencia de Docker Compose, y que `ENV_FILE` contenga llaves sin comillas extra. |
| MCP necesita writes | Cambia `MCP_ALLOW_WRITE=true` antes de lanzar MCP server (no edites `mcp.config.json` en repos públicos). |

## 13. Scripts útiles

- `scripts/healthcheck.sh` → se usa en contenedor y se puede ejecutar local (`HOST=http://tu-dominio ./scripts/healthcheck.sh`).
- `scripts/rollback.sh` → en VPS, ejecuta `./scripts/rollback.sh prev` para volver al tag anterior (ajusta tag manualmente si usas otra convención).

---

¡Listo! Ajusta el branding/UI según tus necesidades y extiende el flujo de dashboard con datos reales. Cualquier duda adicional, abre un issue o continua iterando en tu IDE con MCP conectado.
