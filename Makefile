.DEFAULT_GOAL := all

# Colors and Styles
RESET		:=	\e[0m
BOLD		:=	\e[1m
DIM			:=	\e[2m
ITALIC		:=	\e[3m
UNDERLINE	:=	\e[4m
RED			:=	\e[31m
GREEN		:=	\e[32m
PURPLE		:=	\e[95m
BLUE		:=	\e[34m
YELLOW		:=	\e[33m
MAGENTA		:=	\e[35m
CYAN		:=	\e[36m

all:
	@make -j4 up

up:
	@docker compose up --build
	@rm -rf ./Backend/Fastify/node_modules
	@rm -rf ./Backend/Fastfy/Data
	@rm -rf ./Backend/Fastfy/vault

down:
	@docker compose down

re:
	@make down
	@make up

.PHONY: up all down re
