
FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript
RUN npm install -g pm2

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "server.js"]




# ========================================
# ========================================
# ========================================
# ========================================
# ========================================
# ========================================

# # 1️⃣ Utilisation d'une image Node.js légère et stable
# # Utilisation de la version LTS pour garantir la stabilité
# FROM node:20-slim

# # 2️⃣ Définit le dossier de travail
# WORKDIR /app

# # 3️⃣ Copie les fichiers de dépendances avant le reste du code
# # COPY package.json package-lock.json ./
# COPY package*.json ./

# # ✅ Pourquoi ?
# # Docker utilisera le cache pour éviter de réinstaller les dépendances
# # si elles n'ont pas changé.


# # 4️⃣ Installation des dépendances
# # RUN npm install --omit=dev --no-cache
# # RUN npm install
# RUN npm install -g typescript

# # ✅ Pourquoi ?
# # --omit=dev : N'installe pas les dépendances de développement en prod.
# # --no-cache : Évite de stocker des fichiers inutiles.


# # 5️⃣ Copie du code source dans le conteneur
# COPY . .

# # ✅ Pourquoi ?
# # On copie le code après l’installation des dépendances pour maximiser l’utilisation du cache Docker.


# # 6️⃣ Compilation des fichiers TypeScript en JavaScript
# # Cette étape doit générer par exemple un fichier server.js (ou dans un dossier "dist", auquel cas adapter la commande de démarrage)
# RUN npm run build


# # 7️⃣ Expose le port utilisé par Fastify
# EXPOSE 3000

# # 8️⃣ Installation globale de PM2 pour la gestion du processus en production
# RUN npm install -g pm2

# # 9️⃣ Commande de démarrage
# # Ici, on démarre l'application avec PM2.
# # Si ton fichier d'entrée est compilé en "server.js", utilise-le.
# CMD ["pm2-runtime", "server.js"]

# # ✅ Pourquoi ces étapes ?
# # - Copier package*.json avant le code permet de réutiliser le cache Docker pour npm install.
# # - La commande "npm run build" compile ton code TypeScript en JavaScript.
# # - PM2 assure la gestion du processus et un redémarrage automatique en cas de crash.
