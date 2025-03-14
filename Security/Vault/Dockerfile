FROM alpine:latest

# WORKDIR /Vault

# Télécharger Vault directement depuis HashiCorp
RUN wget -q https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip \
    && unzip vault_1.15.0_linux_amd64.zip \
    && chmod +x vault \
    && mv vault /usr/local/bin/ \
    && rm vault_1.15.0_linux_amd64.zip

# Installer Vault et dépendances
# RUN apk add --no-cache vault jq curl
RUN apk add --no-cache jq curl file

# Définir les répertoires pour config, policies et scripts
RUN mkdir -p /vault/config /vault/policies /vault/scripts

# Copier les fichiers nécessaires
COPY config/vault-config.hcl /vault/config/
COPY policies/*.hcl /vault/policies/
COPY scripts/setup-vault.sh /vault/scripts/

# Donner les permissions d'exécution aux scripts
RUN chmod +x /vault/scripts/setup-vault.sh


ENV VAULT_ADDR=http://127.0.0.1:8200

# CMD ["vault", "server", "-dev", "-dev-listen-address=0.0.0.0:8200"]
# Démarrer Vault et exécuter le script de configuration
RUN ls /vault/scripts/
CMD vault server -config=/vault/config/vault-config.hcl & sleep 5 && /vault/scripts/setup-vault.sh && fg
