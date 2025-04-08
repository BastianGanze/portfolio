ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS builder

ARG GRAPHQL_ENDPOINT=__NOT_PROVIDED__

ENV GRAPHQL_ENDPOINT=$GRAPHQL_ENDPOINT

RUN if [ "$GRAPHQL_ENDPOINT" = "__NOT_PROVIDED__" ]; then \
      echo "ERROR: GRAPHQL_ENDPOINT build argument is required" && \
      exit 1; \
    fi

WORKDIR /app
COPY . ./

RUN npm install
RUN npm install
RUN npm run build

FROM node:${NODE_VERSION}-slim AS runner

WORKDIR /app
COPY --from=builder /app/.output ./

EXPOSE 3000

CMD ["node","/app/server/index.mjs"]