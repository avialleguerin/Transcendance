import Sprite from './Sprite.js';
import { c, GRAVITY, camera, canvas } from './constants.js';


export default class Player extends Sprite {
	
	constructor({position, Image_src_prefix, keys}) {
		// Commencer avec la première image
		super({position, Image_src: Image_src_prefix + "idle_0.png", scaleX: 0.08, scaleY: 0.08});
		
		this.position = position;
		this.velocity = {
			x: 0,
			y: 1,
		};
		this.keys = keys;
		
		// Animation properties
		this.frames = 0;
		this.frameSpeed = 10;
		this.currentSprite = 0;
		this.totalSprites = 5;
		this.state = "idle";
		this.imageSrcPrefix = Image_src_prefix;
		this.doubleJump = false;
		this.jump = 0;
		this.cantraverse = false;
		this.isGrounded = false;
		this.cantraverseDown = false;
		this.jumps = 0;
		this.cameraBox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: 200,
			height: 80,
		};

		console.log("keys", keys);
	}

	isMoving() {
		return this.keys.left.pressed || this.keys.right.pressed;
	}
	
	changeState(newState) {
		this.state = newState;
		if (this.state === "idle") {
			this.totalSprites = 5;
			this.currentSprite = 0;
		}
		else if (this.state === "walk") {
			this.totalSprites = 8;
			this.currentSprite = 0;
		}
		else if (this.state === "jumpStart") {
			this.totalSprites = 2;
			this.currentSprite = 0;
		}
		else if (this.state === "jumpEnd") {
			this.totalSprites = 3;
			this.currentSprite = 0;
		}
		else if (this.state === "fall") {
			this.totalSprites = 5;
			this.currentSprite = 0;
		}
		else if (this.state === "roll") {
			this.totalSprites = 5;
			this.currentSprite = 0;
		}
	}

	changeSprite() {
		if (this.frames % this.frameSpeed === 0) {
			this.currentSprite++;
	
			if (this.currentSprite >= this.totalSprites) {
				this.currentSprite = 0;
	
				if (this.state === "jumpStart" && this.velocity.y < 0) {
					this.changeState("fall");
				} else if (this.state === "jumpEnd") {
					this.changeState(this.isMoving() ? "walk" : "idle");
				}
			}
	
			let newImg = new Image();
			newImg.src = `${this.imageSrcPrefix}${this.state}_${this.currentSprite}.png`;
			this.image = newImg;
		}
	
		this.frames = (this.frames + 1) % 1000;
	}
	

	rotate_sprite() {
		if (this.velocity.x > 0) {
			this.scaleX = Math.abs(this.scaleX); // vers la droite (normal)
		} else if (this.velocity.x < 0) {
			this.scaleX = -Math.abs(this.scaleX); // vers la gauche (miroir)
		}
	}

	drawCameraBox() {
		c.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Couleur de la hitbox
		c.fillRect(
			this.cameraBox.position.x,
			this.cameraBox.position.y,
			this.cameraBox.width,
			this.cameraBox.height
		);
	}

	updateCameraBox() {
		this.cameraBox = {
			position: {
				x: this.position.x - 250,
				y: this.position.y - 100,
			},
			width: 800,
			height: 400,
		};
	}

	shouldPanCameraToRight({canvas, camera}) {
		const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;

		if (cameraBoxRightSide >= canvas.width + Math.abs(camera.position.x)) {
			camera.position.x += this.velocity.x;
		}
	}

	shouldPanCameraToLeft({canvas, camera}) {
		if (this.cameraBox.position.x <= 0) {
			return;
		}
	
		if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
			camera.position.x += this.velocity.x;
		}
	}

	forceCameraToFollow({ canvas, camera }) {
		camera.position.x = this.position.x - canvas.width / 2 + this.width / 2;
		camera.position.y = this.position.y - canvas.height / 2 + this.height / 2;
	}

	shouldPanCameraToDown({canvas, camera}) {
		if (this.cameraBox.position.y <= 0) {
			return;
		}
		if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
			camera.position.y += this.velocity.y;
		}
	}

	shouldPanCameraToUP({canvas, camera}) {
		// Vérifier si on atteint le bas de l'écran
		if (this.cameraBox.position.y + this.cameraBox.height >= canvas.height + Math.abs(camera.position.y)) {
			camera.position.y += this.velocity.y;
		}
	}

	update() {
		if (this.velocity.y > 1) {
			this.isGrounded = false;
		}
		
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
	
		if (this.isGrounded) {
			this.velocity.y = 0;
			this.doubleJump = false;
			this.jumps = 0;
	
			if (["fall", "jumpStart", "roll"].includes(this.state)) {
				this.changeState("jumpEnd");
	
				setTimeout(() => {
					this.changeState(this.isMoving() ? "walk" : "idle");
				}, this.totalSprites * this.frameSpeed * 16);
			}
		} else {
			this.velocity.y += GRAVITY;
	
			if (this.velocity.y > 1 && this.state !== "fall") {
				this.changeState("fall");
			}
		}
	
		this.changeSprite();
		this.rotate_sprite();
		this.draw();
		this.updateCameraBox();
	}
	
	
	handleJump() {
		if (this.jumps < 2) {
			if (this.jumps === 0) {
				this.velocity.y = -10;
				this.changeState("jumpStart");
				this.jumps = 1;
				this.isGrounded = false;
			}
			else if (this.jumps === 1 && !this.doubleJump) {
				this.velocity.y = -10;
				this.changeState("roll");
				this.doubleJump = true;
				this.isGrounded = false;
			}
		}
	}
	
	checkCollision(platforms) {
		const hitboxOffsetX = 60;
		const hitboxOffsetY = 90;
		const hitboxOffsetBottom = 25;
	
		const hitboxX = this.position.x + hitboxOffsetX;
		const hitboxY = this.position.y + hitboxOffsetY;
		const hitboxWidth = this.width - hitboxOffsetX * 2;
		const hitboxHeight = this.height - hitboxOffsetY - hitboxOffsetBottom;

		let onPlatform = false; // Variable pour savoir si on est sur une plateforme cette frame
	
		for (let platform of platforms) {
			const px = platform.position.x;
			const py = platform.position.y;
			const pw = platform.width;
			const ph = platform.height;
	
			// AABB collision check
			const collision = hitboxX < px + pw &&
							hitboxX + hitboxWidth > px &&
							hitboxY < py + ph &&
							hitboxY + hitboxHeight > py;
	
			if (collision) {
				const prevBottom = hitboxY + hitboxHeight - this.velocity.y;
				const prevTop = hitboxY - this.velocity.y;
				const prevRight = hitboxX + hitboxWidth - this.velocity.x;
				const prevLeft = hitboxX - this.velocity.x;
	
				// Collision from top (falling on platform)
				if (prevBottom <= py && this.velocity.y >= 0) {
					if (!this.cantraverseDown) {
						this.velocity.y = 0;
						this.jumps = 0;
						this.doubleJump = false;
						this.position.y = py - this.height + hitboxOffsetBottom;
						this.isGrounded = true;
						onPlatform = true; // Marquer qu'on est sur une plateforme cette frame
					}
				}
				// Collision from bottom (head hitting platform)
				else if (prevTop >= py + ph && this.velocity.y < 0) {
					console.log("Collision from bottom");
					console.log(this.cantraverse);
					if (!this.cantraverse) {
						this.velocity.y = 0;
					}
				}
				// Collision from left
				else if (prevLeft >= px + pw && this.velocity.x < 0) {
					this.velocity.x = 0;
					this.position.x = px + pw - hitboxOffsetX; // <- bon placement
				}
			}
		}
		
		if (!onPlatform && this.isGrounded && this.velocity.y === 0) {
			this.isGrounded = false;
			this.velocity.y = 0.1; // Une petite vélocité pour commencer la chute
		}
	}
	
	drawHitbox() {
		const hitboxOffsetX = 60;
		const hitboxOffsetY = 90;
		const hitboxOffsetBottom = 25;
		
		c.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Couleur de la hitbox
		c.fillRect(
			this.position.x + hitboxOffsetX, 
			this.position.y + hitboxOffsetY,
			this.width - (hitboxOffsetX * 2),
			this.height - hitboxOffsetY - hitboxOffsetBottom
		);
	}
}