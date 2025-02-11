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

DATA_DIRS	=	Data \
				Data/nginx_data \
				Data/django_data \
				Data/postgresql_data \
				Data/hashicorp_vault_data

# Commands
RM			:=	rm -rf

## RULES --


# Docker
exp:
	export PATH="".docker/cli-plugins:PATH"

build:
	$(DOCKER_COMPOSE) build

up:		build
	@mkdir -p $(DATA_DIRS)
	@$(DOCKER_COMPOSE) up


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

.PHONY: export