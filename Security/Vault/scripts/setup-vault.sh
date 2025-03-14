#!/bin/sh

# TODO: Supprimer en production, car montre l'adresse + token
export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_TOKEN=root

# Verify Vault is initialized
if ! vault status | grep -q "Initialized: true"; then
  echo "Initializing Vault..."
  vault operator init -key-shares=1 -key-threshold=1 > /vault/init.txt
fi

# Verify Vault is online
if ! curl -s $VAULT_ADDR/v1/sys/health | grep '"initialized":true'; then
  echo "Vault n'est pas initialisé. Exécute 'vault operator init' manuellement."
  exit 1
fi

echo "Initializing Vault setup..."

# Activer KV v2
vault secrets enable -path=kv kv-v2

# Charger et appliquer les policies
vault policy write sqlite-policy /vault/policies/sqlite-policy.hcl
vault policy write fastify-policy /vault/policies/fastify-policy.hcl

# Créer un rôle avec une durée de vie limitée
vault token create -policy=fastify-policy -ttl=1h -renewable=true > /vault/token.txt

# JWT
# vault kv put secret/data/jwt secret=$JWT_SECRET

echo "📦 Secrets added to Vault successfully."