# Nom du script Node.js
NODE_SCRIPT = server.js

# PID file pour stocker le processus en arrière-plan
PID_FILE = .node_pid

# Commande pour exécuter Node.js avec redirection des logs
RUN_CMD = node $(NODE_SCRIPT) > logs.txt 2>&1 & echo $$! > $(PID_FILE)

# Lancer le serveur et stocker le PID
start:
	@echo "🚀 Lancement du serveur Node.js..."
	@$(RUN_CMD)
	@sleep 1
	@echo "✅ Serveur lancé avec succès (PID: `cat $(PID_FILE)`)."

# Arrêter le serveur proprement
stop:
	@if [ -f $(PID_FILE) ]; then \
		PID=`cat $(PID_FILE)`; \
		echo "🛑 Arrêt du serveur (PID: $$PID)..."; \
		kill $$PID && rm -f $(PID_FILE); \
		echo "✅ Serveur arrêté."; \
	else \
		echo "❌ Aucun serveur en cours d'exécution."; \
	fi

# Afficher les logs en temps réel dans VS Code Output Panel
logs:
	@tail -f logs.txt

# Nettoyer les fichiers temporaires
clean: stop
	@rm -f $(PID_FILE) logs.txt
	@echo "🧹 Nettoyage terminé."

.PHONY: start stop logs clean
