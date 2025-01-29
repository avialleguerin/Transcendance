# backend/django/Dockerfile

# 1️⃣ Utilisation d'une image officielle Python légère
# Use 3.9 if it's not functionnal
FROM python:3.11-slim

# 2️⃣ Évite la mise en tampon des logs Python pour un affichage immédiat
ENV PYTHONUNBUFFERED=1

# 3️⃣ Définit le dossier de travail à /app
WORKDIR /app

# 4️⃣ Copie les dépendances Python avant l'installation
COPY requirements.txt .

# ✅ Pourquoi ?

# On copie uniquement requirements.txt avant d’installer les dépendances.
# Cela permet d'utiliser le cache Docker :
# Si requirements.txt ne change pas, Docker ne réinstalle pas les dépendances.
# Gain de temps au build 🚀.

# 5️⃣ Installe les dépendances Python sans garder de cache pour alleger le Docker
RUN pip install --no-cache-dir -r requirements.txt

# 🔧 Amélioration possible :
# Si besoin de PostgreSQL ou MySQL, ajoute ces dépendances avant l'installation de pip :
# RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# 6️⃣ Copie tout le projet Django dans le conteneur
COPY . .

# ✅ Pourquoi ?

# Copie tous les fichiers du backend dans /app.
# À faire après l’installation des dépendances pour gagner du temps grâce au cache Docker.

# ⚠️ Attention !
# Évite de copier les fichiers inutiles (ex: .git, __pycache__, venv).

# 7️⃣ Lancement de Gunicorn pour servir Django
CMD ["gunicorn", "transcendence.wsgi:application", "--bind", "0.0.0.0:8000"]

# ✅ Pourquoi ?

# gunicorn est un serveur WSGI performant, bien adapté à la production.
# --bind 0.0.0.0:8000 :
# Accepte les requêtes venant de n'importe quelle adresse IP.
# Important pour fonctionner dans un conteneur Docker.