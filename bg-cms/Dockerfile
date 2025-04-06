# Build stage
FROM node:22-bookworm-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

ARG DB_HOST=localhost
ARG DB_USERNAME=postgres
ARG DB_PASSWORD=6JrEmGSaq2JVJgPodaLwtnDZq
ARG DB_DATABASE=bgdb
ARG DB_PORT=5444
ARG NODE_ENV=production
ARG CORS=http://localhost:8081
ARG SESSION_SECRET=secret12345secret12345secret12345secret12345secret12345secret12345

ENV DB_HOST $DB_HOST
ENV DB_USERNAME $DB_USERNAME
ENV DB_PASSWORD $DB_PASSWORD
ENV DB_DATABASE $DB_DATABASE
ENV DB_PORT $DB_PORT
ENV CORS $CORS
ENV SESSION_SECRET $SESSION_SECRET

COPY . .
RUN npm install
RUN npm run environment
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]