# syntax=docker/dockerfile:1
# The derivation dashboard on Cloud Run. A static site: the image holds derivation_dashboard/site, with its data built
# from docs/cells by tools/build.py in the deploy workflow just before this build, and the dependency-free server.
FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY site ./out
COPY server/serve-static.mjs ./server/serve-static.mjs
USER node
EXPOSE 8080
CMD ["node", "server/serve-static.mjs"]
