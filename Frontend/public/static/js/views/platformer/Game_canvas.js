import { c, canvas, gameState, GameState } from './constants.js';
import Sprite from './Sprite.js';
import { getIsFirstGame} from './constants.js';

export default class GameCanvas extends Sprite {
	constructor({position,  Image_src_prefix, player, coin}) {
		super({ position, Image_src: Image_src_prefix + "coin_0.png", scaleX: 0.6, scaleY: 0.6 });
		this.coin_icon = new Image();
		this.coin_icon.src = "/srcs/game/assets/City/coin_0.png";
		this.coin_icon_loaded = false;
		this.coin_icon.onload = () => {
			this.coin_icon_loaded = true;
		};
		this.coin_icon_error = false;
		this.coin_icon.onerror = () => {
			this.coin_icon_error = true;
			console.error("Failed to load coin icon");
		};

		this.nb_coin = 0;
		this.nb_coin_text = this.nb_coin + " / 7";
		this.coins = coin;

		this.position = position;
		this.Image_src_prefix = Image_src_prefix;
		this.frames = 0;
		this.frameSpeed = 10;
		this.currentSprite = 0;
		this.totalSprites = 8;
		this.state = "idle";

		this.timer_icon = new Image();
		this.timer_icon.src = "/srcs/game/assets/City/timer.png";
		this.timer_icon_loaded = false;
		this.timer_icon.onload = () => {
			this.timer_icon_loaded = true;
		};
		this.timer_icon_error = false;
		this.timer_icon.onerror = () => {
			this.timer_icon_error = true;
			console.error("Failed to load timer icon");
		};
		this.timer = 0;
		this.timer_text = this.timer;
		this.timer_text = "0 s";
		this.lastTime = Date.now();
		this.end_come = false;
		this.GameIsPaused = false;

		this.selectedOption = 0;
		this.options = ["Menu"];

		this.keyPressed = {};
		this.boundKeyDown = this.handleKeyDown.bind(this);
		this.boundKeyUp = this.handleKeyUp.bind(this);
		this.player = player;

		this.boundMouseClick = this.handleMouseClick.bind(this);

		this.menuButtonArea = { x: 880, y: 530, width: 100, height: 40 };

		this.isMenuHovered = false;
		this.boundMouseMove = this.handleMouseMove.bind(this);
	}

	enableControls() {
		window.addEventListener("keydown", this.boundKeyDown);
		window.addEventListener("keyup", this.boundKeyUp);
		window.addEventListener("click", this.boundMouseClick);
		window.addEventListener("mousemove", this.boundMouseMove);
	}

	disableControls() {
		window.removeEventListener("keydown", this.boundKeyDown);
		window.removeEventListener("keyup", this.boundKeyUp);
		window.removeEventListener("click", this.boundMouseClick);
		window.removeEventListener("mousemove", this.boundMouseMove);
	}

	handleMouseClick(event) {
		if (!this.GameIsPaused) return;
		
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		if (x >= this.menuButtonArea.x && x <= this.menuButtonArea.x + this.menuButtonArea.width &&
			y >= this.menuButtonArea.y && y <= this.menuButtonArea.y + this.menuButtonArea.height) {
			this.handleSelect();
		}
	}

	handleMouseMove(event) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		if (x >= this.menuButtonArea.x && x <= this.menuButtonArea.x + this.menuButtonArea.width &&
			y >= this.menuButtonArea.y && y <= this.menuButtonArea.y + this.menuButtonArea.height)
		{
			this.isMenuHovered = true;
			canvas.style.cursor = 'pointer';
		}
		else
		{
			this.isMenuHovered = false;
			canvas.style.cursor = 'default';
		}
	}

	changeSprite()
	{
		if (this.frames % this.frameSpeed === 0)
		{
			this.currentSprite++;
			if (this.currentSprite >= this.totalSprites)
			{
				this.currentSprite = 0;
			}
			let newImg = new Image();
			newImg.src = this.Image_src_prefix + "coin_" + this.currentSprite + ".png";
			this.image = newImg;
		}
		this.frames = (this.frames + 1) % 1000;
	}

	update()
	{
		const now = Date.now();
		if (now - this.lastTime >= 1000 && this.timer < 300 && !this.GameIsPaused)
		{
			this.timer++;
			this.lastTime = now;
			if (this.timer >= 290)
				this.end_come = true;
			else
				this.end_come = false;

			if (this.timer > 300) {
				this.timer = 0;
				if (getIsFirstGame()) {
					gameState.previous = gameState.current;
					gameState.current = GameState.EndGameFirstGame;
				}
				else {
					gameState.previous = gameState.current;
					gameState.current = GameState.EndGameSecondGame;
				}
			}
		}

		this.changeSprite();
		this.draw();
		this.draw_canvas();
		if (this.GameIsPaused) {
			this.draw_menu_pause();
		}
	}

	draw_canvas() {
		this.enableControls();
		if (this.timer_icon_loaded && !this.timer_icon_error) {
			c.drawImage(this.timer_icon, 3, 50, 40, 40);
		}

		this.nb_coin_text = this.nb_coin + " / 7";

		c.fillStyle = "gold";
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.fillText(this.nb_coin_text, 70, 30);

		this.timer_text = this.timer + " s";
		if (this.end_come) {
			c.fillStyle = "red";
		}
		else {
			c.fillStyle = "white";
		}
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.fillText(this.timer_text, 70, 75);
	}

	draw_menu_pause() {
		c.save();
		c.fillStyle = "rgba(0, 0, 0, 0.5)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.font = "20px 'Press Start 2P', Black Ops One";
		c.textAlign = "left";
		c.fillStyle = "#FFD700";
		c.shadowColor = "#000";
		c.shadowBlur = 10;
		c.fillText("Pause", 480, 50);

		if (this.isMenuHovered)
		{
			c.fillStyle = "#88CCFF";
			c.font = "22px 'Press Start 2P', Black Ops One";
			c.shadowColor = "#88CCFF";
			c.shadowBlur = 15;
		}
		else
		{
			c.fillStyle = "white";
			c.font = "20px 'Press Start 2P', Black Ops One";
			c.shadowColor = "transparent";
			c.shadowBlur = 5;
		}

		c.fillText("Menu", this.menuButtonArea.x + 20, this.menuButtonArea.y + 20);
		
		if (this.isMenuHovered) {
			c.fillStyle = "#88CCFF";
		}
		
		c.fillStyle = "white";
		c.restore();
	}

	resetGame() {
		this.nb_coin = 0;
		this.nb_coin_text = this.nb_coin + " / 7";
		this.timer = 0;
		this.timer_text = this.timer;
		this.lastTime = Date.now();
		this.end_come = false;
	}


	handleKeyDown(event) {
		const key = event.key;
		if (this.keyPressed[key]) return;
		this.keyPressed[key] = true;

		switch (key) {
			case "Escape":
				if (gameState.current === GameState.Play) {
					this.GameIsPaused = !this.GameIsPaused;
					if (this.GameIsPaused) {
						this.disableControls();
					} else
						this.enableControls();
				}
				break;
		}
	}

	handleKeyUp(event) {
		this.keyPressed[event.key] = false;
	}

	handleSelect()
	{
		const selected = this.options[this.selectedOption];
		if (selected === "Menu")
		{
			this.disableControls();
			this.resetGame();
			this.coins.forEach(coin => {
				if (typeof coin.Reset_coin === "function") {
					coin.Reset_coin();
				}
			});
			this.player.reset_Game();
			this.GameIsPaused = false;
			gameState.previous = gameState.current;
			gameState.current = GameState.Menu;
		}
	}
}