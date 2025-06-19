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
		this.options = ["Back"];
		this.selectedOption = 0;

		this.optionFont = "20px 'Press Start 2P', Black Ops One";
		
		this.hoveredOption = -1;
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);
		
		this.buttonAreas = [
			{ option: "Back", x: 900, y: 530, width: 100, height: 40 }
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
			{ x: 900, y: 550 },
		];
		
		this.buttonAreas[0] = { 
			option: "Back", 
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
		if (selected === "Back")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}