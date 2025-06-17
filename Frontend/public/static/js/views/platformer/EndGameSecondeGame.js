import { c, canvas } from "./constants.js";
import { gameState, GameState, setIsFirstGame } from "./constants.js";

export default class EndGameSecondeGame {
	constructor({gameCanvas, player, coins, EndGame_FirstGame, historyGame, MapMenu}) {
		this.nb_player_play_game = 0;
		this.seconde_game_finished = false;
		this.gameCanvas = gameCanvas;
		this.player = player;
		this.coins = coins;
		this.Score = 0;
		this.ScoreText = "Score : " + this.Score;
		this.ScoreFont = "20px 'Press Start 2P', Black Ops One";
		this.options = ["Menu", "Restart"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.historyGame = historyGame;

		this.EndGame_FirstGame = EndGame_FirstGame;
		this.MapMenu = MapMenu;

		this.title = "Game Finished";
		this.titleFont = "bold 40px Black Ops One";
		this.optionFont = "20px 'Press Start 2P', Black Ops One";
		this.optionSpacing = 60;
		this.time_endGame = 0;
		this.option2 = "Game Stats : ";
		this.gameCanvasFont = "20px 'Press Start 2P', Black Ops One";
		this.option3 = "Score : ";

		this.option4 = "Game Result : ";
		this.option5 = "";
		this.option6 = "";
		this.option7 = "";
		this.option8 = "Winner : ";
		this.winner = "";
		this.WinnerScore = 0;

		this.option5font = "15px 'Press Start 2P', Black Ops One";
		this.option6font = "20px 'Press Start 2P', Black Ops One";

		this.hoveredOption = -1;
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);

		this.buttonAreas = [
			{ option: "Menu", x: 880, y: 530, width: 100, height: 30 },
			{ option: "Restart", x: 880, y: 500, width: 120, height: 30 }
		];
	}

	enableControls() {
		window.addEventListener("mousemove", this.boundMouseMove);
		window.addEventListener("click", this.boundMouseClick);
	}

	disableControls() {

		window.removeEventListener("mousemove", this.boundMouseMove);
		window.removeEventListener("click", this.boundMouseClick);
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

		if (this.hoveredOption === -1) {
			canvas.style.cursor = 'default';
		}
	}

	handleMouseClick(event)
	{
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		for (let i = 0; i < this.buttonAreas.length; i++) {
			const button = this.buttonAreas[i];
			if (x >= button.x && x <= button.x + button.width &&
				y >= button.y && y <= button.y + button.height)
			{
				this.selectedOption = i;
				this.handleSelect();
				break;
			}
		}
	}
	handleSelect()
	{
		console.log("Game Finished");
		const selected = this.options[this.selectedOption];
		console.log("selected =", selected);
		if (selected === "Menu")
		{
			this.EndGame_FirstGame.first_game_finished = false;

			if (this.Score > this.EndGame_FirstGame.Score)
			{
				this.WinnerScore = this.Score;
				localStorage.setItem("score_player1", this.Score);
				console.log("this.EndGame_FirstGame.Score =", this.EndGame_FirstGame.Score);
				localStorage.setItem("score_player2", this.EndGame_FirstGame.Score);
			}
			else
			{
				this.WinnerScore = this.EndGame_FirstGame.Score;
				localStorage.setItem("score_player1", this.EndGame_FirstGame.Score);
				localStorage.setItem("score_player2", this.Score);
			}
			// this.MapMenu.nb_game_started++;
			// if (!localStorage.getItem('platformer_game_created'))
			window.create_platformer();
			// this.historyGame.saveGameIfNeeded(this.MapMenu.nb_game_started, this.winner, this.WinnerScore, this.gameCanvas.timer);
			if (this.player && typeof this.player.reset_Game === "function")
				this.player.reset_Game();
			if (this.gameCanvas)
			{
				this.gameCanvas.nb_coin = 0;
				this.gameCanvas.timer = 0;
			}
			
			if (this.coins && Array.isArray(this.coins)) {
				console.log("this.coins =", this.coins);
				console.log("Resetting coins...");
				this.coins.forEach(coins => {
					if (typeof coins.Reset_coin === "function") {
						coins.Reset_coin();
					}
				});
			}
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.MapMenu;
			setIsFirstGame(true);
		}

		if (selected === "Restart") {
			localStorage.removeItem('platformer_game_created');
			this.EndGame_FirstGame.first_game_finished = false;
			if (this.player && typeof this.player.reset_Game === "function") {
				this.player.reset_Game();
			}
			if (this.gameCanvas)
			{
				this.gameCanvas.nb_coin = 0;
				this.gameCanvas.timer = 0;
			}
			
			if (this.coins && Array.isArray(this.coins)) {
				console.log("this.coins =", this.coins);
				console.log("Resetting coins...");
				this.coins.forEach(coins => {
					if (typeof coins.Reset_coin === "function") {
						coins.Reset_coin();
					}
				});
			}
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Play;
		}
	}

	draw()
	{
		this.enableControls();
		this.CoinCollected = "Coin Collected : " + this.gameCanvas.nb_coin_text;
		this.time_endGame = "Time : " + this.gameCanvas.timer + " seconds";
		this.Score = (300 - this.gameCanvas.timer) + this.gameCanvas.nb_coin * 100;
		this.ScoreText = this.Score;
		this.option5 = `${localStorage.getItem("Player1")} has finished the game with : ` + this.EndGame_FirstGame.Score + " score";
		this.option6 = `${localStorage.getItem("Player2")} has finished the game with : ` + this.Score + " score";

		if (this.EndGame_FirstGame.Score > this.Score)
		{
			this.winner = `${localStorage.getItem("Player1")}`;
		}
		else if (this.EndGame_FirstGame.Score < this.Score)
		{
			this.winner = `${localStorage.getItem("Player2")}`;
		}
		this.option7 = this.winner;

		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.font = this.titleFont;
		c.textAlign = "left";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, 350, 50);

		c.fillStyle = "white";
		c.font = this.gameCanvasFont;
		c.fillText(this.CoinCollected, 100, 150);

		c.fillStyle = "white";
		c.font = this.gameCanvasFont;
		c.fillText(this.time_endGame, 100, 180);

		c.font = this.optionFont;
		c.fillStyle = "gold";
		c.fillText(this.option2, 100, 100);
		

		c.fillStyle = "gold";
		c.fillText(this.option3, 700, 100);
		c.fillStyle = "white";
		c.font = this.ScoreFont;
		c.fillText(this.ScoreText, 790, 100);

		c.font = this.ScoreFont;
		c.fillStyle = "gold";
		c.fillText(this.option4, 100, 300);


		c.font = this.option5font;
		c.fillStyle = "white";
		c.fillText(this.option5, 260, 300);


		c.font = this.option5font;
		c.fillStyle = "white";
		c.fillText(this.option6, 260, 330);

		c.font = this.ScoreFont;
		c.fillStyle = "gold";
		c.fillText(this.option8, 100, 450);

		c.font = this.option6font;
		c.fillStyle = "green";
		c.fillText(this.option7, 200, 450);
		c.shadowBlur = 0;
		
		const optionPositions = [
			{x: 900, y: 550},
			{x: 900, y: 520},
		];

		this.buttonAreas[0] = { 
			option: "Menu", 
			x: optionPositions[0].x - 20, 
			y: optionPositions[0].y - 20, 
			width: 100, 
			height: 30 
		};
		this.buttonAreas[1] = { 
			option: "Restart", 
			x: optionPositions[1].x - 20, 
			y: optionPositions[1].y - 20, 
			width: 120, 
			height: 30 
		};

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
}