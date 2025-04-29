import { c, canvas, gameState, GameState } from './constants.js';
import { Setgame_started } from './PlatformView.js';

export default class Menu {
	constructor(Game_History) {
		this.title = "⏱️ Chrono Clash";
		this.options = ["▶ Start", "⚙ Options", "☷ History", "✖ Quit" ];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.titleFont = "bold 60px 'Press Start 2P', Black Ops One";
		this.optionFont = "30px 'Press Start 2P', Black Ops One";

		this.bgImage = new Image();
		this.bgImage.src = "/srcs/game/assets/City/bg_menu3.jpg";
		this.bgImageLoaded = false;
		this.bgImage.onload = () => {
			this.bgImageLoaded = true;
		}
		this.Game_History = Game_History;

		this.keyPressed = {};
		this.boundKeyDown = this.handleKeyDown.bind(this);
		this.boundKeyUp = this.handleKeyUp.bind(this);
		this.optionStart = 0;
		this.optionOptions = 1;
		this.optionHistory = 2;
		this.optionQuit = 3;

		
	}

	enableControls() {

		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
	}

	disableControls() {
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
	}

	draw() {
		this.enableControls();

		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		if (this.bgImageLoaded) {
			c.drawImage(this.bgImage, 0, 0, canvas.width, canvas.height);
		}


		c.font = this.titleFont;
		c.textAlign = "center";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, canvas.width / 2, canvas.height / 4);
		c.shadowBlur = 0;

		c.font = this.optionFont;
		this.options.forEach((option, index) => {
			if (option === "✖ Quit" && index === this.selectedOption) {
				c.fillStyle = "red"; // Rouge si "Retour" est sélectionné
			} else if (index === this.selectedOption) {
				c.fillStyle = "#00FFFF"; // Bleu si autre option sélectionnée
			} else {
				c.fillStyle = "white"; // Sinon blanc
			}
			c.fillText(option, canvas.width / 2, canvas.height / 2 + index * this.optionSpacing);
		});
	}

	handleKeyDown(event) {
		const key = event.key;
		if (this.keyPressed[key]) return;
		this.keyPressed[key] = true;

		if (gameState.current !== GameState.Menu) return;
		console.log("selectedOption = ", this.selectedOption);
		console.log("options = ", this.options);
		console.log("option.index = ", this.options.indexOf(this.options[this.selectedOption]));

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
		console.log("Selected option:", selected);
		if (selected === "▶ Start" ) {
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.MapMenu;
		}
		else if (selected === "⚙ Options") {
			this.disableControls();
			console.log("Open options");
			gameState.previous = gameState.current;
			gameState.current = GameState.Options;
		}
		else if (selected === "✖ Quit") {
			this.selectedOption = 0;
			this.disableControls();
			gameState.previous = GameState.Menu;
			gameState.current = GameState.Menu;
			Setgame_started(false);
			// window.close();
		}

		else if (selected === "☷ History") {
			this.disableControls();
			console.log("History selected");
			console.log("this.Game_History = ", this.Game_History);
			if (typeof this.Game_History.Game_History.saveGameIfNeeded === "function")
			{
				console.log("this.Game_History.Game_History.saveGameIfNeeded()");
				this.Game_History.Game_History.saveGameIfNeeded();
			}
			gameState.previous = gameState.current;
			gameState.current = GameState.GameHistory;
		}
	}
}
