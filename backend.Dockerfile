# mitu_backend:
FROM node:20 AS builder

WORKDIR /app

COPY ./mitu-backend/package.json ./
COPY ./mitu-backend/package-lock.json ./
RUN npm install

COPY ./mitu-backend .

RUN npx prisma generate
RUN npm run build

ENTRYPOINT npm run start:prod 