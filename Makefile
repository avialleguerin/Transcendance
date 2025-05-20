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

# Docker Compose
NO_LOGS 	:= --no-attach vault --no-attach redis --no-attach nginx  --no-attach fastify #--no-attach tsengine

all:
	@make build
	@make -j4 up

up:
	@docker compose up ${NO_LOGS}
	@rm -rf ./Backend/Fastify/node_modules
	@rm -rf ./Backend/Fastify/Data
	@rm -rf ./Backend/Fastify/vault

build:
	@docker compose build

down:
	@docker compose down
	@rm -rf ./Frontend/dist

re:
	@make down
	@make all

#FIXER
fixer:
	@echo "\n${BLUE}Resinstall node packages...${RESET}"
	@docker exec -it fastify npm install
	@echo "\n${GREEN}✓ Fixer completed successfully.${RESET}"

#NGINX
reload-nginx:
	@echo "\n${BLUE}Reloading Nginx inside the container...${RESET}"
	@docker exec nginx nginx -t && docker exec nginx nginx -s reload
	@echo "${GREEN}✓ Nginx reloaded successfully with updated ModSecurity rules.${RESET}"


.PHONY: up all down re
