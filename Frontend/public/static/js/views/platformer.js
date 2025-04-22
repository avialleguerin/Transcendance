import AbstractView from "./AbstractView.js";

/***************************************/
/********Variables Globales*************/
/***************************************/

let y = 100;

export default class PlatformerView extends AbstractView {
	constructor() {
		super();
		this.setTitle("platformer");
	}

	async getHtml() {
		return `
			<link href="https://fonts.googleapis.com/css2?family=Black+Ops+One&display=swap" rel="stylesheet">
			<style>
				canvas {
					z-index: 100;
					display: block;
					margin: 0 auto;
					background-color: black;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			</style>
			<canvas id="game-canvas"></canvas>
		`;
	}

	async init() {
		this.init_platformer_game();
	}

	init_platformer_game() {
		console.log("canvas created");
		const canvas = document.querySelector("#game-canvas");
		const c = canvas.getContext("2d");
		canvas.width = 1024;
		canvas.height = 576;

		const scaledCanavas = {
			width: canvas.width / 4,
			height: canvas.height / 4,
		};

		c.fillStyle = "black";
		c.fillRect(0, 0, canvas.width, canvas.height);
		const gravity = 0.5;

		class Sprite {
			constructor({position, Image_src, scaleX = 1, scaleY = 1}) {
				this.position = position
				this.scaleX = scaleX
				this.scaleY = scaleY
				this.image = new Image()
				this.loaded = false
				this.width = 0  // Initialisation
				this.height = 0 // Initialisation
				
				// Attendre que l'image soit chargée avant de dessiner
				this.image.onload = () => {
					this.loaded = true
					this.width = this.image.width * this.scaleX  // Calcul de la largeur
					this.height = this.image.height * this.scaleY // Calcul de la hauteur
				}
				
				this.image.onerror = () => {
					console.error("Failed to load image:", Image_src)
				}
				
				// Définir la source après avoir configuré les gestionnaires d'événements
				this.image.src = Image_src
			}

			draw() {
				if (!this.loaded) return;
				
				c.save();
				
			
				if (this.scaleX < 0) {
					// On inverse horizontalement
					c.translate(this.position.x + this.width, this.position.y);
					c.scale(-1, 1);
				} else {
					c.translate(this.position.x, this.position.y);
					c.scale(1, 1);
				}
			
				// On dessine à (0, 0) car on a déjà déplacé le contexte
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
				this.draw()
			}

			logStatus() {
				console.log("Image loaded status:", this.loaded);
				console.log("Image path:", this.image.src);
				console.log("Image dimensions:", this.width, this.height);
			}
		}

		

		class PlatForm {
			constructor({ position, width, height, image = null }) {
				this.position = position;
				this.width = width;
				this.height = height;
				this.image = image;
			}
			
			draw() {
				if (this.image && this.image.loaded) {
				// Utiliser directement l'image de Sprite
				c.drawImage(
					this.image.image,
					this.position.x,
					this.position.y,
					this.width,
					this.height
				);
				} else {
				// Dessiner un rectangle si pas d'image ou si l'image n'est pas chargée
				c.fillStyle = "black";
				c.fillRect(this.position.x, this.position.y, this.width, this.height);
				}
			}
		}

		
		class Player extends Sprite {
			constructor({position, Image_src_prefix}) {
				// Commencer avec la première image
				super({position, Image_src: Image_src_prefix + "idle_0.png", scaleX: 0.08, scaleY: 0.08});
				
				this.position = position;
				this.velocity = {
					x: 0,
					y: 1,
				};
				
				// Animation properties
				console.log("je rentre ici mtn ");
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
				this.cameraBox = {
					position: {
						x: this.position.x,
						y: this.position.y,
					},
					width: 200,
					height: 80,
				};
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

			changeSprite()
			{
				if (this.frames % this.frameSpeed === 0) {
					this.currentSprite++;
					
					if (this.currentSprite >= this.totalSprites) {
						this.currentSprite = 0;
						
						if (this.state === "jumpStart" && this.velocity.y < 0)
						{
							this.changeState("fall");
						}
						else if (this.state === "jumpEnd")
						{
							if (keysPlayer1.d.pressed || keysPlayer1.q.pressed || keysPlayer1.a.pressed || keysPlayer2.j.pressed || keysPlayer2.l.pressed)
							{
								this.changeState("walk");
							}
							else
							{
								this.changeState("idle");
							}
						}
					}
					let newImg = new Image();
					newImg.src = this.imageSrcPrefix + this.state + "_" + this.currentSprite + ".png";
					this.image = newImg;
				}
				this.frames++;
				if (this.frames > 1000)
					this.frames = 0;
			}

			rotate_sprite() {
				if (this.velocity.x > 0) {
					this.scaleX = Math.abs(this.scaleX); // vers la droite (normal)
				} else if (this.velocity.x < 0) {
					this.scaleX = -Math.abs(this.scaleX); // vers la gauche (miroir)
					// console.log("je regarde à gauche");
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
					camera.position.x += this.velocity.x
				}
			}

			shouldPanCameraToLeft({canvas, camera}) {
				if (this.cameraBox.position.x <= 0) {
					return;
				}
			
				if (this.cameraBox.position.x <= Math.abs(camera.position.x)) {
					camera.position.x += this.velocity.x
				}
			}

			forceCameraToFollow({ canvas, camera }) {
				camera.position.x = this.position.x - canvas.width / 2 + this.width / 2;
				camera.position.y = this.position.y - canvas.height / 2 + this.height / 2;
			}

			// shouldPanCameraToDown({canvas, camera}) {
			// 	if (this.cameraBox.position.y <= 0) {
			// 		return;
			// 	}
			
			// 	if (this.cameraBox.position.y <= Math.abs(camera.position.y)) {
			// 		camera.position.y += this.velocity.y
			// 	}
			// }

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

				if (this.velocity.y > 1)
				{
					this.isGrounded = false;
				}
					

				this.position.y += this.velocity.y;
				this.position.x += this.velocity.x;

				if (this.isGrounded)
				{
					// console.log("je suis au sol");
					this.velocity.y = 0;
					this.doubleJump = false;
					// this.isGrounded = true;
					this.jumps = 0;
					if (this.state === "fall" || this.state === "jumpStart" || this.state === "roll")
					{
						this.changeState("jumpEnd");
						setTimeout(() => {
							if (keysPlayer1.d.pressed || keysPlayer1.q.pressed || keysPlayer1.a.pressed || keysPlayer2.j.pressed || keysPlayer2.l.pressed)
							{
								this.changeState("walk");
							}
							else
							{
								this.changeState("idle");
							}
						}, this.totalSprites * this.frameSpeed * 16);
					}
				}
				else
				{
					this.velocity.y += gravity;
					// this.isGrounded = false;
					if (this.velocity.y > 1 && this.state !== "fall")
					{
						this.changeState("fall");
					}
				}

				this.changeSprite();
				this.rotate_sprite();
				this.draw();
				this.drawHitbox();
				this.updateCameraBox();
				this.drawCameraBox();
			}
			
			handleJump() {
				if (this.jumps < 2) {
					if (this.jumps === 0) {
						this.velocity.y = -10;
						this.changeState("jumpStart");
						this.jumps = 1;
						this.isGrounded = false; // Add this line
					}
					else if (this.jumps === 1 && !this.doubleJump) {
						this.velocity.y = -10;
						this.changeState("roll");
						this.doubleJump = true;
						this.isGrounded = false; // Add this line
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
						if (prevBottom <= py && this.velocity.y >= 0)
						{
							if (!this.cantraverseDown)
							{
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

		class CollisionBox {
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

		class trap {
			constructor({position, width, height}) {
				this.position = position;
				this.width = width;
				this.height = height;
			}

			draw() {
				c.fillStyle = 'red';
				c.fillRect(this.position.x, this.position.y, this.width, this.height);
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

		const player = new Player({
			position: {
				x: 232,
				y: 10,
			},
			Image_src_prefix: '/srcs/game/assets/player_sprite/Char_1/with_hands/',
		});

		const player2 = new Player({
			position: {
				x: 6,
				y: 10,
			},
			Image_src_prefix: '/srcs/game/assets/player_sprite/Char_2/with_hands/',
		});
		
		const keysPlayer1 = {
			d: { pressed: false },
			q: { pressed: false },
			a: { pressed: false },
			s: { pressed: false },
			w: { pressed: false },
		};
		
		const keysPlayer2 = {
			l: { pressed: false },
			j: { pressed: false },
			i: { pressed: false },
			k: { pressed: false },
		};

		const background = new Sprite ({
			position: {
				x: 0,
				y: 2,
			},
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		})

		const background2 = new Sprite ({
			position: {
				x: 1390,
				y: 0,
			},
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		})



		function createLevelFromMap(levelMap, tileSize = 32) {
			const platforms = [];
			const rows = levelMap.trim().split('\n');
			
			for (let y = 0; y < rows.length; y++)
			{
				for (let x = 0; x < rows[y].length; x++)
				{
					const char = rows[y][x];
					
					if (char === '#')
					{
					platforms.push(
						new PlatForm({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/sol.png',
							scaleX: 1,
							scaleY: 1,
						}),
						}));
					}
					if (char === '2')
					{
					platforms.push(
						new PlatForm({
						position: { x: x * tileSize, y: y * tileSize },
						width: tileSize,
						height: tileSize,
						image: new Sprite({
							position: { x: x * tileSize, y: y * tileSize },
							Image_src: '/srcs/game/assets/City/sol2.png',
							scaleX: 1,
							scaleY: 1,
						}),
						}));
					}
					if (char === '1')
					{
						platforms.push(
							new PlatForm({
							position: { x: x * tileSize, y: y * tileSize },
							width: tileSize,
							height: tileSize,
							image: new Sprite({
								position: { x: x * tileSize, y: y * tileSize },
								Image_src: '/srcs/game/assets/City/pltformV2.png',
								scaleX: 1,
								scaleY: 1,
							}),
							}));
					}
					if (char === '3')
					{
						platforms.push(
							new PlatForm({
							position: { x: x * tileSize, y: y * tileSize },
							width: tileSize,
							height: tileSize,
							image: new Sprite({
								position: { x: x * tileSize, y: y * tileSize },
								Image_src: '/srcs/game/assets/City/sol3.png',
								scaleX: 1,
								scaleY: 1,
							}),
							}));
					}
				}
			}
			return platforms;
		}

const levelMap = `
222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2..................................................##....##.............................2
.......2...........###.........................................................................2
.......2...........................................##..................##......................2
.......2.......................................................................................2
.......2.......................................................................................2
.......2...#########11111#######################.........######................................2
.......2.......................................................................................2
.......2..........................................................######.......................2
.......2......................................######...........................................2
.......2......############.....................................................................2
.......2.................................................######................................2
.......2................########...............................................................2
.......2###....................................................................................2
...............................................................................................2
...............................................................................................2
#########################################################################.....##################
...................................2....................................2.....2................2
...................................2....................................2.....2................2
...................................#########111111#############.........2.....2................2
......................#..............................2........2......###2.....2................2
................##...................................2..................2.....2................2
...........................####....##################2..................2.....2................2
...........#.......................2.................2........2###......2.....2................2
#1112..............................2.................2........2.........2.....2................2
....2..............................2.................2........2.........2.....2................2
....2..............................2.................2......###...............2................2
....2..............................2.................2##......................2................2
....2..............................2.................2........................2................2
....23333333333333333333333333333332.................###################2.....2................2
..........................2......................................2......2.....2................2
..........................2......................................2......2.....2................2
..........................2......................................2......2.....2................2
..........................2......................................2......2#####2................2
..........................2......................................2.............................2
..........................2......................................2.............................2
..........................2......................................2.............................2
..........................2......................................2.............................2
..........................2......................................2.............................2
..........................2......................................2.............................2
.................................................................2.............................2
..............................................####...............2.............................2
.................................................................2.............................2
.....................................##..........................2.............................2
.......................................................33##......2.............................2
..........................3......................................2.............................2
..........................2......................................2.............................2
......................#...2..#.................................................................2
...............###........2....................................................................2
..........................2......................................2.............................2
..........................2......................................2.............................2
#333###########33333333333233333333333333333333333333333333333333###############################`


		const platformss = createLevelFromMap(levelMap);

		const collisionBox = new CollisionBox({
			position: {
				x: 665,
				y: 420,
			},
			width: 120,
			height: 100,
		});

		const collisionBox2 = new CollisionBox({
			position: {
				x: 1450,
				y: 830,
			},
			width: 120,
			height: 100,
		});

		const collisionBox3 = new CollisionBox({
			position: {
				x: 50,
				y: 1000,
			},
			width: 50,
			height: 50,
		});

		const trap1 = new trap({
			position: {
				x: 150,
				y: 1150,
			},
			width: 970,
			height: 50,
		});

		const trap2 = new trap({
			position: {
				x: 480,
				y: 1870,
			},
			width: 1600,
			height: 50,
		});

		const trap3 = new trap({
			position: {
				x: 35,
				y: 1870,
			},
			width: 80,
			height: 50,
		});

		const trap4 = new trap({
			position: {
				x: 834,
				y: 1680,
			},
			width: 30,
			height: 40,
		});

		const trap5 = new trap({
			position: {
				x: 1760,
				y: 1650,
			},
			width: 63,
			height: 40,
		});

		
		const camera = {
			position: {
				x: 0,
				y: 0,
			},
		};

	
		class GameState {
			static Menu = "Menu";
			static Play = "Play";
			static Pause = "pause";
		}

		const gameState = {
			current: GameState.Menu,
			previous: null,
		};

		class Menu {
			constructor() {
				this.title = "⏱️ Chrono Clash";
				this.options = ["▶ Start", "⚙ Options", "✖ Quit"];
				this.selectedOption = 0;
				this.optionSpacing = 60;
				this.titleFont = "bold 60px 'Press Start 2P', Black Ops One";
				this.optionFont = "30px 'Press Start 2P', Black Ops One";
		
				window.addEventListener("keydown", this.handleInput.bind(this));
			}
		
			draw() {
				// Fond semi-transparent
				c.fillStyle = "rgba(0, 0, 0, 0.75)";
				c.fillRect(0, 0, canvas.width, canvas.height);
		
				// Titre avec ombre
				c.font = this.titleFont;
				c.textAlign = "center";
				c.fillStyle = "#FFD700"; // doré
				c.shadowColor = "#000";
				c.shadowBlur = 10;
				c.fillText(this.title, canvas.width / 2, canvas.height / 4);
				c.shadowBlur = 0; // reset
		
				// Options
				c.font = this.optionFont;
				this.options.forEach((option, index) => {
					if (index === this.selectedOption) {
						c.fillStyle = "#00FFFF"; // cyan lumineux
					} else {
						c.fillStyle = "white";
					}
					c.fillText(option, canvas.width / 2, canvas.height / 2 + index * this.optionSpacing);
				});
			}
		
			handleInput(event) {
				switch (event.key) {
					case "ArrowUp":
					case "w":
						this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
						break;
					case "ArrowDown":
					case "s":
						this.selectedOption = (this.selectedOption + 1) % this.options.length;
						break;
					case "Enter":
						if (this.options[this.selectedOption] === "▶ Start") {
							console.log("Start game");
							// GameState.current = GameState.Play;
							gameState.previous = gameState.current;
							gameState.current = GameState.Play;
						} else if (this.options[this.selectedOption] === "⚙ Options") {
							// TODO: options menu
						} else if (this.options[this.selectedOption] === "✖ Quit") {
							window.close(); // ou un retour à l'accueil
						}
						break;
				}
			}

			update_selectedOption() {
				if (this.selectedOption === 0) {
					this.selectedOption = 1;
				} else {
					this.selectedOption = 0;
				}
			}
		}
		
		const menu = new Menu();
		animate();


		function animate() {

			window.requestAnimationFrame(animate);
		
			// === Clear Canvas ===
			c.fillStyle = 'rgba(rgb(12, 17, 33))'; // Couleur de fond
			c.fillRect(0, 0, canvas.width, canvas.height);
		
			
			// === Backgrounds ===
			console.log(gameState.current);
			switch (gameState.current)
			{
				case GameState.Menu:
					menu.draw();
					break;
				case GameState.Play:
				{
					console.log("je suis dans le jeu");
					c.fillStyle = 'rgba(rgb(12, 17, 33))'; // Couleur de fond
					c.fillRect(0, 0, canvas.width, canvas.height);
					c.save();
					c.scale(1, 1);
					c.translate(-camera.position.x, -camera.position.y);
					background.update();
					background2.update();
					
					// === Platforms ===
					platformss.forEach(platform => platform.draw());
					
					// === Collision Box ===
					collisionBox.draw();
					collisionBox2.draw();
					collisionBox3.draw();
					trap1.draw();
					trap2.draw();
					trap3.draw();
					trap4.draw();
					trap5.draw();
					
					// === Update Players ===
					player.update();
					player2.update();

					// === Camera Logic ===
					c.restore();

					// === Movement Logic ===
					if (keysPlayer1.d.pressed)
					{
						// console.log("je suis à droite");
						player.shouldPanCameraToRight({canvas, camera});
					}
					else if (keysPlayer1.a.pressed)
					{
						// console.log("je suis à gauche");
						player.shouldPanCameraToLeft({canvas, camera});
					}
					else if (keysPlayer1.w.pressed)
					{
						console.log("je suis en bas");
						player.shouldPanCameraToDown({canvas, camera});
					}
					handlePlayerMovement(player, keysPlayer1.a, keysPlayer1.d);
					handlePlayerMovement(player2, keysPlayer2.j, keysPlayer2.l);
					
					// === Platform Collision Check ===
					player.checkCollision(platformss);
					player2.checkCollision(platformss);

					if (player.velocity.y < 0) { // Quand le joueur saute
						player.shouldPanCameraToDown({canvas, camera});
					} else if (player.velocity.y > 0) { // Quand le joueur tombe
						player.shouldPanCameraToUP({canvas, camera});
					}
					
					if (player.velocity.y > 1)
					{
						player.isGrounded = false;
					}
					if (player2.velocity.y > 1)
					{
						player2.isGrounded = false;
					}
					
					handleCollision(player, collisionBox);
					handleCollision(player2, collisionBox);
					handleCollision(player, collisionBox2);
					handleCollision(player2, collisionBox2);
					handleCollision(player, collisionBox3);
					handleCollision(player2, collisionBox3);

					if (trap1.checkCollision(player))
					{
						console.log("collision avec le piège");
						player.position.x = 1057;
						player.position.y = 821.16;
						player.velocity.x = 0;
						player.velocity.y = 0;
						player.forceCameraToFollow({ canvas, camera }); // <- nouvelle ligne
						
					}
					// === Debugging ===
					
					if (trap2.checkCollision(player))
					{
						console.log("collision avec le piège");
						player.position.x = 463;
						player.position.y = 1653.16;
						player.velocity.x = 0;
						player.velocity.y = 0;
						player.forceCameraToFollow({ canvas, camera }); // <- nouvelle ligne
						
					}

					if (trap3.checkCollision(player))
					{
						console.log("collision avec le piège");
						player.position.x = 1057;
						player.position.y = 821.16;
						player.velocity.x = 0;
						player.velocity.y = 0;
						player.forceCameraToFollow({ canvas, camera }); // <- nouvelle ligne
					}

					if (trap4.checkCollision(player))
					{
						console.log("collision avec le piège");
						player.position.x = 463;
						player.position.y = 1653.16;
						player.velocity.x = 0;
						player.velocity.y = 0;
						player.forceCameraToFollow({ canvas, camera }); // <- nouvelle ligne
					}

					if (trap5.checkCollision(player))
					{
						console.log("collision avec le piège");
						player.position.x = 463;
						player.position.y = 1653.16;
						player.velocity.x = 0;
						player.velocity.y = 0;
						player.forceCameraToFollow({ canvas, camera }); // <- nouvelle ligne
					}
				}
				break;
			}
		}
		
		// === Helper Functions ===
		function handleCollision(player, box) {
			const isColliding = box.checkCollision(player);
			player.cantraverse = isColliding;
		
			if (isColliding) {
				console.log("collision");
			}
		}

		function handlePlayerMovement(player, keyLeft, keyRight) {
			player.velocity.x = 0;
		
			if (keyRight.pressed) {
				player.velocity.x = 3;
				if (player.state !== "walk" && player.isGrounded && (player.velocity.y === 0 || player.velocity.y === 0.5))
					player.changeState("walk");
			}
			else if (keyLeft.pressed) {
				player.velocity.x = -3;
				if (player.state !== "walk" && player.isGrounded && (player.velocity.y === 0 || player.velocity.y === 0.5))
					player.changeState("walk");
			}
			else {
				if (player.state === "walk")
					player.changeState("idle");
			}
		}
		


		window.addEventListener('keydown', (event) => {
			switch (event.key)
			{
				// Player 1
				case 'd':
					keysPlayer1.d.pressed = true;
					break;
				case 'a':
					keysPlayer1.a.pressed = true;
					break;
				case 'w':
					keysPlayer1.w.pressed = true;
					if (player.jumps === 0 || (player.jumps === 1 && !player.doubleJump)) {
						player.handleJump();  // Appeler la méthode qui gère les sauts
					}
					break;
				case 's':
					if (collisionBox.checkCollision(player) || collisionBox2.checkCollision(player) || collisionBox3.checkCollision(player))
					{
						player.cantraverseDown = true;
						setTimeout(() => {
							player.cantraverseDown = false;
						}, 50);
						console.log("collision");
					}
					break;
				// Player 2
				case 'j':
					keysPlayer2.j.pressed = true;
					break;
				case 'l':
					keysPlayer2.l.pressed = true;
					break;
				case 'i':
					console.log("japui sur arrow up");
					if (player2.jumps === 0 || (player2.jumps === 1 && !player2.doubleJump)) {
						player2.handleJump();  // Appeler la méthode qui gère les sauts
					}
					break;
				case 'k':
					if (collisionBox.checkCollision(player2) || collisionBox2.checkCollision(player2) || collisionBox3.checkCollision(player2))
					{
						player2.cantraverseDown = true;
						setTimeout(() => {
							player2.cantraverseDown = false;
						}, 50);
						console.log("collision");
					}
					break;
				}
			});
		
		window.addEventListener('keyup', (event) => {
			switch (event.key) {
			case 'd':
				keysPlayer1.d.pressed = false;
				break;
			case 'a':
				keysPlayer1.a.pressed = false;
				break;
			case 'j':
				keysPlayer2.j.pressed = false;
				break;
			case 'l':
				keysPlayer2.l.pressed = false;
				break;
			case 's':
				player.cantraverseDown = false;
				break;
			case 'k':
				player2.cantraverseDown = false;
				break;
			case 'w':
				keysPlayer1.w.pressed = false;
				break;
			}
		});
		
		
		
		
	}
}
