#!/bin/sh

#colors
RED='\e[0;31m'
GREEN='\e[0;32m'
RESET='\e[0m'

set -e

# Configuration pour les certificats auto-signés
export VAULT_SKIP_VERIFY=true

# Vérifier si on a un token root existant ou si on doit initialiser
ROOT_TOKEN_FILE="/vault/data/root_token"
UNSEAL_KEY_FILE="/vault/data/unseal_key"

# Attendre avec des vérifications plus fréquentes
timeout=30
count=0
until curl -k -s $VAULT_ADDR/v1/sys/health > /dev/null 2>&1; do
	if [ $count -ge $timeout ]; then
		echo -e "${RED}Timeout: Vault non disponible${RESET}"
		exit 1
	fi
	sleep 0.5
	count=$((count + 1))
done

# Vérifier si Vault est initialisé
if curl -k -s $VAULT_ADDR/v1/sys/init | grep '"initialized":false' > /dev/null; then
    # Initialiser Vault avec 1 clé de déverrouillage et 1 partage
    INIT_RESPONSE=$(curl -k -s -X POST -d '{"secret_shares":1,"secret_threshold":1}' $VAULT_ADDR/v1/sys/init)
    UNSEAL_KEY=$(echo $INIT_RESPONSE | jq -r '.keys[0]')
    ROOT_TOKEN=$(echo $INIT_RESPONSE | jq -r '.root_token')
    
    # Sauvegarder les clés pour les redémarrages futurs
    echo $ROOT_TOKEN > $ROOT_TOKEN_FILE
    echo $UNSEAL_KEY > $UNSEAL_KEY_FILE
    
    # Déverrouiller Vault
    curl -k -s -X POST -d "{\"key\":\"$UNSEAL_KEY\"}" $VAULT_ADDR/v1/sys/unseal
    
    export VAULT_TOKEN=$ROOT_TOKEN
else
    # Vérifier si Vault est déverrouillé
    if curl -k -s $VAULT_ADDR/v1/sys/seal-status | grep '"sealed":true' > /dev/null; then
        if [ -f "$UNSEAL_KEY_FILE" ]; then
            UNSEAL_KEY=$(cat $UNSEAL_KEY_FILE)
            curl -k -s -X POST -d "{\"key\":\"$UNSEAL_KEY\"}" $VAULT_ADDR/v1/sys/unseal
        else
            echo -e "${RED}Erreur: Clé de déverrouillage non trouvée${RESET}"
            exit 1
        fi
    fi
    
    # Utiliser le token root sauvegardé
    if [ -f "$ROOT_TOKEN_FILE" ]; then
        ROOT_TOKEN=$(cat $ROOT_TOKEN_FILE)
        export VAULT_TOKEN=$ROOT_TOKEN
    else
        echo -e "${RED}Erreur: Token root non trouvé${RESET}"
        exit 1
    fi
fi

# Activer le moteur de secrets KV v2 si ce n'est pas déjà fait
if ! curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/sys/mounts | grep '"secret/"' > /dev/null; then
    curl -k -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -d '{"type":"kv","options":{"version":"2"}}' $VAULT_ADDR/v1/sys/mounts/secret
fi

###################
#     SQLITE
###################
if curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/sqlite 2>/dev/null | grep '"data"' > /dev/null; then
	echo -e "${GREEN}✓ SQLite configuré${RESET}"
else
	curl -k -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -d "{\"data\":{\"username\":\"${DB_USERNAME}\",\"password\":\"${DB_PASSWORD}\"}}" $VAULT_ADDR/v1/secret/data/sqlite
	echo -e "${GREEN}✓ SQLite configuré${RESET}"
fi

###################
#      NGINX
###################
if curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/nginx 2>/dev/null | grep '"data"' > /dev/null; then
	echo -e "${GREEN}✓ Nginx configuré${RESET}"          
else
	curl -k -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -d "{\"data\":{\"username\":\"${NGINX_USERNAME}\",\"password\":\"${NGINX_PASSWORD}\"}}" $VAULT_ADDR/v1/secret/data/nginx
	echo -e "${GREEN}✓ Nginx configuré${RESET}"
fi

if ! command -v htpasswd > /dev/null; then
	echo -e "${RED}htpasswd requis${RESET}"
	exit 1
fi

NGINX_DIR="/nginx/passwd"
HTPASSWD_FILE="$NGINX_DIR/.htpasswd"

# Vérifier si le fichier .htpasswd existe déjà
if [ ! -f "$HTPASSWD_FILE" ]; then
	nginx_user_response=$(curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/nginx)
	nginx_pass_response=$(curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/nginx)
	nginx_user=$(echo $nginx_user_response | jq -r '.data.data.username')
	nginx_pass=$(echo $nginx_pass_response | jq -r '.data.data.password')
	mkdir -p "$NGINX_DIR"
	htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass"
fi

###################
#       JWT
###################
if curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/jwt 2>/dev/null | grep '"data"' > /dev/null; then
    echo -e "${GREEN}✓ JWT configuré${RESET}"
else
    # Générer un secret JWT sécurisé (alphanumeric uniquement pour éviter les problèmes d'échappement)
    JWT_SECRET=$(openssl rand -hex 32)
    curl -k -s -X POST -H "X-Vault-Token: $VAULT_TOKEN" -d "{\"data\":{\"secret\":\"${JWT_SECRET}\"}}" $VAULT_ADDR/v1/secret/data/jwt
    echo -e "${GREEN}✓ JWT configuré${RESET}"
fi

# Vérification finale que tous les secrets sont bien configurés
secrets_ok=true

# Faire toutes les vérifications en parallèle pour gagner du temps
sqlite_check=$(curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/sqlite || echo "error")
nginx_check=$(curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/nginx || echo "error")
jwt_check=$(curl -k -s -H "X-Vault-Token: $VAULT_TOKEN" $VAULT_ADDR/v1/secret/data/jwt || echo "error")

# Vérifier SQLite
if ! echo "$sqlite_check" | grep '"data"' > /dev/null; then
    secrets_ok=false
fi

# Vérifier Nginx
if ! echo "$nginx_check" | grep '"data"' > /dev/null; then
    secrets_ok=false
fi

# Vérifier JWT
if ! echo "$jwt_check" | grep '"data"' > /dev/null; then
    secrets_ok=false
fi

if [ "$secrets_ok" != true ]; then
    echo -e "${RED}Erreur configuration secrets${RESET}"
    exit 1
fi