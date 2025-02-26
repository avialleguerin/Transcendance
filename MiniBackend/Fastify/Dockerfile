FROM node:18-alpine

WORKDIR /app


RUN npm i fastify &&\
	npm i @fastify/static &&\
	npm i fastify-jwt &&\
	npm i fastify-cookie &&\
	npm i better-sqlite3 &&\
	npm i livereload connect-livereload\
	npm install --save-dev nodemon


COPY Fastify ./Fastify

COPY MiniFrontEnd ./MiniFrontEnd

EXPOSE 3000

CMD ["npm", "run", "start:dev"]