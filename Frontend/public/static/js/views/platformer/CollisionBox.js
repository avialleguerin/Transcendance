import { c } from './constants.js';

export default class CollisionBox {
	constructor({position, width, height}) {
		this.position = position;
		this.width = width;
		this.height = height;
	}

	draw() {
		c.strokeStyle = 'red';
		c.strokeRect(this.position.x, this.position.y, this.width, this.height);
	}

	checkCollision(player) {
		const hitboxOffsetX = 60;
		const hitboxOffsetY = 90;
		const hitboxOffsetBottom = 25;
	
		const hitboxX = player.position.x + hitboxOffsetX;
		const hitboxY = player.position.y + hitboxOffsetY;
		const hitboxWidth = player.width - hitboxOffsetX * 2;
		const hitboxHeight = player.height - hitboxOffsetY - hitboxOffsetBottom;
	
		// Vérifie l'intersection entre la hitbox du joueur et la boîte
		const collision = hitboxX < this.position.x + this.width &&
						hitboxX + hitboxWidth > this.position.x &&
						hitboxY < this.position.y + this.height &&
						hitboxY + hitboxHeight > this.position.y;
	
		return collision;
	}
}