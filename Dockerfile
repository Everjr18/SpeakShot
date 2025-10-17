# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM node:20-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
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
