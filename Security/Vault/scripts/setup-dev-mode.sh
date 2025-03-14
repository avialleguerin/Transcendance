#!/bin/sh
echo -e "\n\n\033[32m📦 Démarrage de Vault en mode Dev...\033[0m"

export VAULT_ADDR="http://127.0.0.1:8200"
#root_token  # Mode dev fixe le token à "root"

# Démarrer Vault en mode dev (sans TLS, avec un token root fixe)
vault server -dev -dev-root-token-id=$root_token &

# Attendre que Vault soit accessible
echo -e "\n\033[33m⏳ Attente de la disponibilité de Vault...\033[0m"
until curl -s $VAULT_ADDR/v1/sys/health | grep '"initialized":true' > /dev/null; do
    sleep 2
done

echo -e "\033[32m✅ Vault est démarré en mode Dev !\033[0m"

# Définir le token root
export VAULT_TOKEN=$root_token

# Vérifier si KV v2 est activé
if ! vault secrets list | grep -q "kv/"; then
    echo -e "\n\033[32m📦 Activation du secret manager KV v2...\033[0m"
    vault secrets enable -path=kv kv-v2
else
    echo -e "\033[33m⚠️  KV v2 est déjà activé.\033[0m"
fi

# Ajouter un secret SQLite (exemple)
echo -e "\n\033[32m📦 Ajout du secret SQLite...\033[0m"
vault kv put kv/sqlite # add username and password

echo -e "\n\033[32m✅ Script terminé avec succès en mode Dev !\033[0m"
