# syntax=docker/dockerfile:1
# The damage-curve dashboard on Cloud Run (plan DCD-D36). It is a static export, so the image holds the built pages and
# the dependency-free server that serves them (scripts/serve-static.mjs, on Cloud Run's PORT). Docker rather than the
# Node buildpacks, as for Hazard's dashboard: Next's build expects real node_modules in the build root. The pages are
# built from the committed dashboard/data, which the deploy workflow first checks was built from main (DCD-D30).

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci
# source and data only: never `COPY . .`, which would bring a local .next/ or out/ into the build
COPY next.config.ts tsconfig.json postcss.config.mjs ./
COPY app ./app
COPY components ./components
COPY lib ./lib
COPY public ./public
COPY data ./data
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/out ./out
COPY scripts/serve-static.mjs ./scripts/serve-static.mjs
USER node
EXPOSE 8080
CMD ["node", "scripts/serve-static.mjs"]
