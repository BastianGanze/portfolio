FROM node:22-bookworm-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

ARG DB_HOST=__NOT_PROVIDED__
ARG DB_PORT=__NOT_PROVIDED__
ARG CORS=__NOT_PROVIDED__

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV CORS=$CORS
ENV NODE_ENV=production

COPY . .

RUN npm install

RUN --mount=type=secret,id=db_username \
    --mount=type=secret,id=db_password \
    --mount=type=secret,id=db_database \
    --mount=type=secret,id=session_secret \
    DB_USERNAME=$(cat /run/secrets/db_username) \
    DB_PASSWORD=$(cat /run/secrets/db_password) \
    DB_DATABASE=$(cat /run/secrets/db_database) \
    SESSION_SECRET=$(cat /run/secrets/session_secret) \
    npm run environment

RUN npm run build

RUN mkdir -p public/images

EXPOSE 3000

CMD ["npm", "run", "start"]