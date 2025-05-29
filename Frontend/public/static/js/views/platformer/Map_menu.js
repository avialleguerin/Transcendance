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

		this.nb_game_started = 0;

		// Ajouter les propriétés pour la gestion de la souris
		this.hoveredOption = -1;  // -1 signifie qu'aucune option n'est survolée
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);

		// Définir les zones de clic pour chaque option (basées sur optionPositions)
		this.buttonAreas = [
			{ option: "Carte 1", x: 250, y: 330, width: 200, height: 40 },
			{ option: "Carte 2", x: 600, y: 330, width: 200, height: 40 },
			{ option: "Retour", x: 850, y: 530, width: 200, height: 40 }
		];
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

	// Nouvelle méthode pour gérer le mouvement de la souris
	handleMouseMove(event) {
		// Obtenir la position de la souris relative au canvas
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		// Réinitialiser la valeur de hoveredOption
		this.hoveredOption = -1;
		
		// Vérifier si la souris est sur un bouton
		for (let i = 0; i < this.buttonAreas.length; i++) {
			const button = this.buttonAreas[i];
			if (x >= button.x && x <= button.x + button.width &&
				y >= button.y && y <= button.y + button.height) {
				this.hoveredOption = i;
				canvas.style.cursor = 'pointer';  // Changer le curseur en main
				break;
			}
		}
		
		// Si aucun bouton n'est survolé, remettre le curseur par défaut
		if (this.hoveredOption === -1) {
			canvas.style.cursor = 'default';
		}
	}

	// Nouvelle méthode pour gérer les clics de souris
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
		
		// Mettre à jour les zones de clic en fonction des positions réelles des options
		this.buttonAreas[0] = { option: "Carte 1", x: optionPositions[0].x - 100, y: optionPositions[0].y - 30, width: 200, height: 40 };
		this.buttonAreas[1] = { option: "Carte 2", x: optionPositions[1].x - 100, y: optionPositions[1].y - 30, width: 200, height: 40 };
		this.buttonAreas[2] = { option: "Retour", x: optionPositions[2].x - 100, y: optionPositions[2].y - 30, width: 200, height: 40 };
	
		c.font = this.optionFont;

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];

			if (option === "Retour" && (index === this.hoveredOption))
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

			c.fillText(option, pos.x, pos.y);
			if (index === this.hoveredOption)
			{
				c.strokeStyle = "#88CCFF";
			}

			c.shadowColor = "transparent";
			c.shadowBlur = 0;
		});
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