import { c, canvas, gameState, GameState } from './constants.js';

export default class Option {
	constructor()
	{
		this.title = "Options"
		this.titlefont = "bold 30px 'Press Start 2P', Black Ops One";
		this.control = " Control :";
		this.move_left = " Move Left : Arrow Left";
		this.jump = " Jump : Arrow Up";
		this.move_right = " Move Right : Arrow Right";
		this.move_down = " Move Down : Arrow Down";
		this.options = ["Retour"];
		this.selectedOption = 0;

		this.optionFont = "20px 'Press Start 2P', Black Ops One";
		
		// Ajouter les propriétés pour la gestion de la souris
		this.hoveredOption = -1;  // -1 signifie qu'aucune option n'est survolée
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);
		
		// Définir les zones de clic pour chaque option
		this.buttonAreas = [
			{ option: "Retour", x: 900, y: 530, width: 100, height: 40 }
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

	draw()
	{
		this.enableControls();

		c.fillStyle = "rgba(0, 0, 0, 0.75)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = "#FFD700";
		c.font = this.titlefont;
		c.shadowColor = "#000";
		c.textAlign = "left";
		c.fillText(this.title, 450, 100);
		c.font = this.optionFont;
		c.fillText(this.control, 100, canvas.height / 2 - 50);
		c.fillText(this.move_left, 220, 260 - 20);
		c.fillText(this.move_right, 220, 260 + 10);
		c.fillText(this.move_down, 220, 260 + 40);
		c.fillText(this.jump, 220, 260 + 70);

		const optionPositions = [
			{ x: 900, y: 550 }, // position de "Retour"
		];
		
		// Mettre à jour les zones de clic en fonction des positions réelles
		this.buttonAreas[0] = { 
			option: "Retour", 
		 x: optionPositions[0].x - 20, 
		 y: optionPositions[0].y - 30, 
		 width: 100, 
		 height: 40 
		};
	
		c.font = this.optionFont;

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
		if (selected === "Retour")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}