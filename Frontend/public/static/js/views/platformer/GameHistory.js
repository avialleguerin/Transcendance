import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";
import { get_platformers } from "../../../../api/games.js";

export default class GameHistory {
	constructor({ EndGame_SecondeGame, historyDB }) {
		this.title = "Game History";
		this.tileFont = "bold 40px Black Ops One";
		this.EndGame_SecondeGame = EndGame_SecondeGame;
		this.historyDB = historyDB;
		this.lastGame = null;

		// Initialiser avec un tableau vide et charger les données de façon asynchrone
		this.gameHistory = [];
		this.loadGameHistory();

		this.options = ["Back"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.optionFont = "20px 'Press Start 2P', Black Ops One";

		this.hoveredOption = -1;
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);
		this.buttonAreas = [
			{ option: "Back", x: 900, y: 530, width: 100, height: 40 }
		];
	}

	// Nouvelle méthode pour charger l'historique de façon asynchrone
	async loadGameHistory() {
		try {
			const games = await get_platformers();
			this.gameHistory = games || [];
		} catch (error) {
			console.error("Error loading game history:", error);
			this.gameHistory = [];
		}
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

		c.font = "15px 'Press Start 2P', Black Ops One";
		c.textAlign = "left";

		if (this.gameHistory.length > 0)
		{
			const tableWidth = 600;
			const startX = (canvas.width - tableWidth) / 2;
			
			const columns = {
				player1: startX,
				vs: startX + 120,
				player2: startX + 160,
				score1: startX + 280,
				dash: startX + 320,
				score2: startX + 340,
				winner: startX + 400
			};

			const headerY = 170;
			c.fillStyle = "#FFD700";
			c.font = "12px 'Press Start 2P', Black Ops One";
			c.fillText("PLAYER 1", columns.player1, headerY);
			c.fillText("", columns.vs, headerY);
			c.fillText("PLAYER 2", columns.player2, headerY);
			c.fillText("SCORE", columns.score1, headerY);
			c.fillText("WINNER", columns.winner, headerY);

			c.strokeStyle = "#FFD700";
			c.lineWidth = 1;
			c.beginPath();
			c.moveTo(startX - 10, headerY + 10);
			c.lineTo(startX + tableWidth - 50, headerY + 10);
			c.stroke();

			c.font = "15px 'Press Start 2P', Black Ops One";

			this.gameHistory.forEach((game, index) => {
				const yPosition = 200 + index * 35;
				const isPlayer1Winner = game.score_player1 > game.score_player2;
				const winner = isPlayer1Winner ? game.player1 : game.player2;
				const winnerScore = isPlayer1Winner ? game.score_player1 : game.score_player2;
				
				const player1Color = "#4DA6FF";
				const player2Color = "#FFD700";
				
				if (index % 2 === 0) {
					c.fillStyle = "rgba(255, 255, 255, 0.05)";
					c.fillRect(startX - 20, yPosition - 20, tableWidth, 30);
				}
				
				// Joueur 1
				c.fillStyle = player1Color;
				c.fillText(game.player1, columns.player1, yPosition);
				
				// vs
				c.fillStyle = "white";
				c.fillText("vs", columns.vs, yPosition);
				
				// Joueur 2
				c.fillStyle = player2Color;
				c.fillText(game.player2, columns.player2, yPosition);
				
				// Score
				c.fillStyle = "white";
				c.fillText(`${game.score_player1} - ${game.score_player2}`, columns.score1, yPosition);
				
				// Gagnant
				if (isPlayer1Winner)
				{
					c.fillStyle = player1Color;
					c.shadowColor = "#000000";
				}
				else
				{
					c.fillStyle = player2Color;
					c.shadowColor = "#000000";
				}
				c.shadowBlur = 3;
				c.fillText(`${winner} (${winnerScore})`, columns.winner, yPosition);
				c.shadowBlur = 0;
			});
		}
		else
		{
			c.fillStyle = "white";
			c.fillText("No game found ...",  canvas.width / 2 - 75, canvas.height / 2);
		}

		const optionPositions = [{ x: 900, y: 550 }];

		this.buttonAreas[0] = { 
			option: "Back", 
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
		if (selected === "Back") {
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