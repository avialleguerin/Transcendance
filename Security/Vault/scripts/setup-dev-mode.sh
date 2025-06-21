#!/bin/sh

#colors
RED='\e[0;31m'
GREEN='\e[0;32m'
YELLOW='\e[0;33m'
CYAN='\e[0;36m'
RESET='\e[0m'

set -e

echo -e "\n\n${GREEN}🚀 Démarrage de Vault en mode Dev...${RESET}"

export root_token="${VAULT_DEV_ROOT_TOKEN_ID}"

if [ -z "$root_token" ]; then
    echo -e "\033[31mErreur: VAULT_DEV_ROOT_TOKEN_ID n'est pas défini dans le .env\033[0m"
    exit 1
fi

vault server -dev -dev-root-token-id=$root_token &

echo -e "\n${YELLOW}⏳ Attente de la disponibilité de Vault...${RESET}"
until curl -s $VAULT_ADDR/v1/sys/health | grep -E '"initialized":true|"standby":true' > /dev/null; do
	sleep 2
done
echo -e "${GREEN}Vault est maintenant disponible !${RESET}"

export VAULT_TOKEN=$root_token

###################
#     SQLITE
###################
if vault kv get secret/sqlite >/dev/null 2>&1; then
	echo -e "${YELLOW} Le secret SQLite existe déjà. Pas besoin de l'écraser.${RESET}"
else
	vault kv put secret/sqlite username="${DB_USERNAME}" password="${DB_PASSWORD}"
	echo -e "${GREEN}Secret SQLite ajouté !${RESET}"
fi

###################
#      NGINX
###################
if vault kv get secret/nginx >/dev/null 2>&1; then
	echo -e "${YELLOW} Le secret Nginx existe déjà. Pas besoin de l'écraser.${RESET}"          
else
	vault kv put secret/nginx username="${NGINX_USERNAME}" password="${NGINX_PASSWORD}"
	echo -e "${GREEN}Secret Nginx ajouté !${RESET}"
fi

if ! command -v htpasswd > /dev/null; then
	echo -e "${RED}La commande 'htpasswd' est requise. Installe apache2-utils ou httpd-tools.${RESET}"
	exit 1
fi

echo -e "\n${CYAN}Génération du fichier .htpasswd pour Nginx...${RESET}"
nginx_user=$(vault kv get -field=username secret/nginx)
nginx_pass=$(vault kv get -field=password secret/nginx)
NGINX_DIR="./nginx/passwd"
HTPASSWD_FILE="$NGINX_DIR/.htpasswd"
mkdir -p "$(dirname "$NGINX_DIR")"
htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass"
echo -e "${GREEN}Fichier .htpasswd généré à : $HTPASSWD_FILE${RESET}"

###################
#       JWT
###################
if vault kv get secret/jwt >/dev/null 2>&1; then
    echo -e "${YELLOW} Le secret JWT existe déjà. Pas besoin de l'écraser.${RESET}"
else
    # Générer un secret JWT sécurisé
    JWT_SECRET=$(openssl rand -base64 64)
    vault kv put secret/jwt secret="${JWT_SECRET}"
    echo -e "${GREEN}Secret JWT ajouté !${RESET}"
fi


echo -e "\n${GREEN}Script terminé avec succès en mode Dev !${RESET}"