# Permet de lire les secrets stockes dans KV (par exemple les identifiants de connexion a la base de donnees) #ancien
path "kv/data/" {
  capabilities = ["read", "list"]
}

# Permet de lire les secrets stockés dans KV v2
path "secret/data/*" {
  capabilities = ["read"]
}

# Permet de lister les secrets
path "secret/metadata/*" {
  capabilities = ["list"]
}


# Permet de recuperer les informations du token courant (par exemple pour connaitre l'identifiant du service)
path "auth/token/lookup-self" {
  capabilities = ["read"]
}