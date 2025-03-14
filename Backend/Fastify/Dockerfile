FROM node:20-alpine

WORKDIR /app

COPY Fastify/package*.json ./
RUN apk add --no-cache curl

RUN npm install && npm rebuild

EXPOSE 3000

CMD ["npm", "run", "start:dev"]