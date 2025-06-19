#!/bin/sh
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;37m'
RESET='\033[0m'

export VAULT_ADDR="http://127.0.0.1:8200"

echo -e "\n${GREEN}🚀 Production VAULT script starting...${RESET}"

# Fichier pour éviter les exécutions multiples
SETUP_COMPLETED_FILE="/vault/data/.setup_completed"

#############*##############
#####* WAIT FOR VAULT *#####
#############*##############
echo -e "${GRAY}⏳ Testing if Vault is available...${RESET}"
until curl -s $VAULT_ADDR/v1/sys/health > /dev/null 2>&1; do
    sleep 2
done
echo -e "${GREEN}✅ Vault is now available!${RESET}"

#############*##############
###* CHECK IF COMPLETED *###
#############*##############
if [ -f "$SETUP_COMPLETED_FILE" ]; then
    echo -e "${GREEN}✅ Vault setup already completed.${RESET}"
    echo -e "${CYAN}📝 Root token: $(cat /vault/data/root_token.txt 2>/dev/null || echo 'not found')${RESET}"
    
    # Même si le setup est complété, vérifier si Vault est sealed et l'unseal si nécessaire
    if vault status 2>&1 | grep -q "Sealed.*true"; then
        echo -e "${YELLOW}🔓 Vault is sealed after restart. Unlocking...${RESET}"
        
        if [ ! -f /vault/data/unseal_keys.txt ]; then
            echo -e "${RED}❌ Unseal keys file not found at /vault/data/unseal_keys.txt${RESET}"
            exit 1
        fi

        # Use 3 keys to unseal (minimum threshold) - silently
        count=0
        while IFS= read -r key && [ $count -lt 3 ]; do
            vault operator unseal "$key" > /dev/null 2>&1
            count=$((count + 1))
            sleep 1
        done < /vault/data/unseal_keys.txt

        echo -e "${GREEN}🔓 Vault is now unlocked after restart!${RESET}"
    fi
    
    # Toujours recréer le fichier .htpasswd même si le setup est déjà fait
    echo -e "${YELLOW}🔄 Recreating .htpasswd file...${RESET}"
    if [ -f /vault/data/root_token.txt ]; then
        export VAULT_TOKEN=$(cat /vault/data/root_token.txt)
        if vault token lookup &>/dev/null; then
            nginx_user=$(vault kv get -field=username secret/nginx 2>/dev/null)
            nginx_pass=$(vault kv get -field=password secret/nginx 2>/dev/null)
            if [ -n "$nginx_user" ] && [ -n "$nginx_pass" ]; then
                NGINX_DIR="/etc/nginx/passwd"
                HTPASSWD_FILE="$NGINX_DIR/.htpasswd"
                mkdir -p "$NGINX_DIR"
                htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass" > /dev/null 2>&1
                echo -e "${GREEN}✅ .htpasswd file recreated successfully!${RESET}"
            else
                echo -e "${RED}❌ Failed to get nginx credentials from Vault${RESET}"
            fi
        else
            echo -e "${RED}❌ Vault authentication failed${RESET}"
        fi
    else
        echo -e "${RED}❌ Root token not found${RESET}"
    fi
    
    exit 0
fi

#############*##############
###* CHECK VAULT STATUS *###
#############*##############
if vault status 2>&1 | grep -q "Initialized.*false"; then
    echo -e "${RED}❌ Vault not initialized. Initializing now...${RESET}"
    
    init_output=$(vault operator init -key-shares=5 -key-threshold=3 -format=json)
    echo "$init_output" > /vault/data/init_output.json    
    echo "$init_output" | jq -r '.root_token' > /vault/data/root_token.txt
    echo "$init_output" | jq -r '.unseal_keys_b64[]' > /vault/data/unseal_keys.txt
    echo -e "${GREEN}✅ Vault initialized! Keys saved.${RESET}"
fi

