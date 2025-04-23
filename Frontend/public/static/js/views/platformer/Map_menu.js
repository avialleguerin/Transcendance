import { c, canvas, gameState, GameState } from './constants.js';

export default class MapMenu_c {
	constructor() {
		this.title = "Choisis ta carte 🌏";
		this.options = ["Carte 1", "Carte 2", "Retour"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.titleFont = "bold 60px 'Press Start 2P', Black Ops One";
		this.optionFont = "30px 'Press Start 2P', Black Ops One";
		this.mapPreview = new Image();
		this.mapPreview.src = "/srcs/game/assets/City/bg.png";
		this.mapPreviewLoaded = false;

		this.mapPreview.onload = () => {
			this.mapPreviewLoaded = true;
		};

		this.bgImage = new Image();
		this.bgImage.src = "/srcs/game/assets/City/bg_menu3.jpg";
		this.bgImageLoaded = false;
		this.bgImage.onload = () => {
			this.bgImageLoaded = true;
		}


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
	
	draw() {
		this.enableControls();
		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		if (this.bgImageLoaded) {
			c.drawImage(this.bgImage, 0, 0, canvas.width, canvas.height);
		}

		c.font = this.titleFont;
		c.textAlign = "center";	
		c.fillStyle = "#FFD700"; // doré
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText(this.title, canvas.width / 2, canvas.height / 4);
		c.shadowBlur = 0; // reset
		if (this.mapPreviewLoaded) {
			const imgWidth = 200;
			const imgHeight = 100;
			const imgX = 250;
			const imgY = 220;
			c.drawImage(this.mapPreview, imgX, imgY, imgWidth, imgHeight);
		}

		const optionPositions = [
			{ x: 350, y: 350 }, // position de "Carte 1"
			{ x: 700, y: 350}, // position de "Carte 2"
			{ x: 950, y: 550 }, // position de "Retour"
		];
	
		c.font = this.optionFont;

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];
			if (option === "Retour" && index === this.selectedOption) {
				c.fillStyle = "red"; // Rouge si "Retour" est sélectionné
			} else if (index === this.selectedOption) {
				c.fillStyle = "#00FFFF"; // Bleu si autre option sélectionnée
			} else {
				c.fillStyle = "white"; // Sinon blanc
			}
			c.fillText(option, pos.x, pos.y);
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

	handleSelect()
	{
		const selected = this.options[this.selectedOption];
		if (selected === "Carte 1")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Play;
		}
		else if (selected === "Retour")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}