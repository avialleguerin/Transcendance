import { c, canvas, gameState, GameState } from './constants.js';
import { Getgame_started, Setgame_started } from './PlatformView.js';

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

		// this.keyPressed = {};
		// this.boundKeyDown = this.handleKeyDown.bind(this);
		// this.boundKeyUp = this.handleKeyUp.bind(this);
		this.optionStart = 0;
		this.optionOptions = 1;
		this.optionHistory = 2;
		this.optionQuit = 3;

		this.boundMouseClick = this.handleMouseClick.bind(this);
		
		// Définir les zones de clic pour chaque option
		this.buttonAreas = [
			{ option: "▶ Start", x: canvas.width / 2 - 100, y: canvas.height / 2 - 20, width: 200, height: 40 },
			{ option: "⚙ Options", x: canvas.width / 2 - 100, y: canvas.height / 2 + 40, width: 200, height: 40 },
			{ option: "☷ History", x: canvas.width / 2 - 100, y: canvas.height / 2 + 100, width: 200, height: 40 },
			{ option: "✖ Quit", x: canvas.width / 2 - 100, y: canvas.height / 2 + 160, width: 200, height: 40 }
		];
		
		// Pour suivre quelle option est survolée
		this.hoveredOption = -1;  // -1 signifie qu'aucune option n'est survolée
		
		// Ajouter le gestionnaire d'événements pour le mouvement de la souris
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
		
		// Si aucun bouton n'est survolé, remettre le curseur par défaut
		if (this.hoveredOption === -1) {
			canvas.style.cursor = 'default';
		}
	}

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
			// Déterminer le style en fonction de la sélection ET du hover
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
			console.log("this.Game_History = ", this.Game_History);
			// if (typeof this.Game_History.Game_History.saveGameIfNeeded === "function")
			// {
			// 	console.log("this.Game_History.Game_History.saveGameIfNeeded()");
			// 	this.Game_History.Game_History.saveGameIfNeeded();
			// }
			gameState.previous = gameState.current;
			gameState.current = GameState.GameHistory;
		}
	}
}
