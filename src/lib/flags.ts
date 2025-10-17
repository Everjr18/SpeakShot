import { env } from "@/lib/env";

export const flags = {
  enableMagicLink: env.ENABLE_MAGIC_LINK,
  enablePosthog: env.ENABLE_POSTHOG,
  allowMcpWrites: env.MCP_ALLOW_WRITE,
};
