FROM node:22-alpine AS base

WORKDIR /app


FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN npm install -g npm@11.15.0
RUN npm install

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npx prisma migrate dev
RUN npm run build

FROM base AS runner

# COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
# COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# COPY --from=builder /app/tsconfig.node.json ./tsconfig.node.json
# COPY --from=builder /app/tsconfig.app.json ./tsconfig.app.json

CMD ["npm","start"]
