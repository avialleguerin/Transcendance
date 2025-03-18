FROM node:20-alpine

WORKDIR /app

COPY Fastify/package*.json ./
RUN apk add --no-cache curl sqlcipher python3

RUN npm install && npm rebuild

EXPOSE 3000

# CMD ["npm", "run", "start:dev"]
CMD sleep 1 && npm run start:dev
