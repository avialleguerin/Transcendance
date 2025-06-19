### Lancer Docker Compose

```bash
docker compose up --build
docker compose up --build -d # Lancer en arrière-plan
docker compose down
```

### Rafraîchir avec Nodemon

```bash
npm install --save-dev nodemon
```

Configurer `package.json` pour utiliser Nodemon.

---

## Gestion des logs - par outils

### Nginx

Modifier `MiniBackend/Nginx/default.conf` :

```nginx
access_log /dev/null;
```

### Fastify

Configurer le logger dans le code :

```javascript
export const fastify = Fastify({ logger: false });
```

### SQLite

Activer les logs dans la console :

```javascript
export const db = new Database('database.sqlite', { verbose: console.log });
```

## Gestion des logs - par le Makefile

```Makefile
@docker compose up --no-attach vault --no-attach redis
```
___
___

# 🧠 Git Cheatsheet — Commandes utiles

### 🔁 Renommer une branche

```bash
git branch -m ancien-nom nouveau-nom
# Exemple : git branch -m service/django main
```

### Supprimer une branche

```bash
git branch -d nom-branche            # Supprimer en local (si fusionnée)
git branch -D nom-branche            # Supprimer en local (forcé)
git push origin --delete nom-branche # Supprimer à distance
```

### 🧹 Vider une branche (réinitialiser l’historique)

#### Sans créer une nouvelle branche :

```bash
git checkout main
git reset --soft $(git commit-tree HEAD^{tree} -m "Nouveau départ")
git push --force origin main
```

### 🕰️ Revenir en arrière sur des commits

```bash
git reset --soft HEAD~1     # Supprimer dernier commit, garder dans staging
git reset --mixed HEAD~1    # Supprimer dernier commit, garder les fichiers
git reset --hard HEAD~1     # Supprimer commit + changements
```

#### Revenir à un commit précis :

```bash
git reset --hard <commit-hash>
git push --force
```

### Réinitialiser une branche par rapport à une autre

```bash
git checkout branche-a-reset
git reset --hard autre-branche
git push --force origin branche-a-reset
```

### 🔀 Fusionner deux branches sans historique commun

```bash
git merge autre-branche --allow-unrelated-histories
```

### Résoudre les erreurs de push (authentification)

#### Si erreur : "Missing or invalid credentials"

```bash
git config --global user.name "TonNom"
git config --global user.email "ton@email.com"
```

#### Reconfigurer le remote en SSH (si HTTPS échoue)

```bash
git remote set-url origin git@github.com:utilisateur/repo.git
```

### 📤 Forcer le push après un reset ou réécriture de l'historique

```bash
git push --force origin main
```
