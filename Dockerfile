# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

FROM node:20-alpine AS deps
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=0
COPY package*.json ./
COPY scripts ./scripts
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
ARG NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co"
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
ARG SUPABASE_SERVICE_ROLE_KEY="placeholder-service-role-key"
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_BROWSERS_PATH=0
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY scripts/healthcheck.sh /usr/local/bin/healthcheck
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs \
  && chmod +x /usr/local/bin/healthcheck
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD ["healthcheck"]
CMD ["npm", "run", "start"]
