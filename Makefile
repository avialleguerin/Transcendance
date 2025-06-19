.DEFAULT_GOAL := all

#######*########
###* COLORS *###
#######*########
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

########*########
#####* MSG *#####
########*########
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

NO_LOGS 	:= --no-attach redis --no-attach tsengine #--no-attach nginx #--no-attach fastify  --no-attach vault
BABYLON_FILE = ./Frontend/public/srcs/game/gameplay/babylon.js
SCRIPT_SECURITY = ./Security/requests-test.sh

########*########
####* BASIC *####
########*########
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
	@docker compose down --remove-orphans
	@rm -rf ./Frontend/dist
# @rm -rf ./Security/Nginx/passwd
# @rm -rf ./Data/sqlite_data/database.sqlite
	@echo "$(MSG_DOWN_SUCCESS)"

re:
	@make down
	@clear
	@make all

########*########
####* FIXER *####
########*########
fixer:
	@echo "$(MSG_FIXER)"
	@docker exec -it fastify npm install
	@echo "$(MSG_FIXER_SUCCESS)"

#######*#######
####* IP *#####
#######*#######
ip:
	@echo "$(MSG_NETWORK_INFO)"
	$(eval LOCAL_IP := $(shell ip route get 1.1.1.1 | awk '{print $$7}' | head -1))
	@echo "${GREEN}Local IP:${RESET} $(LOCAL_IP)"
	@echo "${GREEN}Game URL:${RESET} http://$(LOCAL_IP):8080 → https://$(LOCAL_IP):8443"
	@echo "${GREEN}Admin URL:${RESET} http://$(LOCAL_IP):8081 → https://$(LOCAL_IP):8143"

########*########
####* NGINX *####
########*########
nreload:
	@echo "$(MSG_NGINX_RELOAD)"
	@docker exec nginx nginx -t && docker exec nginx nginx -s reload
	@echo "$(MSG_NGINX_SUCCESS)"

debug-files:
	@docker exec nginx ls -la /usr/share/nginx/dist/ || echo "websocket.js NOT FOUND"

sectest:
	@chmod +x $(SCRIPT_SECURITY)
	@$(SCRIPT_SECURITY) all

########*########
####* SKINS *####
########*########
normal:
	@echo "$(MSG_NORMAL_BUILD)"
	@sed -i 's/^init_all_skin(scene);/\/\/ init_all_skin(scene);/' $(BABYLON_FILE)
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=false/' .env || echo "LOG_ACTIVE=false" >> .env
	@echo "$(MSG_NORMAL_SUCCESS)"

skin:
	@echo "$(MSG_SKIN_BUILD)"
	@sed -i 's/^\/\/ init_all_skin(scene);/init_all_skin(scene);/' $(BABYLON_FILE)
	@echo "$(MSG_SKIN_SUCCESS)"

########*########
#####* LOGS *####
########*########
log:
	@echo "$(MSG_LOG_ENABLE)"
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=true/' .env || echo "LOG_ACTIVE=true" >> .env
	@sed -i 's/^LOG_LEVEL=.*/LOG_LEVEL=debug/' .env || echo "LOG_LEVEL=debug" >> .env
	@echo "$(MSG_LOG_SUCCESS)"

nlog:
	@echo "$(MSG_LOG_DISABLE)"
	@sed -i 's/^LOG_ACTIVE=.*/LOG_ACTIVE=false/' .env || echo "LOG_ACTIVE=false" >> .env
	@echo "$(MSG_NLOG_SUCCESS)"

########*########
####* VAULT *####
########*########
vault:
	@echo "${BLUE}=== VAULT INFO ===${RESET}"
	@echo "${GREEN}UI: http://localhost:8200${RESET}"
	@echo "${YELLOW}Token: $$(docker exec vault cat /vault/data/root_token.txt 2>/dev/null || echo 'Not found')${RESET}"
	@echo "${BLUE}Status:${RESET}"
	@docker exec vault vault status 2>/dev/null || echo "${RED}Vault unavailable${RESET}"

vunseal:
	@echo "${YELLOW}🔓 Force unsealing Vault...${RESET}"
	@docker exec vault sh -c 'if vault status 2>&1 | grep -q "Sealed.*true"; then echo "Unsealing..."; count=0; while IFS= read -r key && [ $$count -lt 3 ]; do vault operator unseal "$$key"; count=$$((count + 1)); done < /vault/data/unseal_keys.txt; echo "✅ Vault unsealed!"; else echo "✅ Vault already unsealed"; fi' 2>/dev/null || echo "${RED}Failed to unseal${RESET}"

vsecrets:
	@echo "${BLUE}=== VAULT SECRETS ===${RESET}"
	@docker exec vault sh -c 'export VAULT_TOKEN=$$(cat /vault/data/root_token.txt 2>/dev/null) && vault kv get secret/sqlite' 2>/dev/null || echo "${RED}No secrets found.${RESET}"

vreset:
	@echo "${RED}⚠️  Resetting Vault...${RESET}"
	@docker exec vault rm -f /vault/data/.setup_completed 2>/dev/null || true
	@docker compose restart vault

vdebug:
	@echo "${BLUE}=== VAULT DEBUG ===${RESET}"
	@docker logs vault --tail 15
	@echo "${YELLOW}Connection test:${RESET}"
	@docker exec fastify node -e "import('./utils/vault.js').then(vault => { vault.getSQLiteCreds().then(creds => { console.log('✅ Connected'); }).catch(err => { console.error('❌ Failed:', err.message); }); });" 2>/dev/null || echo "${RED}Test failed${RESET}"


.PHONY: all up build down re fixer ip nreload debug-files sectest normal skin log nlog vault-token vault-status vault-secrets vault-reset-setup vault-restart vault-logs vault-init-manual vault-ui vault-test-connection vault-show-secrets

