import { c, canvas, gameState, GameState, getSecondeGameFinish, setSecondeGameFinish } from './constants.js';

export default class MapMenu_c {
	constructor({player}) {
		this.title = "Choose your map";
		this.options = ["Map 1", "Map 2", "Back"];
		this.selectedOption = 0;
		this.optionSpacing = 60;
		this.titleFont = "bold 60px 'Press Start 2P', Black Ops One";
		this.optionFont = "30px 'Press Start 2P', Black Ops One";
		this.mapPreview = new Image();
		this.mapPreview.src = "/srcs/game/assets/City/bg.png";
		this.mapPreviewLoaded = false;
		this.txt = "COMING SOON...";

		this.mapPreview.onload = () => {
			this.mapPreviewLoaded = true;
		};

		this.bgImage = new Image();
		this.bgImage.src = "/srcs/game/assets/City/bg_menu3.jpg";
		this.bgImageLoaded = false;
		this.bgImage.onload = () => {
			this.bgImageLoaded = true;
		}

		this.player = player;

		this.hoveredOption = -1;
		this.boundMouseMove = this.handleMouseMove.bind(this);
		this.boundMouseClick = this.handleMouseClick.bind(this);

		this.buttonAreas = [
			{ option: "Map 1", x: 250, y: 330, width: 200, height: 40 },
			{ option: "Map 2", x: 600, y: 330, width: 200, height: 40 },
			{ option: "Back", x: 850, y: 530, width: 200, height: 40 }
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
		if (this.mapPreviewLoaded) {
			const imgWidth = 200;
			const imgHeight = 100;
			const imgX = 250;
			const imgY = 220;
			c.drawImage(this.mapPreview, imgX, imgY, imgWidth, imgHeight);
		}

		c.fillStyle = "white";
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.textAlign = "center";
		c.fillStyle = "#FFD700";
		c.fillText(this.txt, 705, 280);


		const optionPositions = [
			{ x: 350, y: 350 },
			{ x: 700, y: 350},
			{ x: 950, y: 550 },
		];


		this.buttonAreas[0] = { option: "Map 1", x: optionPositions[0].x - 100, y: optionPositions[0].y - 30, width: 200, height: 40 };
		this.buttonAreas[1] = { option: "Map 2", x: optionPositions[1].x - 100, y: optionPositions[1].y - 30, width: 200, height: 40 };
		this.buttonAreas[2] = { option: "Back", x: optionPositions[2].x - 100, y: optionPositions[2].y - 30, width: 200, height: 40 };
	
		c.font = this.optionFont;

		this.options.forEach((option, index) => {
			const pos = optionPositions[index];

			if (option === "Back" && (index === this.hoveredOption))
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
		if (selected === "Map 1")
		{
			this.player.reset_Game();
			this.disableControls();
			setSecondeGameFinish(false);
			gameState.previous = gameState.current;
			gameState.current = GameState.Play;
		}
		else if (selected === "Back")
		{
			this.disableControls();
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}