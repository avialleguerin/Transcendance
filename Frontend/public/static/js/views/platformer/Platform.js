import { c } from './constants.js';

export default class Platform {
	constructor({ position, width, height, image = null }) {
		this.position = position;
		this.width = width;
		this.height = height;
		this.image = image;
	}
	
	draw() {
		if (this.image && this.image.loaded) {
			c.drawImage(
				this.image.image,
				this.position.x,
				this.position.y,
				this.width,
				this.height
			);
		} else {
			c.fillStyle = "black";
			c.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
	}
}