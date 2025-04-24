import { c, canvas } from "./constants.js";
import { gameState, GameState } from "./constants.js";

export default class EndGameFirstGame {
	constructor ({position, width, height, gameCanvas, player, coins}) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.GameIsFinished = false;
		this.nb_player_play_game = 0;
		this.first_game_finished = false;
		// this.image = new Image();
		// this.image.src = "/static/img/platformer/gameover.png";
		// this.loaded = false;
		// this.image.onload = () => {
		// 	this.loaded = true;
		// };
		this.gameCanvas = gameCanvas;
		this.player = player;
		this.coins = coins;
		this.Score = 0;
		this.ScoreText = "Score : " + this.Score;
		this.ScoreFont = "20px 'Press Start 2P', Black Ops One";

		this.title = "Game Finished";
		this.titleFont = "bold 40px Black Ops One";
		this.optionFont = "20px 'Press Start 2P', Black Ops One";
		this.optionSpacing = 60;
		this.time_endGame = 0;
		this.option1 = "Player 2, Your Time Has Come – Press ENTER";
		this.option2 = "Game Stats : "
		this.gameCanvasFont = "20px 'Press Start 2P', Black Ops One";
		this.option3 = "Score : ";

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

		if (key === "Enter") {
			this.handleSelect();
		}
	}

	handleKeyUp(event) {
		this.keyPressed[event.key] = false;
	}

	handleSelect()
	{
		console.log("Game Finished");
		this.first_game_finished = true;
		
		// 🔁 Reset le joueur
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
		gameState.previous = gameState.current;
		gameState.current = GameState.Play;
		this.disableControls();
	}
	
	draw() {
		this.enableControls();
		this.CoinCollected = "Coin Collected : " + this.gameCanvas.nb_coin_text;
		this.time_endGame = "Time : " + this.gameCanvas.timer + " seconds";
		this.Score = (300 - this.gameCanvas.timer) + this.gameCanvas.nb_coin * 100;
		this.ScoreText = this.Score;

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
		c.fillText(this.CoinCollected, 100, 250);

		//time text

		c.fillStyle = "white";
		c.font = this.gameCanvasFont;
		c.fillText(this.time_endGame, 100, 280);

		c.font = this.optionFont;
		c.fillStyle = "white";
		c.shadowColor = "#000";
		c.fillText(this.option1, 250, 400);

		c.fillStyle = "gold";
		c.fillText(this.option2, 100, 200);
		c.fillStyle = "white";

		c.fillStyle = "gold";
		c.fillText(this.option3, 700, 200);
		c.fillStyle = "white";
		c.font = this.ScoreFont;
		c.fillText(this.ScoreText, 790, 200);
		
		c.shadowBlur = 0; // reset
	}

	checkCollision(player) {
		const hitboxOffsetX = 60;
		const hitboxOffsetY = 90;
		const hitboxOffsetBottom = 25;
	
		const hitboxX = player.position.x + hitboxOffsetX;
		const hitboxY = player.position.y + hitboxOffsetY;
		const hitboxWidth = player.width - hitboxOffsetX * 2;
		const hitboxHeight = player.height - hitboxOffsetY - hitboxOffsetBottom;
	
		// Vérifie l'intersection entre la hitbox du joueur et la boîte
		const collision = hitboxX < this.position.x + this.width &&
						hitboxX + hitboxWidth > this.position.x &&
						hitboxY < this.position.y + this.height &&
						hitboxY + hitboxHeight > this.position.y;
		
		// if (collision)
		// {
		// 	this.GameIsFinished = true;
		// 	this.nb_player_play_game++;
		// 	if (this.nb_player_play_game === 1)
		// 	{
		// 		this.draw();
		// 		this.first_game_finished = true;
		// 	}
		// 	else if (this.nb_player_play_game === 2 && this.first_game_finished)
		// 	{
		// 		this.GameIsFinished = true;
		// 		this.nb_player_play_game = 0;
		// 	}
		// }
	
		return collision;
	}
}