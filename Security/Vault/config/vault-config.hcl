# Stockage des données de Vault sur le disque
storage "file" {
  # Chemin du répertoire de stockage des données
  path = "/vault/data"
}

listener "tcp" {
  # Adresse IP et port d'écoute
  address     = "0.0.0.0:8200"
  # Désactivation du chiffrement TLS (pour le développement uniquement)
  tls_disable = 1
}

api_addr = "http://127.0.0.1:8200"
ui = true
