FROM alpine:latest

WORKDIR /vault

# Télécharger Vault directement depuis HashiCorp
RUN wget -q https://releases.hashicorp.com/vault/1.15.0/vault_1.15.0_linux_amd64.zip \
    && unzip vault_1.15.0_linux_amd64.zip \
    && chmod +x vault \
    && mv vault /usr/local/bin/ \
    && rm vault_1.15.0_linux_amd64.zip


CMD ["vault", "server", "-dev"]