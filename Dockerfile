FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate



CMD [ "npm", "run","start"]





