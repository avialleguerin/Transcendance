# Politique pour l'accès aux secrets SQLite via KV v2
path "secret/data/sqlite" {
  capabilities = ["read"]
}

path "secret/metadata/sqlite" {
  capabilities = ["read"]
}

# Permet de vérifier le token courant
path "auth/token/lookup-self" {
  capabilities = ["read"]
}