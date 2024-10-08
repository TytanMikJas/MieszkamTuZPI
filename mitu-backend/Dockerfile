# imb_backend:
FROM node:20 AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

