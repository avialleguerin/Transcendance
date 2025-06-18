import { c } from './constants.js';

export default class Sprite {
	constructor({position, Image_src, scaleX = 1, scaleY = 1}) {
		this.position = position;
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.image = new Image();
		this.loaded = false;
		this.width = 0;
		this.height = 0;
		
		this.image.onload = () => {
			this.loaded = true;
			this.width = this.image.width * this.scaleX;
			this.height = this.image.height * this.scaleY;

		};
		
		this.image.onerror = () => {
			console.error("Failed to load image:", Image_src);
		};
		
		this.image.src = Image_src;
	}

	draw() {
		if (!this.loaded) return;
		
		c.save();
		
		if (this.scaleX < 0) {
			c.translate(this.position.x + this.width, this.position.y);
			c.scale(-1, 1);
		} else {
			c.translate(this.position.x, this.position.y);
			c.scale(1, 1);
		}
	
		c.drawImage(
			this.image,
			0,
			0,
			this.width,
			this.height
		);
	
		c.restore();
	}

	update() {
		this.draw();
	}
}