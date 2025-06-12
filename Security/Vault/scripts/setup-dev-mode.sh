#!/bin/sh

#colors
RED='\e[0;31m'
GREEN='\e[0;32m'
YELLOW='\e[0;33m'
CYAN='\e[0;36m'
RESET='\e[0m'

set -e  																				# Arrêter le script en cas d'erreur

echo -e "\n\n${GREEN}🚀 Démarrage de Vault en mode Dev...${RESET}"

export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_API_ADDR="http://127.0.0.1:8200"
export root_token="root"																# REVIEW - Token root par défaut pour le mode dev

vault server -dev -dev-root-token-id=$root_token &										# Démarrer Vault en arrière-plan (mode dev, sans TLS, avec un token root fixe)

echo -e "\n${YELLOW}⏳ Attente de la disponibilité de Vault...${RESET}"					# Attendre que Vault soit accessible
until curl -s $VAULT_ADDR/v1/sys/health | grep -E '"initialized":true|"standby":true' > /dev/null; do
	sleep 2
done
echo -e "${GREEN}Vault est maintenant disponible !${RESET}"

export VAULT_TOKEN=$root_token	# Define root token

###################
#     SQLITE
###################
if vault kv get secret/sqlite >/dev/null 2>&1; then										# Vérifier si le secret SQLite existe déjà
	echo -e "${YELLOW} Le secret SQLite existe déjà. Pas besoin de l'écraser.${RESET}"
else
	echo -e "\n${GREEN}Ajout du secret SQLite...${RESET}"								# Ajouter le secret SQLite uniquement si absent
	vault kv put secret/sqlite username="fastify_user" password="secure_password"		# REVIEW - This is a test password
	echo -e "${GREEN}Secret SQLite ajouté !${RESET}"
fi

###################
#      NGINX
###################
if vault kv get secret/nginx >/dev/null 2>&1; then										# Vérifier si le secret Nginx existe déjà
	echo -e "${YELLOW} Le secret Nginx existe déjà. Pas besoin de l'écraser.${RESET}"          
else
	echo -e "\n${GREEN}Ajout du secret Nginx...${RESET}"								# Ajouter le secret Nginx uniquement si absent
	vault kv put secret/nginx username="panel" password="1234"							# REVIEW - This is a test password
	echo -e "${GREEN}Secret Nginx ajouté !${RESET}"
fi

if ! command -v htpasswd > /dev/null; then												# Vérifier si htpasswd est installé
	echo -e "${RED}La commande 'htpasswd' est requise. Installe apache2-utils ou httpd-tools.${RESET}"
	exit 1
fi

echo -e "\n${CYAN}Génération du fichier .htpasswd pour Nginx...${RESET}"				# Création du fichier .htpasswd à partir du secret Vault
nginx_user=$(vault kv get -field=username secret/nginx)									# Récupération des infos depuis Vault
nginx_pass=$(vault kv get -field=password secret/nginx)
NGINX_DIR="./nginx/passwd"														# Dossier cible
HTPASSWD_FILE="$NGINX_DIR/.htpasswd"
mkdir -p "$(dirname "$NGINX_DIR")"
htpasswd -cb "$HTPASSWD_FILE" "$nginx_user" "$nginx_pass"								# Création du fichier .htpasswd avec le mot de passe chiffré
echo -e "${GREEN}Fichier .htpasswd généré à : $HTPASSWD_FILE${RESET}"


echo -e "\n${GREEN}Script terminé avec succès en mode Dev !${RESET}"