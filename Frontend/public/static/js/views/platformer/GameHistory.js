import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";

export default class GameHistory {
	constructor({ EndGame_SecondeGame, historyDB }) {
		this.title = "Game History";
		this.tileFont = "bold 40px Black Ops One";
		this.EndGame_SecondeGame = EndGame_SecondeGame;
		this.historyDB = historyDB;
		this.lastGame = null;
        
		// Chargement immédiat de l'historique depuis la base de données
		this.gameHistory = this.historyDB.getHistory() || [];
        
		// Vérification si nous avons des données à sauvegarder d'une partie précédente
		if (EndGame_SecondeGame && EndGame_SecondeGame.nb_game > 0) {
			this.saveGameIfNeeded(
				EndGame_SecondeGame.nb_game,
				EndGame_SecondeGame.winner,
				EndGame_SecondeGame.score,
				EndGame_SecondeGame.time_endGame
			);
		}

		this.options = ["Retour"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.optionFont = "20px 'Press Start 2P', Black Ops One";
        
        // Ajouter les propriétés pour la gestion de la souris
        this.hoveredOption = -1;  // -1 signifie qu'aucune option n'est survolée
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseClick = this.handleMouseClick.bind(this);
        
        // Définir les zones de clic pour chaque option
        this.buttonAreas = [
            { option: "Retour", x: 900, y: 530, width: 100, height: 40 }
        ];
        
		// Debug
		console.log("GameHistory initialisé, nombre d'entrées:", this.gameHistory.length);
	}

	enableControls()
	{
		window.addEventListener("mousemove", this.boundMouseMove);
		window.addEventListener("click", this.boundMouseClick);
	}

	disableControls()
	{
		window.removeEventListener("mousemove", this.boundMouseMove);
		window.removeEventListener("click", this.boundMouseClick);
	}
	
	saveGameIfNeeded(nb_game, winner, score, time_endGame) {
		console.log("saveGameIfNeeded", nb_game, winner, score, time_endGame);
		if (nb_game > 0 && winner !== "" && score > 0) {
			this.historyDB.addGame(nb_game, winner, score, time_endGame);
			this.gameHistory = this.historyDB.getHistory();
			this.historyDB.saveToLocalStorage();
			console.log("Jeu sauvegardé, nombre d'entrées maintenant:", this.gameHistory.length);
		}
	}

	draw() {
		this.enableControls();
		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		c.font = this.tileFont;
		c.textAlign = "center";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, canvas.width / 2, 100);
		c.shadowBlur = 0;

		c.fillStyle = "white";
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.textAlign = "left";
		c.fillText("Game History :", 200, 200);

		if (this.gameHistory.length > 0)
		{
			this.gameHistory.forEach((game, index) =>
			{
				const yPosition = 240 + index * 40;
				c.fillText(`${game.game}: Winner: ${game.winner}, Score: ${game.score}`, 400, yPosition);
			});
		}
		else
		{
			c.fillText("No game history available", 400, 240);
		}

		const optionPositions = [
			{ x: 900, y: 550 } // position de "Retour"
		];
		
		// Mettre à jour les zones de clic en fonction des positions réelles
        this.buttonAreas[0] = { 
            option: "Retour", 
            x: optionPositions[0].x - 20, 
            y: optionPositions[0].y - 30, 
            width: 100, 
            height: 40 
        };
    
		c.font = this.optionFont;
		c.fillStyle = "white";
		this.options.forEach((option, index) => {
			const pos = optionPositions[index];
			
			if (index === this.hoveredOption)
				c.fillStyle = "#88CCFF";
			else
				c.fillStyle = "white"; // Blanc par défaut
			
			// Appliquer des effets supplémentaires si l'option est survolée
			if (index === this.hoveredOption)
			{
				c.shadowColor = "#88CCFF";
				c.shadowBlur = 15;
				// Optionnellement, agrandir légèrement la police
				c.font = "22px 'Press Start 2P', Black Ops One";
			}
			else
			{
				c.shadowColor = "transparent";
				c.shadowBlur = 0;
				c.font = this.optionFont;
			}
			
			// Dessiner le texte de l'option
			c.fillText(option, pos.x, pos.y);
			
			// Optionnellement, dessiner un contour autour de l'option survolée
			if (index === this.hoveredOption)
			{
				c.strokeStyle = "#88CCFF";
			}
			
			// Réinitialiser les propriétés de shadow pour les prochains dessins
			c.shadowColor = "transparent";
			c.shadowBlur = 0;
		});
	}

	handleSelect() {
		const selected = this.options[this.selectedOption];
		if (selected === "Retour") {
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}

    // Nouvelle méthode pour gérer le mouvement de la souris
    handleMouseMove(event) {
        // Obtenir la position de la souris relative au canvas
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Réinitialiser la valeur de hoveredOption
        this.hoveredOption = -1;
        
        // Vérifier si la souris est sur un bouton
        for (let i = 0; i < this.buttonAreas.length; i++) {
            const button = this.buttonAreas[i];
            if (x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                this.hoveredOption = i;
                canvas.style.cursor = 'pointer';  // Changer le curseur en main
                break;
            }
        }
        
        // Si aucun bouton n'est survolé, remettre le curseur par défaut
        if (this.hoveredOption === -1) {
            canvas.style.cursor = 'default';
        }
    }

    // Nouvelle méthode pour gérer les clics de souris
    handleMouseClick(event) {
        // Obtenir la position du clic relative au canvas
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        // Vérifier si le clic est sur un bouton
        for (let i = 0; i < this.buttonAreas.length; i++) {
            const button = this.buttonAreas[i];
            if (x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                // Définir l'option sélectionnée sur celle qui a été cliquée
                this.selectedOption = i;
                // Exécuter l'action associée à cette option
                this.handleSelect();
                break;
            }
        }
    }
}