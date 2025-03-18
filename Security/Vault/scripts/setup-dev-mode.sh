#!/bin/sh
set -e  # Arrêter le script en cas d'erreur

echo -e "\n\n\033[32m📦 Démarrage de Vault en mode Dev...\033[0m"

export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_API_ADDR="http://127.0.0.1:8200"

####################### IMPORTANT
export root_token="root"

# Démarrer Vault en arrière-plan (mode dev, sans TLS, avec un token root fixe)
vault server -dev -dev-root-token-id=$root_token &

# Attendre que Vault soit accessible
echo -e "\n\033[33m⏳ Attente de la disponibilité de Vault...\033[0m"
until curl -s $VAULT_ADDR/v1/sys/health | grep -E '"initialized":true|"standby":true' > /dev/null; do
    sleep 2
done

echo -e "\033[32m✅ Vault est maintenant disponible !\033[0m"

# Définir le token root
export VAULT_TOKEN=$root_token

# Vérifier si le secret SQLite existe déjà
if vault kv get secret/sqlite >/dev/null 2>&1; then
    echo -e "\033[33m⚠️  Le secret SQLite existe déjà. Pas besoin de l'écraser.\033[0m"
else
    # Ajouter le secret SQLite uniquement si absent
    echo -e "\n\033[32m📦 Ajout du secret SQLite...\033[0m"
    ########################## IMPORTANT
    vault kv put secret/sqlite username="fastify_user" password="secure_password"
    echo -e "\033[32m✅ Secret SQLite ajouté !\033[0m"
fi

echo -e "\n\033[32m✅ Script terminé avec succès en mode Dev !\033[0m"