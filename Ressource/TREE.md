============ PROJECT STRUCTURE ============

Transcendance/
|
|── README.md
|
|── Frontend/
|	├── public/
|	│	├── index.html
|	│	└── assets/
|	├── src/
|	│	├── css/
|	│	│	└── tailwind.css			 # Fichier de base avec les directives Tailwind
|	│	├── js/
|	│	├── babylonjs/					 # Remplace le dossier threejs par celui pour Babylon.js
|	│	├── components/
|	│	├── views/
|	│	└── app.js
|	├── package.json						# Pour gérer les dépendances (ex: Tailwind, PostCSS…)
|	├── tailwind.config.js				# Configuration de Tailwind
|	└── postcss.config.js				 # Configuration de PostCSS (si nécessaire)
|
|── Backend/
|	├── Fastify/							 # Nouvelle application Fastify
|	│	├── Dockerfile
|	│	├── package.json				# Dépendances Node.js (Fastify, plugins, etc.)
|	│	├── server.js					  # Point d’entrée du serveur Fastify
|	│	├── config/
|	│	│	└── default.js				# Configuration générale (ports, environnement, etc.)
|	│	├── plugins/
|	│	│	└── db.js					  # Plugin pour initialiser la connexion à SQLite
|	│	├── routes/						 # Définition des routes
|	│	│	├── authRoutes.js			# Exemple : routes pour l’authentification
|	│	│	├── paymentRoutes.js		# Exemple : routes pour le paiement
|	│	│	└── coreRoutes.js			# Exemple : routes pour la logique principale
|	│	├── controllers/				  # Logique métier et gestion des requêtes
|	│	│	├── authController.js
|	│	│	├── paymentController.js
|	│	│	└── coreController.js
|	│	└── models/						 # Définition des modèles et accès à SQLite
|	│		 ├── usersModel.js
|	│		 ├── paymentModel.js
|	│		 └── coreModel.js
|	├── nginx/
|	│	└── default.conf				  # Configuration de Nginx (à adapter pour pointer sur Fastify)
|	└── docker-compose.yml				# Pour orchestrer l’application Fastify et Nginx
|
|── Devops/
|	├── grafana/
|	│	├── dashboards/
|	│	└── provisioning/
|	├── prometheus/
|	│	└── prometheus.yml
|	├── elk/
|	│	├── elasticsearch/
|	│	├── logstash/
|	│	└── kibana/
|	└── docker-compose.yml
|
|── Security/
|	├── Modsecurity/
|	│	└── modsecurity.conf
|	├── Vault/
|	│	├── vault-config.hcl
|	│	└── policies/
|	├── Sonarqube/
|	│	└── sonar-project.properties
|	├── Dependency-check/
|	│	└── dependency-check-config.yml
|	└── Docker-compose.yml
|
|── Data/								# Pas sur de l'utilite
|	├── sqlite_data/					# Répertoire pour stocker la base SQLite (remplace postgres_data)
|	├── vault_data/
|	├── elasticsearch_data/
|	└── prometheus_data/
|
|── Scripts/
|	├── backup.sh
|	├── deploy.sh
|	└── monitor.sh
|
|── .env
|── .gitignore
|── docker-compose.yml					# Docker Compose global (si nécessaire pour orchestrer l’ensemble)

============ IN DOCKERS ============

- Fastify Container:

/app						//app est une convention rependue, et une bonne pratique.
 ├── package.json
 ├── package-lock.json (si présent)
 ├── server.js				// ou le point d'entrée de ton application
 ├── node_modules/			// dépendances installées
 └── ...					// autres fichiers source et dossiers (controllers, routes, etc.)

- Nginx Container :

/
├── etc
│	└── nginx
│		 ├── nginx.conf		// Notre configuration (si monté en volume)
│		 ├── conf.d			// Fichiers de configuration additionnels
│		 └── ...			// Autres fichiers de configuration
├── usr
│	└── share
│		 └── nginx
│			  └── html		// Contenu statique par défaut (souvent remplacé par des volumes)
└── var
	 └── log
		  └── nginx			// Logs d'accès et d'erreur

============ IN HASHICORP VAULT ============

- Hashicorp Vault :
	* kv/
		+ data/
			- fastify/
				- DB_USER
				- DB_PASSWORD
				- ...
			- nginx/
				- NGINX_USER
				- NGINX_PASSWORD
				- ...
			- elk/
				- ELASTICSEARCH_USER
				- ELASTICSEARCH_PASSWORD
				- KIBANA_USER
				- KIBANA_PASSWORD
				- ...
			- sqlite/
				- username
				- password
				- ...
		+ metadata/
			- fastify/
			...
		+ policies/
			- fastify/
			- nginx/
			- elk/
			- sqlite/
			- vault/
			- sonarqube/
			- dependency-check/
			- modsecurity/
			...

