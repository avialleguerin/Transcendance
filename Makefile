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
NO_LOGS 	:= --no-attach vault --no-attach redis --no-attach nginx --no-attach tsengine

# Variables BABYLON
BABYLON_FILE = ./Frontend/public/srcs/game/gameplay/babylon.js

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
	@rm -rf ./Security/Nginx/passwd
	@rm -rf ./Data/sqlite_data/database.sqlite

re:
	@make down
	@make all

#FIXER
fixer:
	@echo "\n${BLUE}Resinstall node packages...${RESET}"
	@docker exec -it fastify npm install
	@echo "\n${GREEN}✓ Fixer completed successfully.${RESET}"

#IP
ip:
	@echo "\n${BLUE}=== NETWORK INFORMATION ===${RESET}"
	$(eval LOCAL_IP := $(shell ip route get 1.1.1.1 | awk '{print $$7}' | head -1))
	@echo "${GREEN}Local IP:${RESET} $(LOCAL_IP)"
	@echo "${GREEN}Game URL:${RESET} http://$(LOCAL_IP):8080 → https://$(LOCAL_IP):8443"
	@echo "${GREEN}Admin URL:${RESET} http://$(LOCAL_IP):8081 → https://$(LOCAL_IP):8143"

#NGINX
reload-nginx:
	@echo "\n${BLUE}Reloading Nginx inside the container...${RESET}"
	@docker exec nginx nginx -t && docker exec nginx nginx -s reload
	@echo "${GREEN}✓ Nginx reloaded successfully with updated ModSecurity rules.${RESET}"

#HTML OPTIONS
normal:
	@echo "\n${BLUE}Construction de la version normale sans skins...${RESET}"
	@sed -i 's/^init_all_skin(scene);/\/\/ init_all_skin(scene);/' $(BABYLON_FILE)
	@echo "${GREEN}✓ Version normale générée avec succès (skins désactivés).${RESET}"

with_skin:
	@echo "\n${BLUE}Construction de la version avec skins...${RESET}"
	@sed -i 's/^\/\/ init_all_skin(scene);/init_all_skin(scene);/' $(BABYLON_FILE)
	@echo "${GREEN}✓ Version avec skins générée avec succès (skins activés).${RESET}"

.PHONY: up all down re fixer reload-nginx normal with_skin
