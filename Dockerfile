ARG NODE_VERSION=18.20.4

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

COPY env/development.env .env

RUN npx prisma generate 

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
