ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS builder

WORKDIR /app
COPY . ./

RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-slim AS runner

WORKDIR /app
COPY --from=builder /app/.output ./

EXPOSE 3000

CMD ["node","/app/server/index.mjs"]