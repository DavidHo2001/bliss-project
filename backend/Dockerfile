FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

#Provide a fake DATABASE_URL to allow prisma generate to run
ENV DATABASE_URL="mysql://root:root@localhost:3306/bliss_project"

RUN npx prisma generate
RUN npm run build

EXPOSE 8000

CMD npx prisma migrate deploy && npx prisma db seed && node dist/main