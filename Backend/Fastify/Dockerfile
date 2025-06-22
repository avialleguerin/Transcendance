FROM node:20-alpine

WORKDIR /app

# Définir le fuseau horaire de Paris
ENV TZ=Europe/Paris
RUN apk add --no-cache tzdata

COPY Fastify/package*.json ./
RUN apk add --no-cache curl python3 openssl

RUN npm install && npm rebuild

# Créer le répertoire pour les certificats SSL
RUN mkdir -p /etc/fastify/ssl

EXPOSE 3000
EXPOSE 3443

# Démarrage avec délai pour attendre les autres services
CMD ["sh", "-c", "sleep 1 && npm run start:dev"]
