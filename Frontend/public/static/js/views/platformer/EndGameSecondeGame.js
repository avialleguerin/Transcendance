import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";

export default class EndGameSecondeGame{
	constructor ({gameCanvas, player, coins, EndGame_FirstGame, historyGame, MapMenu}) {
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


		this.keyPressed = {};
		this.boundKeyDown = this.handleKeyDown.bind(this);
		this.boundKeyUp = this.handleKeyUp.bind(this);


	}

	enableControls() {
		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
	}

	disableControls() {
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
	}

	handleKeyDown(event) {
		const key = event.key;
		// if (this.keyPressed[key]) return;
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

	handleSelect()
	{
		console.log("Game Finished");
		const selected = this.options[this.selectedOption];
		console.log("selected =", selected);
		if (selected === "Menu")
		{
			// 🔁 Reset le joueur
			this.EndGame_FirstGame.first_game_finished = false;
			console.log("Resetting player...");
			console.log("this.winner =", this.winner);
			console.log("this.Score =", this.Score);
			console.log("this.gameCanvas.timer =", this.gameCanvas.timer);
			console.log("this.nbGame =", this.MapMenu.nb_game_started);

			if (this.Score > this.EndGame_FirstGame.Score)
			{
				this.WinnerScore = this.Score;
			}
			else
			{
				this.WinnerScore = this.EndGame_FirstGame.Score;
			}

			this.historyGame.saveGameIfNeeded(this.MapMenu.nb_game_started, this.winner, this.WinnerScore, this.gameCanvas.timer);
			if (this.player && typeof this.player.reset_Game === "function") {
				this.player.reset_Game();
			}
			
			// 🔁 Reset la GameCanvas (à adapter selon ta classe GameCanvas)
			if (this.gameCanvas) {
				this.gameCanvas.nb_coin = 0;
				this.gameCanvas.timer = 0;
				// ajoute d'autres resets si t’en as (plateformes, objets, etc.)
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
			
			// 🔁 Change l’état du jeu
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.MapMenu;
		}

		if (selected === "Restart") {
			// 🔁 Reset le joueur
			this.EndGame_FirstGame.first_game_finished = false;
			if (this.player && typeof this.player.reset_Game === "function") {
				this.player.reset_Game();
			}
			
			// 🔁 Reset la GameCanvas (à adapter selon ta classe GameCanvas)
			if (this.gameCanvas) {
				this.gameCanvas.nb_coin = 0;
				this.gameCanvas.timer = 0;
				// ajoute d'autres resets si t’en as (plateformes, objets, etc.)
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
			
			// 🔁 Change l’état du jeu
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Play;
		}
	}

	draw() {
		this.enableControls();
		this.CoinCollected = "Coin Collected : " + this.gameCanvas.nb_coin_text;
		this.time_endGame = "Time : " + this.gameCanvas.timer + " seconds";
		this.Score = (300 - this.gameCanvas.timer) + this.gameCanvas.nb_coin * 100;
		this.ScoreText = this.Score;
		this.option5 = "Player 1 has finished the game with : " + this.EndGame_FirstGame.Score + " score";
		this.option6 = "Player 2 has finished the game with : " + this.Score + " score";

		if (this.EndGame_FirstGame.Score > this.Score)
		{
			this.winner = "Player 1";
		}
		else if (this.EndGame_FirstGame.Score < this.Score)
		{
			this.winner = "Player 2";
		}

		this.option7 = this.winner;


		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.font = this.titleFont;
		c.textAlign = "left";
		c.fillStyle = "#FFD700"; // doré
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, 350, 50);

		//coin text

		c.fillStyle = "white";
		c.font = this.gameCanvasFont;
		c.fillText(this.CoinCollected, 100, 150);

		//time text

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
		c.shadowBlur = 0; // reset
		
		const optionPositions = [
			{x : 900, y : 550}, // position de "Menu"
			{x : 900, y : 520}, // position de "Restart"
		];

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];
			if (index === this.selectedOption) {
				c.fillStyle = "#00FFFF"; // Bleu si autre option sélectionnée
			} else {
				c.fillStyle = "white"; // Sinon blanc
			}
			c.fillText(option, pos.x, pos.y);
		});
		
	}
}