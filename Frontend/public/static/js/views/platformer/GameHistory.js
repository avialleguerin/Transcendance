import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";

export default class GameHistory {
	constructor({ EndGame_SecondeGame, historyDB }) {
		this.title = "Game History";
		this.tileFont = "bold 40px Black Ops One";
		this.EndGame_SecondeGame = EndGame_SecondeGame;
		this.historyDB = historyDB;
		this.lastGame = null;

		this.gameHistory = this.historyDB.getHistory() || [];
		if (EndGame_SecondeGame && EndGame_SecondeGame.nb_game > 0)
			this.saveGameIfNeeded(EndGame_SecondeGame.nb_game, EndGame_SecondeGame.winner, EndGame_SecondeGame.score, EndGame_SecondeGame.time_endGame);

		this.options = ["Retour"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.optionFont = "20px 'Press Start 2P', Black Ops One";

		this.hoveredOption = -1;
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);
		this.buttonAreas = [
			{ option: "Retour", x: 900, y: 530, width: 100, height: 40 }
		];
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
			c.fillText("No game history available", 400, 240);

		const optionPositions = [{ x: 900, y: 550 }];

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
				c.fillStyle = "white";

			if (index === this.hoveredOption)
			{
				c.shadowColor = "#88CCFF";
				c.shadowBlur = 15;
				c.font = "22px 'Press Start 2P', Black Ops One";
			}
			else
			{
				c.shadowColor = "transparent";
				c.shadowBlur = 0;
				c.font = this.optionFont;
			}
			
			c.fillText(option, pos.x, pos.y);
			
			if (index === this.hoveredOption)
				c.strokeStyle = "#88CCFF";
			
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

	handleMouseMove(event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		this.hoveredOption = -1;
		
		for (let i = 0; i < this.buttonAreas.length; i++) {
			const button = this.buttonAreas[i];
			if (x >= button.x && x <= button.x + button.width &&
				y >= button.y && y <= button.y + button.height) {
				this.hoveredOption = i;
				canvas.style.cursor = 'pointer';
				break;
			}
		}
		
		if (this.hoveredOption === -1)
			canvas.style.cursor = 'default';
	}

	handleMouseClick(event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		for (let i = 0; i < this.buttonAreas.length; i++) {
			const button = this.buttonAreas[i];
			if (x >= button.x && x <= button.x + button.width &&
				y >= button.y && y <= button.y + button.height) {
				this.selectedOption = i;
				this.handleSelect();
				break;
			}
		}
	}
}