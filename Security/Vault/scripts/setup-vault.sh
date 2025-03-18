#!/bin/sh
set -e  # Arrêter le script si une commande échoue

echo -e "\n\n\033[32m📦 Début du script d'initialisation de Vault (Production)...\033[0m"

export VAULT_ADDR="http://127.0.0.1:8200"
export root_token=  # 🔥 ⚠️ Remplace par ton token root sécurisé en prod

# Vérifier si Vault est initialisé
if vault status 2>&1 | grep -q "Initialized.*false"; then
    echo -e "\033[31m❌ Vault n'est pas initialisé. Initialise Vault avant d'exécuter ce script.\033[0m"
    exit 1
fi

# Vérifier si Vault est scellé
if vault status 2>&1 | grep -q "Sealed.*true"; then
    echo -e "\033[33m🔒 Vault est scellé. Déverrouillage en cours...\033[0m"

    if [ ! -f /vault/unseal_keys.txt ]; then
        echo -e "\033[31m❌ Fichier des clés d'unseal non trouvé. Assurez-vous qu'il existe à /vault/unseal_keys.txt\033[0m"
        exit 1
    fi

    keys=$(head -n 3 /vault/unseal_keys.txt)

    for key in $keys; do
        vault operator unseal "$key"
        sleep 2
    done

    echo -e "\033[32m✅ Vault est maintenant déverrouillé !\033[0m"
else
    echo -e "\033[32m✅ Vault est déjà déverrouillé.\033[0m"
fi

# Vérifier que Vault est bien déverrouillé avant de continuer
if ! vault status 2>&1 | grep -q "Sealed.*false"; then
    echo -e "\033[31m❌ Vault est toujours scellé. Impossible de continuer.\033[0m"
    exit 1
fi

# Authentification avec le token root
export VAULT_TOKEN=$root_token

# Vérifier si l'authentification fonctionne
if ! vault token lookup &>/dev/null; then
    echo -e "\033[31m❌ Échec de l'authentification avec Vault. Vérifiez le token root.\033[0m"
    exit 1
fi

# Vérifier si KV v2 est déjà activé
if ! vault secrets list | grep -q "secret/"; then
    echo -e "\n\033[32m📦 Activation du secret manager KV v2...\033[0m"
    vault secrets enable -path=secret kv-v2
else
    echo -e "\033[33m⚠️  KV v2 est déjà activé.\033[0m"
fi

# Vérifier si le secret SQLite existe déjà
if vault kv get secret/sqlite >/dev/null 2>&1; then
    echo -e "\033[33m⚠️  Le secret SQLite existe déjà. Pas besoin de l'écraser.\033[0m"
else
    # Ajouter un secret SQLite uniquement s'il n'existe pas encore
    echo -e "\n\033[32m📦 Ajout du secret SQLite...\033[0m"
	########### IMPORTANT
    vault kv put secret/sqlite
    echo -e "\033[32m✅ Secret SQLite ajouté !\033[0m"
fi

echo -e "\n\033[32m✅ Script terminé avec succès en mode Production !\033[0m"





################################ OLD SCRIPT WITH KV##################3
# #!/bin/sh
# echo -e "\n\n\033[32m📦 Début du script d'initialisation de Vault...\033[0m"

# export VAULT_ADDR="http://127.0.0.1:8200"
# # add root token "root token = blablabal"
# export root_token=

# # Vérifier si Vault est initialisé
# if vault status 2>&1 | grep -q "Initialized.*false"; then
# 	echo -e "\033[31m❌ Vault n'est pas encore initialisé. Initialise Vault avant d'exécuter ce script.\033[0m"
# 	exit 1
# fi

# # Vérifier si Vault est scellé
# if vault status 2>&1 | grep -q "Sealed.*true"; then
# 	echo -e "\033[33m🔒 Vault est scellé. Déverrouillage en cours...\033[0m"

# 	if [ ! -f /vault/unseal_keys.txt ]; then
# 		echo -e "\033[31m❌ Fichier des clés d'unseal non trouvé. Assurez-vous qu'il existe à /vault/unseal_keys.txt\033[0m"
# 		exit 1
# 	fi

# 	keys=$(cat /vault/unseal_keys.txt | head -n 3)
	
# 	for key in $keys; do
# 		vault operator unseal "$key"
# 		sleep 2
# 	done

# 	echo -e "\033[32m✅ Vault est maintenant déverrouillé !\033[0m"
# else
# 	echo -e "\033[32m✅ Vault est déjà déverrouillé.\033[0m"
# fi

# # Vérifier que Vault est accessible avant de continuer
# if ! vault status 2>&1 | grep -q "Sealed.*false"; then
# 	echo -e "\033[31m❌ Vault est toujours scellé. Impossible de continuer.\033[0m"
# 	exit 1
# fi

# # Authentification avec le token root
# export VAULT_TOKEN=$root_token

# # Vérification des permissions avant d'exécuter des commandes Vault
# if ! vault token lookup &>/dev/null; then
# 	echo -e "\033[31m❌ Échec de l'authentification avec Vault. Vérifiez le token root.\033[0m"
# 	exit 1
# fi

# # Activer KV v2 seulement si ce n'est pas déjà fait
# if ! vault secrets list | grep -q "kv/"; then
# 	echo -e "\n\033[32m📦 Activation du secret manager kv V2...\033[0m"
# 	vault secrets enable -path=kv kv-v2
# else
# 	echo -e "\033[33m⚠️  KV v2 est déjà activé.\033[0m"
# fi

# # Ajouter un secret uniquement si Vault est déverrouillé
# echo -e "\n\033[32m📦 Ajout du secret SQLite...\033[0m"
# vault kv put kv/sqlite 3 #add here username and password

# echo -e "\n\033[32m✅ Script terminé avec succès !\033[0m"
