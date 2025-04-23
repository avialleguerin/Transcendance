import { canvas, c, camera, gameState, GameState } from './constants.js';
import Player from './Player.js';
import Sprite from './Sprite.js';
import Menu from './Menu.js';
import CollisionBox from './CollisionBox.js';
import Trap from './Trap.js';
import { levelMap } from './levelMap.js';
import { createLevelFromMap } from './level_map_utils.js';
import MapMenu_c from './Map_menu.js';
import  Coin  from './Coin.js';
import GameCanvas from './Game_canvas.js';



export function initGame() {
	// Player objects

	const keysPlayer1 = {
		left:  { key: 'a', pressed: false },
		right: { key: 'd', pressed: false },
		down:  { key: 's', pressed: false },
		jump:  { key: 'w', pressed: false },
		action: { key: 'q', pressed: false }, // facultatif selon ton jeu
	};
	
	const keysPlayer2 = {
		left:  { key: 'j', pressed: false },
		right: { key: 'l', pressed: false },
		down:  { key: 'k', pressed: false },
		jump:  { key: 'i', pressed: false },
		action: { key: null, pressed: false }, // si besoin
	};
	
	const player = new Player({
		position: { x: 232, y: 10 },
		Image_src_prefix: '/srcs/game/assets/player_sprite/Char_1/with_hands/',
		keys: keysPlayer1
	});
	
	const player2 = new Player({
		position: { x: 6, y: 10 },
		Image_src_prefix: '/srcs/game/assets/player_sprite/Char_2/with_hands/',
		keys: keysPlayer2
	});


	// Background elements
	const backgrounds = [
		new Sprite({
			position: { x: 0, y: 0 },
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		}),
		new Sprite({
			position: { x: 1390, y: 0 },
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		}),
		new Sprite({
			position: { x: 0, y: 780 },
			scaleX: 1.5,
			scaleY: 3,
			Image_src: '/srcs/game/assets/City/background1.png',
		}),
		new Sprite({
			position: { x: 1420, y: 780 },
			scaleX: 1.5,
			scaleY: 3,
			Image_src: '/srcs/game/assets/City/background1.png',
		}),
		new Sprite({
			position: { x: 2700, y: 0 },
			scaleX: 1.5,
			scaleY: 1,
			Image_src: '/srcs/game/assets/City/bg.png',
		}),
		new Sprite({
			position: { x: 2700, y: 780 },
			scaleX: 1.5,
			scaleY: 3,
			Image_src: '/srcs/game/assets/City/background1.png',
		}),
	];

	// Platforms from map
	const platforms = createLevelFromMap(levelMap);

	// Collision boxes
	const collisionBoxes = [
		new CollisionBox({
			position: { x: 665, y: 420 },
			width: 120,
			height: 150,
		}),
		new CollisionBox({
			position: { x: 1450, y: 830 },
			width: 120,
			height: 100,
		}),
		new CollisionBox({
			position: { x: 50, y: 1000 },
			width: 50,
			height: 50,
		}),
		new CollisionBox({
			position: { x: 1650, y: 620 },
			width: 150,
			height: 100,
		}),
	];
	// Traps
	const traps = [
		new Trap({
			position: {
				x: 150,
				y: 1150,
			},
			width: 970,
			height: 50,
		}),
		new Trap({
			position: {
				x: 480,
				y: 1870,
			},
			width: 1600,
			height: 50,
		}),
		new Trap({
			position: {
				x: 35,
				y: 1870,
			},
			width: 80,
			height: 50,
		}),
		new Trap({
			position: {
				x: 834,
				y: 1680,
			},
			width: 30,
			height: 40,
		}),
		new Trap({
			position: {
				x: 1760,
				y: 1650,
			},
			width: 63,
			height: 40,
		}),
		new Trap({
			position: {
				x: 1795,
				y: 110,
			},
			width: 220,
			height: 50,
		}),
		new Trap({
			position: {
				x: 2145,
				y: 110,
			},
			width: 220,
			height: 50,
		}),
		new Trap({
			position: {
				x: 2245,
				y: 350,
			},
			width: 260,
			height: 50,
		}),
		new Trap({
			position: {
				x: 2498,
				y: 190,
			},
			width: 30,
			height: 50,
		}),
		new Trap({
			position: {
				x: 2780,
				y: 730,
			},
			width: 100,
			height: 50,
		}),
	];

	const Coins = [
		new Coin({
			position: {
				x: 100,
				y: 500,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
		new Coin({
			position: {
				x: 1500,
				y: 400,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
		new Coin({
			position: {
				x: 3000,
				y: 200,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
		new Coin({
			position: {
				x: 2700,
				y: 300,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
	];

	const menu = new Menu();
	const mapMenu = new MapMenu_c();

	// === Helper Functions ===
	function handleCollision(player, box) {
		const isColliding = box.checkCollision(player);
	
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

	function handleTrapCollision(player, trap, respawnPoint) {
		if (trap.checkCollision(player)) {
			console.log("collision avec le piège");
			player.position.x = respawnPoint.x;
			player.position.y = respawnPoint.y;
			player.velocity.x = 0;
			player.velocity.y = 0;
			player.forceCameraToFollow({ canvas, camera });
		}
	}

	// Set up event listeners
	window.addEventListener('keydown', (event) => {
		switch (event.key) {
			// Player 1
			case 'd':
				keysPlayer1.right.pressed = true;
				break;
			case 'a':
				keysPlayer1.left.pressed = true;
				break;
			case 'w':
				keysPlayer1.jump.pressed = true;
				if (player.jumps === 0 || (player.jumps === 1 && !player.doubleJump)) {
					player.handleJump();  // Appeler la méthode qui gère les sauts
				}
				if (collisionBoxes.some(box => box.checkCollision(player))) {
					player.cantraverse = true;
					setTimeout(() => {
						player.cantraverse = false;
					}, 500);
					console.log("collision");
				}
				break;
			case 's':
				if (collisionBoxes.some(box => box.checkCollision(player))) {
					player.cantraverseDown = true;
					setTimeout(() => {
						player.cantraverseDown = false;
					}, 50);
					console.log("collision");
				}
				break;
			// Player 2
			case 'j':
				keysPlayer2.left.pressed = true;
				break;
			case 'l':
				keysPlayer2.right.pressed = true;
				break;
			case 'i':
				console.log("japui sur arrow up");
				if (player2.jumps === 0 || (player2.jumps === 1 && !player2.doubleJump)) {
					player2.handleJump();  // Appeler la méthode qui gère les sauts
				}
				break;
			case 'k':
				if (collisionBoxes.some(box => box.checkCollision(player2))) {
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
				keysPlayer1.right.pressed = false;
				break;
			case 'a':
				keysPlayer1.left.pressed = false;
				break;
			case 'j':
				keysPlayer2.left.pressed = false;
				break;
			case 'l':
				keysPlayer2.right.pressed = false;
				break;
			case 's':
				player.cantraverseDown = false;
				break;
			case 'k':
				player2.cantraverseDown = false;
				break;
			case 'w':
				keysPlayer1.jump.pressed = false;
				break;
		}
	});

	function handle_gameplay() {
		c.fillStyle = 'rgba(rgb(12, 17, 33))';
		c.fillRect(0, 0, canvas.width, canvas.height);
		
		// Save context state for camera transformation
		c.save();
		c.scale(1, 1);
		c.translate(-camera.position.x, -camera.position.y);
		
		// Draw backgrounds
		backgrounds.forEach(bg => bg.update());
		
		// Draw platforms
		platforms.forEach(platform => platform.draw());
		
		// Draw collision boxes
		collisionBoxes.forEach(box => box.draw());

		// Draw coin
		// traps.forEach(trap => trap.draw());

		// Update players
		player.update();
		player2.update();
		Coins.forEach(coin => coin.update());
		
		// Restore context state
		c.restore();
		
		// === Movement Logic ===
		if (keysPlayer1.right.pressed) {
			player.shouldPanCameraToRight({canvas, camera});
		}
		else if (keysPlayer1.left.pressed) {
			player.shouldPanCameraToLeft({canvas, camera});
		}
		else if (keysPlayer1.jump.pressed) {
			player.shouldPanCameraToDown({canvas, camera});
		}
		
		handlePlayerMovement(player, keysPlayer1.left, keysPlayer1.right);
		handlePlayerMovement(player2, keysPlayer2.left, keysPlayer2.right);
		
		// === Platform Collision Check ===
		player.checkCollision(platforms);
		player2.checkCollision(platforms);
		
		// Camera follow logic for jumps and falls
		if (player.velocity.y < 0) {
			player.shouldPanCameraToDown({canvas, camera});
		} else if (player.velocity.y > 0) {
			player.shouldPanCameraToUP({canvas, camera});
		}
		
		// Update grounded status
		if (player.velocity.y > 1) {
			player.isGrounded = false;
		}
		if (player2.velocity.y > 1) {
			player2.isGrounded = false;
		}
		
		// Handle collisions with pass-through platforms
		collisionBoxes.forEach(box => {
			handleCollision(player, box);
			handleCollision(player2, box);
		});
		
		// Handle trap collisions
		handleTrapCollision(player, traps[0], { x: 1057, y: 821.16 });
		handleTrapCollision(player, traps[1], { x: 463, y: 1653.16 });
		handleTrapCollision(player, traps[2], { x: 1057, y: 821.16 });
		handleTrapCollision(player, traps[3], { x: 463, y: 1653.16 });
		handleTrapCollision(player, traps[4], { x: 463, y: 1653.16 });
		handleTrapCollision(player, traps[5], { x: 883, y: 309.15999999999997 });
		handleTrapCollision(player, traps[6], { x: 883, y: 309.15999999999997 });
		handleTrapCollision(player, traps[7], { x: 883, y: 309.15999999999997 });
		handleTrapCollision(player, traps[8], { x: 883, y: 309.15999999999997 });
		handleTrapCollision(player, traps[9], { x: 883, y: 309.15999999999997 });

		Coins.forEach(coin => {
			if (coin.checkCollision(player)) {
				console.log("collision avec la pièce");
				coin.destroy();
				game_canvas.nb_coin++;
				// Gérer la collecte de la pièce ici
			}
		});

		// console.log(player.position.x, player.position.y);
	}
	
	const game_canvas = new GameCanvas({
		position: { x: 8, y: 8 },
		Image_src_prefix: '/srcs/game/assets/City/',
	});

	// Animation loop
	function animate() {
		window.requestAnimationFrame(animate);
	
		// === Clear Canvas ===
		c.fillStyle = 'rgba(rgb(12, 17, 33))';
		c.fillRect(0, 0, canvas.width, canvas.height);

		// === Game State Logic ===
		switch (gameState.current) {
			case GameState.Menu:
				menu.draw();
				break;
			case GameState.MapMenu:
				// console.log("Map Menu");
				mapMenu.draw();
				break;
			case GameState.Play:
				handle_gameplay();
				game_canvas.update();
				break;
			case GameState.Pause:
				break;
		}
	}
	
	// Start the game
	animate(keysPlayer1, keysPlayer2);
}
