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

		this.keyPressed = {};
		this.boundKeyDown = this.handleKeyDown.bind(this);
		this.boundKeyUp = this.handleKeyUp.bind(this);
        
		// Debug
		console.log("GameHistory initialisé, nombre d'entrées:", this.gameHistory.length);
	}

	enableControls() {
		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
	}

	disableControls() {
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
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

		// Titre
		c.font = this.tileFont;
		c.textAlign = "center";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, canvas.width / 2, 100);
		c.shadowBlur = 0;

		// Historique
		c.fillStyle = "white";
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.textAlign = "left";
		c.fillText("Game History :", 200, 200);


		// Affichage de l'historique des jeux

		if (this.gameHistory.length > 0) {
			// console.log("Historique des jeux :", this.historyDB.getHistory());
			this.gameHistory.forEach((game, index) => {

				const yPosition = 240 + index * 40; // commence à 240px, et espace de 40px entre chaque
				c.fillText(`${game.game}: Winner: ${game.winner}, Score: ${game.score}`, 400, yPosition);
			});
		} else {
			c.fillText("No game history available", 400, 240);
		}

		const optionPositions = [
			{ x: 900, y: 550 } // position de "Retour"
		];
	
		c.font = this.optionFont;

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];
			if (option === "Retour" && index === this.selectedOption) {
				c.fillStyle = "red"; // Rouge si "Retour" est sélectionné
			}
			else {
				c.fillStyle = "white"; // Sinon blanc
			}
			c.fillText(option, pos.x, pos.y);
			c.fillStyle = "white";
		});
	}

	handleKeyDown(event) {
		const key = event.key;
		if (this.keyPressed[key]) return;
		this.keyPressed[key] = true;

		switch (key) {
			case "ArrowUp":
			case "w":
				this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
				break;
			case "ArrowDown":
			case "s":
				this.selectedOption = (this.selectedOption + 1) % this.options.length;
				break;
			case "Enter":
				this.handleSelect();
				break;
		}
	}

	handleKeyUp(event) {
		this.keyPressed[event.key] = false;
	}

	handleSelect() {
		const selected = this.options[this.selectedOption];
		if (selected === "Retour") {
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}