#!/bin/bash

# Créer le répertoire pour les certificats
mkdir -p /etc/nginx/conf

# Générer la clé privée
openssl genrsa -out /etc/nginx/conf/server.key 2048

# Générer le certificat auto-signé
openssl req -new -x509 -key /etc/nginx/conf/server.key -out /etc/nginx/conf/server.crt -days 365 -subj "/C=FR/ST=Paris/L=Paris/O=Transcendance/OU=IT/CN=localhost"

echo "Certificats SSL générés avec succès!"