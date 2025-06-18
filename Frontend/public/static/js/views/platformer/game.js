import { canvas, c, camera, gameState, GameState } from './constants.js';
import Player from './Player.js';
import Sprite from './Sprite.js';
import Menu from './Menu.js';
import CollisionBox from './CollisionBox.js';
import CollisionBoxDown from './checkCollisionDown.js';
import Trap from './Trap.js';
import { levelMap } from './levelMap.js';
import { createLevelFromMap } from './level_map_utils.js';
import MapMenu_c from './Map_menu.js';
import  Coin  from './Coin.js';
import GameCanvas from './Game_canvas.js';
import EndGameFirstGame from './EndGameFirstGame.js';
import EndGameSecondeGame from './EndGameSecondeGame.js';
import GameHistory from './GameHistory.js';
import HistoryDatabase from './HistoryDatabase.js';
import Option from './option.js';



export function initGame()
{

	const keysPlayer1 = {
		left:  { key: 'ArrowLeft', pressed: false },
		right: { key: 'ArrowRight', pressed: false },
		down:  { key: 'ArrowDown', pressed: false },
		jump:  { key: 'ArrowUp', pressed: false },
	};
	
	const player = new Player({
		position: { x: 931, y: 629.16 },
		Image_src_prefix: '/srcs/game/assets/player_sprite/Char_1/with_hands/',
		keys: keysPlayer1
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
		new Sprite({
			position: { x: 2650, y: 1750 },
			scaleX: 0.7,
			scaleY: 0.7,
			Image_src: '/srcs/game/assets/City/finishline.png',
		}),
	];

	// Platforms from map
	const platforms = createLevelFromMap(levelMap);

	// Collision boxes
	const collisionBoxes = [
		new CollisionBox({
			position: { x: 665, y: 450 },
			width: 120,
			height: 80,
		}),
		new CollisionBox({
			position: { x: 1450, y: 870 },
			width: 120,
			height: 80,
		}),
		new CollisionBox({
			position: { x: 50, y: 1030 },
			width: 50,
			height: 50,
		}),
		new CollisionBox({
			position: { x: 1650, y: 650 },
			width: 150,
			height: 80,
		}),
	];

	const collisionBoxesDown = [
		new CollisionBoxDown({
			position: { x: 665, y: 420 },
			width: 120,
			height: 30,
		}),
		new CollisionBoxDown({
			position: { x: 1450, y: 830 },
			width: 120,
			height: 30,
		}),
		new CollisionBoxDown({
			position: { x: 50, y: 1000 },
			width: 50,
			height: 30,
		}),
		new CollisionBoxDown({
			position: { x: 1650, y: 620 },
			width: 150,
			height: 30,
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
				y: 1880,
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
				y: 1690,
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
		new Coin({
			position: {
				x: 1950,
				y: 1050,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
		new Coin({
			position: {
				x: 635,
				y: 1000,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
		new Coin({
			position: {
				x: 635,
				y: 1000,
			},
			Image_src_prefix: '/srcs/game/assets/City/',
		}),
	];

	const game_canvas = new GameCanvas({
		position: { x: 8, y: 8 },
		Image_src_prefix: '/srcs/game/assets/City/',
		player: player,
	});

	const end_game = new EndGameFirstGame({
		position: { x: 2680, y: 1800 },
		width: 250,
		height: 150,
		gameCanvas: game_canvas,
		player: player,
		coins: Coins,
	});

	const historyDBInstance = new HistoryDatabase();
	historyDBInstance.loadFromLocalStorage(); // Charger l'historique depuis le localStorage

	const gameHistory = new GameHistory({
		historyDB: historyDBInstance,
	});
	
	const mapMenu = new MapMenu_c();

	const end_game2 = new EndGameSecondeGame({
		gameCanvas: game_canvas,
		player: player,
		coins: Coins,
		EndGame_FirstGame: end_game,
		historyGame: gameHistory,
		MapMenu: mapMenu,
	});
	
	


	const menu = new Menu({
		Game_History : gameHistory,
	});


	function handleCollision(player, box) {
		box.checkCollision(player);
	}

	function handleCollisionDown(player, box) {
		box.checkCollisionDown(player);
	}


	player.forceCameraToFollow({ canvas, camera });

	function handlePlayerMovement(player, keyLeft, keyRight) {
		player.velocity.x = 0;
	
		if (keyRight.pressed) {
			player.velocity.x = 5;
			if (player.state !== "walk" && player.isGrounded && (player.velocity.y === 0 || player.velocity.y === 0.5))
				player.changeState("walk");
		}
		else if (keyLeft.pressed) {
			player.velocity.x = -5;
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
			player.position.x = respawnPoint.x;
			player.position.y = respawnPoint.y;
			player.velocity.x = 0;
			player.velocity.y = 0;
			player.forceCameraToFollow({ canvas, camera });
		}
	}

	let pause = false;

	window.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'ArrowRight':
				keysPlayer1.right.pressed = true;
				break;
			case 'ArrowLeft':
				keysPlayer1.left.pressed = true;
				break;
			case 'ArrowUp':
				if (!game_canvas.GameIsPaused)
				{
					if (!keysPlayer1.jump.pressed) {
						keysPlayer1.jump.pressed = true;
						if (player.jumps === 0 || (player.jumps === 1 && !player.doubleJump)) {
							player.handleJump();  // Appeler la méthode qui gère les sauts
						}
						if (collisionBoxes.some(box => box.checkCollision(player))) {
							player.cantraverse = true;
							setTimeout(() => {
								player.cantraverse = false;
							}, 500);
						}
					}
				}
				break;
			case 'ArrowDown':
				if (collisionBoxesDown.some(box => box.checkCollisionDown(player))) {
					player.cantraverseDown = true;
					setTimeout(() => {
						player.cantraverseDown = false;
					}, 50);
				}
				break;
			case "Escape":
				if (gameState.current === GameState.Play && !pause)
					pause = true;
				else if (gameState.current === GameState.Play && pause)
					pause = false;
				break;
			
		}
	});

	window.addEventListener('keyup', (event) => {
		switch (event.key) {
			case 'ArrowRight':
				keysPlayer1.right.pressed = false;
				break;
			case 'ArrowLeft':
				keysPlayer1.left.pressed = false;
				break;
			case 'ArrowDown':
				player.cantraverseDown = false;
				break;
			case 'ArrowUp':
				keysPlayer1.jump.pressed = false;
				break;
		}
	});

	function handle_gameplay() {
		c.fillStyle = 'rgba(rgb(12, 17, 33))';
		c.fillRect(0, 0, canvas.width, canvas.height);
		
		c.save();
		c.scale(1, 1);
		c.translate(-camera.position.x, -camera.position.y);
		
		backgrounds.forEach(bg => bg.update());
		
		platforms.forEach(platform => platform.draw());
		
		collisionBoxes.forEach(box => box.draw());
		collisionBoxesDown.forEach(box => box.draw());

		traps.forEach(trap => trap.draw());

		player.update();
		Coins.forEach(coin => coin.update());
		c.restore();
		
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
		
		player.checkCollision(platforms);
		
		if (player.velocity.y < 0)
			player.shouldPanCameraToDown({canvas, camera});
		else if (player.velocity.y > 0)
			player.shouldPanCameraToUP({canvas, camera});
		
		if (player.velocity.y > 1)
			player.isGrounded = false;

		collisionBoxes.forEach(box => {
			handleCollision(player, box);
		});

		collisionBoxesDown.forEach(box => {
			handleCollisionDown(player, box);
		});

		
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
				coin.destroy();
				game_canvas.nb_coin++;
			}
		});

		if (end_game.checkCollision(player)) {
			if (end_game.first_game_finished === false)
				gameState.current = GameState.EndGameFirstGame;
			if (end_game.first_game_finished === true)
				gameState.current = GameState.EndGameSecondGame;
		}
	}
	
	const options = new Option();

	function animate() {

		window.requestAnimationFrame(animate);
	
		c.fillStyle = 'rgba(rgb(12, 17, 33))';
		c.fillRect(0, 0, canvas.width, canvas.height);

		if (game_canvas.GameIsPaused) {
			player.velocity.x = 0;
			player.velocity.y = 0;
		}

		switch (gameState.current) {
			case GameState.Menu:
				menu.draw();
				break;
			case GameState.MapMenu:
				mapMenu.draw();
				break;
			case GameState.Play:
				handle_gameplay();
				game_canvas.update();
				break;
			case GameState.EndGameFirstGame:
				end_game.draw();
				break;
			case GameState.EndGameSecondGame:
				end_game2.draw();
				break;
			case GameState.GameHistory:
				gameHistory.draw();
				break;
			case GameState.Options:
				options.draw();
				break;
		}
	}
	
	animate(keysPlayer1);
}
