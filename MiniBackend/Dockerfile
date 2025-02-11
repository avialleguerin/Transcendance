FROM node:18-alpine

WORKDIR /app


RUN npm i fastify && npm i @fastify/static


COPY . .

EXPOSE 3000

CMD ["npm", "start"]