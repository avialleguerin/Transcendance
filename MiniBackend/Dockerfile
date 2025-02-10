FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install @fastify/static


# Copie tous les fichiers (y compris le dossier public)
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]