import { c } from './constants.js';
import Sprite from './Sprite.js';

export default class GameCanvas extends Sprite {
	constructor({position,  Image_src_prefix}) {
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
		this.nb_coin_text = this.nb_coin + " / 3";


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
		this.lastTime = Date.now(); // ⏱️ init du timer
		this.end_come = false; // ⏱️ fin du timer

	}

	changeSprite()
	{
		if (this.frames % this.frameSpeed === 0) {
			this.currentSprite++;
			if (this.currentSprite >= this.totalSprites) {
				this.currentSprite = 0;
			}
			let newImg = new Image();
			newImg.src = this.Image_src_prefix + "coin_" + this.currentSprite + ".png";
			this.image = newImg;
		}
		this.frames = (this.frames + 1) % 1000;
	}


	update() {
		const now = Date.now();
		if (now - this.lastTime >= 1000 && this.timer < 300) { // ⏱️ une seconde est passée, et max 5 min (300 s)
			this.timer++;
			this.lastTime = now;
			console.log("Timer:", this.timer);

			if (this.timer >= 290)
				this.end_come = true; // ⏱️ fin du timer
			else
				this.end_come = false; // ⏱️ fin du timer

			if (this.timer >= 300) {
				console.log("Timer finished");
				this.timer = 0;
			}
		}
	
		this.changeSprite();
		this.draw();
		this.draw_canvas();
	}

	draw_canvas() {
		// if (this.coin_icon_loaded && !this.coin_icon_error) {
		// 	c.drawImage(this.coin_icon, 8, 8, 30, 30);
		// } else {
		// 	console.error("Coin icon not loaded");
		// }
		// console.log("Coin icon loaded:", this.coin_icon_loaded);
		// console.log("nb_coin:", this.nb_coin);

		if (this.timer_icon_loaded && !this.timer_icon_error) {
			c.drawImage(this.timer_icon, 3, 50, 40, 40);
		}
		else {
			console.error("Timer icon not loaded");
		}


		this.nb_coin_text = this.nb_coin + " / 3";

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

	resetGame() {
		this.nb_coin = 0;
		this.nb_coin_text = this.nb_coin + " / 3";
		this.timer = 0;
		this.timer_text = this.timer;
		this.lastTime = Date.now(); // ⏱️ init du timer
		this.end_come = false; // ⏱️ fin du timer
	}
}