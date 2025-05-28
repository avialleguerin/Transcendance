FROM node:20-alpine

WORKDIR /app

# Définir le fuseau horaire de Paris
ENV TZ=Europe/Paris
RUN apk add --no-cache tzdata

COPY Fastify/package*.json ./
RUN apk add --no-cache curl python3

RUN npm install && npm rebuild

EXPOSE 3000

# CMD ["npm", "run", "start:dev"]
CMD sleep 1 && npm run start:dev
