import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";

export default class GameHistory {
	constructor({ EndGame_SecondeGame, MapMenu }) {
		this.title = "Game History";
		this.tileFont = "bold 40px Black Ops One";
		this.EndGame_SecondeGame = EndGame_SecondeGame;
		this.MapMenu = MapMenu;
		this.gameHistory = [];

		this.saveGameIfNeeded();
	}

	saveGameIfNeeded() {
		console.log("je suis dans saveGameIfNeededssssssssssssssssssssssssssssssssssssssssssssss");
		console.log("saveGameIfNeeded");
		console.log(this.MapMenu.nb_game_started);
		// console.log(this.EndGame_SecondeGame.EndGame_FirstGame.winner);
		// console.log(this.EndGame_SecondeGame.EndGame_FirstGame.winner);
		console.log(this.EndGame_SecondeGame.winner);
		console.log(this.EndGame_SecondeGame.score);
		console.log(this.EndGame_SecondeGame.time_endGame);
		if (
			this.MapMenu.nb_game_started > 0 &&
			!this.gameHistory.find(g => g.id === this.MapMenu.nb_game_started)
		) {
			console.log("je suis dans saveGameIfNeeded");
			console.log("winnerrrrrrrrrrrrrrrr", this.EndGame_SecondeGame.winner);
			// const winner = this.EndGame_SecondeGame.winner || "Unknown";
			const gameData = {
				id: this.MapMenu.nb_game_started,
				game: `Game ${this.MapMenu.nb_game_started}`,
				winner: this.EndGame_SecondeGame.winner,
				score: this.EndGame_SecondeGame.score || "Unknown",
				time: new Date().toLocaleTimeString()
			};
			this.gameHistory.push(gameData);
		}
	}

	draw() {
		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		// Titre
		c.font = this.tileFont;
		c.textAlign = "center";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, canvas.width / 2, canvas.height / 4);
		c.shadowBlur = 0;

		// Historique
		c.fillStyle = "white";
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.textAlign = "left";
		c.fillText("Game History:", canvas.width / 2, canvas.height / 4 + 50);

		if (this.gameHistory.length > 0) {
			this.gameHistory.forEach((game, index) => {
				const yPosition = (canvas.height / 4) + (index + 2) * 40;
				c.fillText(`${game.game}: Winner : ${game.winner}, Score - ${game.score}, Time - ${game.time}`, canvas.width / 2, yPosition);
			});
		} else {
			c.fillText("No game history available", canvas.width / 2, canvas.height / 2);
		}
	}
}
