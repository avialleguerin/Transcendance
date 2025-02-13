FROM node:18-alpine

WORKDIR /app


RUN npm i fastify && npm i @fastify/static &&\
	npm i better-sqlite3


COPY . .

EXPOSE 3000

CMD ["npm", "start"]