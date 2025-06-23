#!/bin/sh
# Script pour générer des certificats SSL auto-signés pour l'environnement de développement

# Déterminer le répertoire racine du projet (2 niveaux au-dessus du répertoire actuel)
PROJECT_ROOT=$(dirname $(dirname $(dirname $(dirname $(readlink -f $0)))))
SSL_DIR="$PROJECT_ROOT/Security/Nginx/ssl"

echo "Génération des certificats SSL dans: $SSL_DIR"

# Créer un dossier pour les certificats si nécessaire
mkdir -p "$SSL_DIR"

# Générer une clé privée RSA
openssl genrsa -out "$SSL_DIR/server.key" 2048

# Générer une requête de signature de certificat (CSR)
openssl req -new -key "$SSL_DIR/server.key" \
    -out "$SSL_DIR/server.csr" \
    -subj "/C=FR/ST=Paris/L=Paris/O=Transcendance/OU=DevTeam/CN=transcendance.local"

# Générer un certificat auto-signé valide pour 365 jours
openssl x509 -req -days 365 -in "$SSL_DIR/server.csr" \
    -signkey "$SSL_DIR/server.key" \
    -out "$SSL_DIR/server.crt"

# Confirmer la création
echo "Certificats SSL générés avec succès dans: $SSL_DIR"
echo "  - server.key: clé privée"
echo "  - server.csr: requête de signature"
echo "  - server.crt: certificat auto-signé"

# On peut supprimer le CSR car il n'est plus nécessaire
rm "$SSL_DIR/server.csr"

echo "Pour utiliser ces certificats, assurez-vous que les volumes suivants sont correctement configurés dans docker-compose.yml:"
echo " - Pour Nginx:    - ./Security/Nginx/ssl:/etc/nginx/ssl"
echo " - Pour Fastify:  - ./Security/Nginx/ssl:/etc/fastify/ssl"
