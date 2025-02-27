FROM node:18-bullseye

WORKDIR /app

# RUN npm i fastify &&\
# 	npm i @fastify/static &&\
# 	npm i @fastify/jwt &&\
# 	npm i better-sqlite3 &&\
# 	npm install --save-dev nodemon

COPY Fastify/package*.json ./
RUN npm install

COPY Fastify .

COPY MiniFrontEnd .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
# CMD ["npm", "start"]