#############*##############
####* UNSEAL THE VAULT *####
#############*##############
if vault status 2>&1 | grep -q "Sealed.*true"; then
    echo -e "${YELLOW}🔓 Vault is sealed. Unlocking...${RESET}"

    if [ ! -f /vault/data/unseal_keys.txt ]; then
        echo -e "${RED}❌ Unseal keys file not found at /vault/data/unseal_keys.txt${RESET}"
        exit 1
    fi

    # Use 3 keys to unseal (minimum threshold) - silently
    count=0
    while IFS= read -r key && [ $count -lt 3 ]; do
        vault operator unseal "$key" > /dev/null 2>&1
        count=$((count + 1))
        sleep 1
    done < /vault/data/unseal_keys.txt

    echo -e "${GREEN}🔓 Vault is now unlocked!${RESET}"
fi

#############*##############
##* VERIFY VAULT STATUS *###
#############*##############
if ! vault status 2>&1 | grep -q "Sealed.*false"; then
    echo -e "${RED}❌ Vault is still sealed. Cannot continue.${RESET}"
    exit 1
fi

#############*##############
####* AUTHENTICATE *########
#############*##############
if [ -f /vault/data/root_token.txt ]; then
    export VAULT_TOKEN=$(cat /vault/data/root_token.txt)
else
    echo -e "${RED}❌ Root token not found. Vault needs to be reinitialized.${RESET}"
    exit 1
fi

# Vérifier si l'authentification fonctionne
if ! vault token lookup &>/dev/null; then
    echo -e "${RED}❌ Authentication with Vault failed. Please check the root token.${RESET}"
    exit 1
fi

echo -e "${GREEN}✅ Authentication successful!${RESET}"

#############*##############
###* ENABLE SECRET KV *#####
#############*##############
if ! vault secrets list | grep -q "secret/"; then
    vault secrets enable -path=secret kv-v2 > /dev/null 2>&1
fi

#############*##############
####* CREATE POLICIES *#####
#############*##############
if [ -f /vault/policies/fastify-policy.hcl ]; then
    vault policy write fastify-policy /vault/policies/fastify-policy.hcl > /dev/null 2>&1
fi
if [ -f /vault/policies/sqlite-policy.hcl ]; then
    vault policy write sqlite-policy /vault/policies/sqlite-policy.hcl > /dev/null 2>&1
fi

#############*##############
####* CREATE SECRETS *######
#############*##############
# Vérifier si le secret SQLite existe déjà
if ! vault kv get secret/sqlite >/dev/null 2>&1; then
    # Ajouter un secret SQLite avec des valeurs réelles
    sqlite_password=$(openssl rand -base64 32)
    vault kv put secret/sqlite username="fastify_user" password="$sqlite_password" > /dev/null 2>&1
    echo -e "${GREEN}✅ SQLite secret added!${RESET}"
fi

# Créer les secrets Nginx
if ! vault kv get secret/nginx >/dev/null 2>&1; then
    nginx_password=$(openssl rand -base64 32)
    vault kv put secret/nginx username="admin" password="$nginx_password" > /dev/null 2>&1
    echo -e "${GREEN}✅ Nginx secret added!${RESET}"
fi

#############*##############
###* GENERATE HTPASSWD *####
#############*##############
nginx_user=$(vault kv get -field=username secret/nginx 2>/dev/null)
nginx_pass=$(vault kv get -field=password secret/nginx 2>/dev/null)
NGINX_DIR="/nginx/passwd"
HTPASSWD_FILE="$NGINX_DIR/.htpasswd"
mkdir -p "$NGINX_DIR"
htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass" > /dev/null 2>&1

#############*##############
###* MARK AS COMPLETED *####
#############*##############
touch "$SETUP_COMPLETED_FILE"

#############*##############
####* DISPLAY SUMMARY *#####
#############*##############
echo -e "${GREEN}🎉 Script completed successfully in Production mode!${RESET}"
echo -e "${CYAN}📝 Root token: $(cat /vault/data/root_token.txt)${RESET}"