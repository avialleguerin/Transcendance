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


		c.fillStyle = "white";
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
					console.log("Image loaded:", Image_src)
				}
				
				this.image.onerror = () => {
					console.error("Failed to load image:", Image_src)
				}
				
				// Définir la source après avoir configuré les gestionnaires d'événements
				this.image.src = Image_src
			}
		
			draw() {
				if (!this.loaded) {
					// Ne dessine pas si l'image n'est pas encore chargée
					return
				}
				c.drawImage(
					this.image, 
					this.position.x, 
					this.position.y, 
					this.width,
					this.height
				)
			}
		
			update() {
				this.draw()
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
				  c.fillStyle = "brown";
				  c.fillRect(this.position.x, this.position.y, this.width, this.height);
				}
			  }
		}

		
		class Player {
			constructor(position)
			{
				this.position = position;
				this.velocity = {
					x: 0,
					y: 1,
				};
				this.width = 32;
				this.height = 32;
			}

			draw() {
				c.fillStyle = "red";
				c.fillRect(this.position.x, this.position.y, this.width, this.height);
			}

			update() {
				this.position.y += this.velocity.y;
				this.position.x += this.velocity.x;
				if (this.position.y + this.height + this.velocity.y < canvas.height - 30) {
					this.velocity.y += gravity; // Gravity
				}
				else {
					this.velocity.y = 0;
				}
				this.draw();
			}
		}

		const player = new Player({
			x: 0,
			y: 0,
		});

		const player2 = new Player({
			x: 100,
			y: 100,
		});
		
		const keys = {
			d: {
				pressed: false,
			},
			q: {
				pressed: false,
			},
		}

		const background = new Sprite ({
			position: {
				x: 0,
				y: -210,
			},
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		})

		const background2 = new Sprite ({
			position: {
				x: 440,
				y: -210,
			},
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		})

		function createLevelFromMap(levelMap, tileSize = 32) {
			const platforms = [];
			const rows = levelMap.trim().split('\n');
			
			for (let y = 0; y < rows.length; y++) {
			  for (let x = 0; x < rows[y].length; x++) {
				const char = rows[y][x];
				
				if (char === '#') { // Sol normal
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
					  })
					})
				  );
				}
				// Tu peux ajouter d'autres types de tuiles ici
			  }
			}
			
			return platforms;
		  }
		  
const levelMap = `
################################
#..............................#
#..............................#
#.........###..................#
#..................###.........#
#..............................#
#..............................#
####################...........#
####################...........#
#..............................#
#..............................#
#..............................#
#..............................#
#..............................#
#..............................#
#..............................#
#..............................#
################################`
		  
		  const platformss = createLevelFromMap(levelMap);


		
		animate();

		function animate() {
			window.requestAnimationFrame(animate);
			c.fillStyle = "white";
			c.fillRect(0, 0, canvas.width, canvas.height);

			c.save();
			c.scale(1, 1);
			background.update();
			background2.update();
			// platforms.forEach((platform) => {
			// 	platform.draw();
			// });
			platformss.forEach((platform) => {
				platform.draw();
			});
			player.update();
			player2.update();

			player.velocity.x = 0;
			if (keys.d.pressed == true)
				player.velocity.x = 3;
			else if (keys.q.pressed == true)
				player.velocity.x = -3;


			// console.log("animation frame");
		}


		window.addEventListener("keydown", (event) => {
			switch (event.key) {
				case 'd' :
					keys.d.pressed = true
					break
				case 'q' :
					keys.q.pressed = true
					break
				case 'z' :
					player.velocity.y = -10
					break
			}
		});

		window.addEventListener("keyup", (event) => {
			switch (event.key) {
				case 'd' :
					keys.d.pressed = false
					break
				case 'q' :
					keys.q.pressed = false
					break
			}
		});
		
		
	}
}
