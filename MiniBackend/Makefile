.DEFAULT_GOAL := all

all:
	@make -j4 up
	@rm -rf Fastify/node_modules

up:
	@docker compose up --build

down:
	@docker compose down

.PHONY: up all