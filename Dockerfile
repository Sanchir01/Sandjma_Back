FROM node:20.9.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npx", "prisma", "db", "push" ]



