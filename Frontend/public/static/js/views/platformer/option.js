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
	
		c.font = this.optionFont;

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];
			if (option === "Retour" && index === this.selectedOption) {
				c.fillStyle = "red"; // Rouge si "Retour" est sélectionné
			}
			else
			{
				c.fillStyle = "white"; // Sinon blanc
			}
			c.fillText(option, pos.x, pos.y);
			c.fillStyle = "white";
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
		if (selected === "Retour")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}