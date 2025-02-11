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

# Variables
DOCKER_COMPOSE = docker-compose -f docker-compose.yml

DATA_DIRS	=	data \
				data/nginx \
				data/django \
				data/postgresql \
				data/hashicorp_vault

# Commands
RM			:=	rm -rf

## RULES --

# Docker
build:
	docker build -t fastify-server .

up:		build
	docker run -p 3000:3000 fastify-server


# Venv
venv:
	$(RM) .env .envPy
	python3 -m venv .env
	@echo "Use this command : $(GREEN)[source .env/bin/activate]$(RESET)"

freeze: venv
	pip install -r requirements.txt
	pip freeze > Ressource/requirements.txt

# Global
all:	build up

clean: 
	@$(RM) $(DATA_DIRS) || true
# @docker stop $$(docker ps -qa) || true
# @docker rm $$(docker ps -qa) || true
# @docker rmi -f $$(docker images -qa) || true

fclean: clean
	$(RM) .env .envPy