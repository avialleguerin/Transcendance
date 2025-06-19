FROM alpine:latest

# WORKDIR /Vault

# Télécharger Vault directement depuis HashiCorp
RUN wget -q https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip \
    && unzip vault_1.15.0_linux_amd64.zip \
    && chmod +x vault \
    && mv vault /usr/local/bin/ \
    && rm vault_1.15.0_linux_amd64.zip

RUN apk add --no-cache jq curl file apache2-utils

RUN mkdir -p /vault/config /vault/policies /vault/scripts

COPY config/*.hcl /vault/config/
COPY policies/*.hcl /vault/policies/
COPY scripts/*.sh /vault/scripts/

RUN chmod +x /vault/scripts/setup-vault.sh
RUN chmod +x /vault/scripts/setup-dev-mode.sh

ENV VAULT_ADDR=http://127.0.0.1:8200

#VAULT DEV
# CMD ["vault", "server", "-dev", "-dev-listen-address=0.0.0.0:8200", "&& ./vault/scripts/setup-dev-mode.sh", "&& tail -f /dev/null"]
CMD vault server -dev -dev-listen-address=0.0.0.0:8200 & sleep 1 && ./vault/scripts/setup-dev-mode.sh && tail -f /dev/null



#VAULT PROD
# CMD ["vault", "server", "-config=/vault/config/vault-config.hcl", "&& ./vault/scripts/setup-vault.sh", "&& tail -f /dev/null"]
