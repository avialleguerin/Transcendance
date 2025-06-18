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
###* CHECK IF COMPLETED *###
#############*##############
if [ -f "$SETUP_COMPLETED_FILE" ]; then
    echo -e "${GREEN}✅ Vault setup already completed. ${CYAN}📝 Root token: $(cat /vault/data/root_token.txt 2>/dev/null || echo 'not found')${RESET}"
    exit 0
fi

#############*##############
#####* WAIT FOR VAULT *#####
#############*##############
echo -e "${GRAY}⏳ Testing if Vault is available...${RESET}"
until curl -s $VAULT_ADDR/v1/sys/health > /dev/null 2>&1; do
    echo "Waiting for Vault..."
    sleep 2
done
echo -e "${GREEN}✅ Vault is now available!${RESET}"

#############*##############
###* CHECK VAULT STATUS *###
#############*##############
if vault status 2>&1 | grep -q "Initialized.*false"; then
    echo -e "${RED}❌ Vault not initialized. Initializing now...${RESET}"
    
    init_output=$(vault operator init -key-shares=5 -key-threshold=3 -format=json)
    echo "$init_output" > /vault/data/init_output.json    
    echo "$init_output" | jq -r '.root_token' > /vault/data/root_token.txt
    echo "$init_output" | jq -r '.unseal_keys_b64[]' > /vault/data/unseal_keys.txt
    echo -e "${GREEN}✅ Vault initialized! Keys saved. (${YELLOW}⚠️ IMPORTANT: Backup /vault/data/init_output.json !${RESET})"

    root_token=$(cat /vault/data/root_token.txt)
    echo -e "${GREEN}Root token generated: $root_token${RESET}"
else
    echo -e "${GREEN}✅ Vault is already initialized.${RESET}"
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

    # Use 3 keys to unseal (minimum threshold)
    count=0
    while IFS= read -r key && [ $count -lt 3 ]; do
        echo "Using key $((count + 1))/3"
        vault operator unseal "$key"
        count=$((count + 1))
        sleep 1
    done < /vault/data/unseal_keys.txt

    echo -e "${GREEN}🔓 Vault is now unlocked!${RESET}"
else
    echo -e "${GREEN}✅ Vault is already unlocked.${RESET}"
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
    echo -e "${GREEN}🔑 Authenticating with root token...${RESET}"
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
    echo -e "\n${GREEN}📁 Activating the KV v2 secret engine...${RESET}"
    vault secrets enable -path=secret kv-v2
else
    echo -e "${YELLOW}📁 KV v2 is already enabled.${RESET}"
fi

#############*##############
####* CREATE POLICIES *#####
#############*##############
echo -e "\n${BLUE}📋 Setting up policies...${RESET}"
if [ -f /vault/policies/fastify-policy.hcl ]; then
    vault policy write fastify-policy /vault/policies/fastify-policy.hcl
    echo -e "${GREEN}✅ fastify-policy created${RESET}"
fi
if [ -f /vault/policies/sqlite-policy.hcl ]; then
    vault policy write sqlite-policy /vault/policies/sqlite-policy.hcl
    echo -e "${GREEN}✅ sqlite-policy created${RESET}"
fi

#############*##############
####* CREATE SECRETS *######
#############*##############
# Vérifier si le secret SQLite existe déjà
if vault kv get secret/sqlite >/dev/null 2>&1; then
    echo -e "${YELLOW}🔐 The SQLite secret already exists. No need to overwrite.${RESET}"
else
    # Ajouter un secret SQLite avec des valeurs réelles
    echo -e "\n${GREEN}🔐 Adding the SQLite secret...${RESET}"
    sqlite_password=$(openssl rand -base64 32)
    vault kv put secret/sqlite username="fastify_user" password="$sqlite_password"
    echo -e "${GREEN}✅ SQLite secret added!${RESET}"
fi

# Créer les secrets Nginx
if ! vault kv get secret/nginx >/dev/null 2>&1; then
    echo -e "\n${GREEN}🔐 Adding the Nginx secret...${RESET}"
    nginx_password=$(openssl rand -base64 32)
    vault kv put secret/nginx username="admin" password="$nginx_password"
    echo -e "${GREEN}✅ Nginx secret added!${RESET}"
else
    echo -e "${YELLOW}🔐 The Nginx secret already exists.${RESET}"
fi

#############*##############
###* GENERATE HTPASSWD *####
#############*##############
echo -e "\n${CYAN}🔐 Generating .htpasswd file for Nginx...${RESET}"
nginx_user=$(vault kv get -field=username secret/nginx)
nginx_pass=$(vault kv get -field=password secret/nginx)
NGINX_DIR="/nginx/passwd"
HTPASSWD_FILE="$NGINX_DIR/.htpasswd"
mkdir -p "$NGINX_DIR"
htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass"
echo -e "${GREEN}✅ .htpasswd file generated at: $HTPASSWD_FILE${RESET}"

#############*##############
###* MARK AS COMPLETED *####
#############*##############
touch "$SETUP_COMPLETED_FILE"
echo -e "${GREEN}✅ Setup marked as completed${RESET}"

#############*##############
####* DISPLAY SUMMARY *#####
#############*##############
echo -e "\n${GREEN}🎉 Script completed successfully in Production mode!${RESET}"
echo -e "${CYAN}📝 Root token: $(cat /vault/data/root_token.txt)${RESET}"
echo -e "${YELLOW}⚠️  Save this token and the unseal keys safely!${RESET}"

# Afficher un résumé des secrets créés
echo -e "\n${BLUE}📋 Created secrets summary:${RESET}"
vault kv list secret/ 2>/dev/null || echo "${RED}Could not list secrets${RESET}"