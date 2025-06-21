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

# Messages
MSG_DOWN_SUCCESS	:= ${GREEN}✓ Containers stopped and cleaned.${RESET}
MSG_FIXER			:= \n${BLUE}Reinstalling node packages...${RESET}
MSG_FIXER_SUCCESS	:= \n${GREEN}✓ Fixer completed successfully.${RESET}
MSG_NETWORK_INFO	:= \n${BLUE}=== NETWORK INFORMATION ===${RESET}
MSG_NGINX_RELOAD	:= \n${BLUE}Reloading Nginx inside the container...${RESET}
MSG_NGINX_SUCCESS	:= ${GREEN}✓ Nginx reloaded successfully with updated ModSecurity rules.${RESET}
MSG_NORMAL_BUILD	:= \n${BLUE}Construction de la version normale sans skins...${RESET}
MSG_NORMAL_SUCCESS	:= ${GREEN}✓ Version normale générée avec succès (skins désactivés).${RESET}
MSG_SKIN_BUILD		:= \n${BLUE}Construction de la version avec skins...${RESET}
MSG_SKIN_SUCCESS	:= ${GREEN}✓ Version avec skins générée avec succès (skins activés).${RESET}
MSG_LOG_ENABLE		:= \n${BLUE}Starting containers with logs...${RESET}
MSG_LOG_SUCCESS		:= ${GREEN}✓ Logs activated (LOG_ACTIVE=true).${RESET}
MSG_LOG_DISABLE		:= \n${BLUE}Starting containers without logs...${RESET}
MSG_NLOG_SUCCESS	:= ${GREEN}✓ Logs deactivated (LOG_ACTIVE=false).${RESET}


# Docker Compose
NO_LOGS 	:= --no-attach redis --no-attach nginx --no-attach tsengine #--no-attach fastify --no-attach vault

# Variables BABYLON
BABYLON_FILE = ./Frontend/public/srcs/game/gameplay/babylon.js

# Security Script
SCRIPT_SECURITY = ./Security/requests-test.sh


all:
	-@docker stop redis tsengine fastify nginx vault
	-@docker rm redis tsengine fastify nginx vault
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
	@docker compose down --remove-orphans
	@rm -rf ./Frontend/dist
	@rm -rf ./Security/Nginx/passwd
# @rm -rf ./Data/sqlite_data/database.sqlite
	@echo "$(MSG_DOWN_SUCCESS)"

re:
	@make down
	@make all

#FIXER
fixer:
	@echo "$(MSG_FIXER)"
	@docker exec -it fastify npm install
	@echo "$(MSG_FIXER_SUCCESS)"

#IP
ip:
	@echo "$(MSG_NETWORK_INFO)"
	$(eval LOCAL_IP := $(shell ip route get 1.1.1.1 | awk '{print $$7}' | head -1))
	@echo "${GREEN}Local IP:${RESET} $(LOCAL_IP)"
	@echo "${GREEN}Game URL:${RESET} http://$(LOCAL_IP):8080 → https://$(LOCAL_IP):8443"
	@echo "${GREEN}Admin URL:${RESET} http://$(LOCAL_IP):8081 → https://$(LOCAL_IP):8143"


#NGINX
reload-nginx:
	@echo "$(MSG_NGINX_RELOAD)"
	@docker exec nginx nginx -t && docker exec nginx nginx -s reload
	@echo "$(MSG_NGINX_SUCCESS)"

debug-files:
	@docker exec nginx ls -la /usr/share/nginx/dist/ || echo "websocket.js NOT FOUND"

sectest:
	@chmod +x $(SCRIPT_SECURITY)
	@$(SCRIPT_SECURITY) all


#OPTIONS
normal:
	@echo "$(MSG_NORMAL_BUILD)"
	@sed -i 's/^init_all_skin(scene);/\/\/ init_all_skin(scene);/' $(BABYLON_FILE)
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=false/' .env || echo "LOG_ACTIVE=false" >> .env
	@echo "$(MSG_NORMAL_SUCCESS)"

with_skin:
	@echo "$(MSG_SKIN_BUILD)"
	@sed -i 's/^\/\/ init_all_skin(scene);/init_all_skin(scene);/' $(BABYLON_FILE)
	@echo "$(MSG_SKIN_SUCCESS)"

log:
	@echo "$(MSG_LOG_ENABLE)"
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=true/' .env || echo "LOG_ACTIVE=true" >> .env
	@sed -i 's/^LOG_LEVEL=.*/LOG_LEVEL=debug/' .env || echo "LOG_LEVEL=debug" >> .env
	@echo "$(MSG_LOG_SUCCESS)"

nlog:
	@echo "$(MSG_LOG_DISABLE)"
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=false/' .env || echo "LOG_ACTIVE=false" >> .env
	@echo "$(MSG_NLOG_SUCCESS)"

.PHONY: all up build down re fixer ip reload-nginx debug-files sectest normal with_skin log nlog
