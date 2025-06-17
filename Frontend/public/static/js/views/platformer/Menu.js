import { c, canvas, gameState, GameState } from './constants.js';
import { Getgame_started, Setgame_started } from './PlatformView.js';
import { get_platformers } from "../../../../api/games.js";

export default class Menu {
	constructor(config) {
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
		this.Game_History = config.Game_History;
		// this.gameHistory = [];
		// this.loadGameHistory();



		this.optionStart = 0;
		this.optionOptions = 1;
		this.optionHistory = 2;
		this.optionQuit = 3;

		this.boundMouseClick = this.handleMouseClick.bind(this);
		
		this.buttonAreas = [
			{ option: "▶ Start", x: canvas.width / 2 - 100, y: canvas.height / 2 - 20, width: 200, height: 40 },
			{ option: "⚙ Options", x: canvas.width / 2 - 100, y: canvas.height / 2 + 40, width: 200, height: 40 },
			{ option: "☷ History", x: canvas.width / 2 - 100, y: canvas.height / 2 + 100, width: 200, height: 40 },
			{ option: "✖ Quit", x: canvas.width / 2 - 100, y: canvas.height / 2 + 160, width: 200, height: 40 }
		];
		
		this.hoveredOption = -1;
		
		this.boundMouseMove = this.handleMouseMove.bind(this);
	}

	enableControls()
	{
		window.addEventListener("click", this.boundMouseClick);
		window.addEventListener("mousemove", this.boundMouseMove);
	}

	disableControls()
	{
		window.removeEventListener("click", this.boundMouseClick);
		window.removeEventListener("mousemove", this.boundMouseMove);
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

	// async loadGameHistory() {
	// 	try {
	// 		const games = await get_platformers();
	// 		this.gameHistory = games || [];
	// 		console.log("GameHistory loaded, number of games:", this.gameHistory.length);
	// 	} catch (error) {
	// 		console.error("Error loading game history:", error);
	// 		this.gameHistory = [];
	// 	}
	// }

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
			if (option === "✖ Quit" && (index === this.hoveredOption))
				c.fillStyle = "red";
			else if (index === this.hoveredOption)
				c.fillStyle = "#88CCFF";
			else 
				c.fillStyle = "white";

			if (index === this.hoveredOption)
			{
				c.shadowColor = "#88CCFF";
				c.shadowBlur = 15;
				c.font = "32px 'Press Start 2P', Black Ops One";
			}
			else
			{
				c.shadowColor = "transparent";
				c.shadowBlur = 0;
				c.font = this.optionFont;
			}
			c.fillText(option, canvas.width / 2, canvas.height / 2 + index * this.optionSpacing);

			const y = canvas.height / 2 + index * this.optionSpacing;
			this.buttonAreas[index] = { 
				option: option, 
				x: canvas.width / 2 - 100, 
				y: y - 20, 
				width: 200, 
				height: 40 
			};
			
			if (index === this.hoveredOption) {
				c.strokeStyle = "#88CCFF";
			}

			c.shadowColor = "transparent";
			c.shadowBlur = 0;
		});
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
			localStorage.removeItem("platformer_view");
			gameState.previous = GameState.Menu;
			gameState.current = GameState.Menu;
			Setgame_started(false);
			console.log("Quit game");
			console.log(Getgame_started());
			// window.close();
		}

		else if (selected === "☷ History") {
			this.disableControls();
			console.log("History selected");
			
			if (this.Game_History && typeof this.Game_History.loadGameHistory === 'function') {
				console.log("Loading game history...");
				this.Game_History.loadGameHistory();
			} else {
				console.error("Game_History n'est pas correctement initialisé ou ne possède pas la méthode loadGameHistory", this.Game_History);
			}
			
			gameState.previous = gameState.current;
			gameState.current = GameState.GameHistory;
		}
	}
}
