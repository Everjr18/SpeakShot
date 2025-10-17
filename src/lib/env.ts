import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .optional()
  .default("false")
  .transform((value) => value === "true");

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY requerido"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY requerido"),
  SUPABASE_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SUPABASE_ACCESS_TOKEN: z.string().optional(),
  SUPABASE_PROJECT_ID: z.string().optional(),
  MCP_ALLOW_WRITE: booleanString,
  DOCKER_IMAGE: z.string().optional(),
  SSH_HOST: z.string().optional(),
  SSH_USER: z.string().optional(),
  SSH_PORT: z.string().optional().default("22"),
  SSH_PATH: z.string().optional(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
  MCP_ALLOW_WRITE: process.env.MCP_ALLOW_WRITE,
  DOCKER_IMAGE: process.env.DOCKER_IMAGE,
  SSH_HOST: process.env.SSH_HOST,
  SSH_USER: process.env.SSH_USER,
  SSH_PORT: process.env.SSH_PORT,
  SSH_PATH: process.env.SSH_PATH,
});

if (!parsed.success) {
  console.error("Invalid environment variables", parsed.error.flatten().fieldErrors);
  throw new Error("Missing or invalid environment variables. Check the log above.");
}

export const env = parsed.data;
