import { canvas, c, camera, gameState, GameState } from './constants.js';
import Player from './Player.js';
import Sprite from './Sprite.js';
import Menu from './Menu.js';
import CollisionBox from './CollisionBox.js';
import Trap from './Trap.js';
import { levelMap } from './levelMap.js';
import { createLevelFromMap } from './level_map_utils.js';
import MapMenu_c from './Map_menu.js';
import Coin from './Coin.js';
import GameCanvas from './Game_canvas.js';
import EndGameFirstGame from './EndGameFirstGame.js';
import EndGameSecondeGame from './EndGameSecondeGame.js';
import GameHistory from './GameHistory.js';
import HistoryDatabase from './HistoryDatabase.js';
import Option from './option.js';
export function initGame() {
    const keysPlayer1 = {
        left: { key: 'ArrowLeft', pressed: false },
        right: { key: 'ArrowRight', pressed: false },
        down: { key: 'ArrowDown', pressed: false },
        jump: { key: 'ArrowUp', pressed: false },
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
            position: { x: 665, y: 420 },
            width: 120,
            height: 110,
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
        Game_History: gameHistory,
    });
    // === Helper Functions ===
    function handleCollision(player, box) {
        const isColliding = box.checkCollision(player);
        if (isColliding) {
            console.log("collision");
        }
    }
    player.forceCameraToFollow({ canvas, camera });
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
    let pause = false;
    // Set up event listeners
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            // Player 1
            case 'ArrowRight':
                keysPlayer1.right.pressed = true;
                break;
            case 'ArrowLeft':
                keysPlayer1.left.pressed = true;
                break;
            case 'ArrowUp':
                console.log("UP pressed");
                if (!game_canvas.GameIsPaused) {
                    if (!keysPlayer1.jump.pressed) {
                        keysPlayer1.jump.pressed = true;
                        if (player.jumps === 0 || (player.jumps === 1 && !player.doubleJump)) {
                            player.handleJump(); // Appeler la méthode qui gère les sauts
                        }
                        if (collisionBoxes.some(box => box.checkCollision(player))) {
                            player.cantraverse = true;
                            setTimeout(() => {
                                player.cantraverse = false;
                            }, 500);
                            console.log("collision");
                        }
                    }
                }
                break;
            case 'ArrowDown':
                if (collisionBoxes.some(box => box.checkCollision(player))) {
                    player.cantraverseDown = true;
                    setTimeout(() => {
                        player.cantraverseDown = false;
                    }, 50);
                    console.log("collision");
                }
                break;
            case "Escape":
                console.log("Escape pressed");
                if (gameState.current === GameState.Play && !pause) {
                    console.log("Game pauseddddddddddddddddddd");
                    pause = true;
                }
                else if (gameState.current === GameState.Play && pause) {
                    console.log("Game resumedddddddddddddddddddd");
                    pause = false;
                }
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
        // collisionBoxes.forEach(box => box.draw());
        // Draw coin
        // traps.forEach(trap => trap.draw());
        // Update players
        player.update();
        Coins.forEach(coin => coin.update());
        // Restore context state
        c.restore();
        // === Movement Logic ===
        if (keysPlayer1.right.pressed) {
            player.shouldPanCameraToRight({ canvas, camera });
        }
        else if (keysPlayer1.left.pressed) {
            player.shouldPanCameraToLeft({ canvas, camera });
        }
        else if (keysPlayer1.jump.pressed) {
            player.shouldPanCameraToDown({ canvas, camera });
        }
        handlePlayerMovement(player, keysPlayer1.left, keysPlayer1.right);
        // === Platform Collision Check ===
        player.checkCollision(platforms);
        // Camera follow logic for jumps and falls
        if (player.velocity.y < 0) {
            player.shouldPanCameraToDown({ canvas, camera });
        }
        else if (player.velocity.y > 0) {
            player.shouldPanCameraToUP({ canvas, camera });
        }
        // Update grounded status
        if (player.velocity.y > 1) {
            player.isGrounded = false;
        }
        // Handle collisions with pass-through platforms
        collisionBoxes.forEach(box => {
            handleCollision(player, box);
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
        if (end_game.checkCollision(player)) {
            console.log("collision avec la fin du jeu");
            if (end_game.first_game_finished === false) {
                console.log("first game finished");
                gameState.current = GameState.EndGameFirstGame;
            }
            if (end_game.first_game_finished === true) {
                console.log("second game finished");
                gameState.current = GameState.EndGameSecondGame;
            }
        }
        console.log(player.position.x, player.position.y);
    }
    const options = new Option();
    // Animation loop
    function animate() {
        window.requestAnimationFrame(animate);
        // === Clear Canvas ===
        c.fillStyle = 'rgba(rgb(12, 17, 33))';
        c.fillRect(0, 0, canvas.width, canvas.height);
        // console.log("Game State:", gameState.current);
        if (game_canvas.GameIsPaused) {
            player.velocity.x = 0;
            player.velocity.y = 0;
        }
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
    // Start the game
    animate(keysPlayer1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvcGxhdGZvcm1lci9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLElBQUksTUFBTSxXQUFXLENBQUM7QUFDN0IsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFDO0FBQzdCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxTQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQVEsSUFBSSxNQUFPLFdBQVcsQ0FBQztBQUMvQixPQUFPLFVBQVUsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQyxPQUFPLGdCQUFnQixNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sa0JBQWtCLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUM7QUFDM0MsT0FBTyxlQUFlLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBSWpDLE1BQU0sVUFBVSxRQUFRO0lBR3ZCLE1BQU0sV0FBVyxHQUFHO1FBQ25CLElBQUksRUFBRyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUMzQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7UUFDNUMsSUFB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VCxNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7S0FDRixDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUc7UUFDYixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsZ0JBQWdCLEVBQUUseUJBQXlCO1NBQzNDLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFD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LENBQUM7Z0JBQ1osTUFBTTtZQUNQLEtBQUssU0FBUyxDQUFDLE9BQU87Z0JBQ3JCLDJCQUEyQjtnQkFDM0IsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLE1BQU07WUFDUCxLQUFLLFNBQVMsQ0FBQyxJQUFJO2dCQUNsQixlQUFlLEVBQUUsQ0FBQztnQkFDbEIsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNyQixNQUFNO1lBQ1AsS0FBSyxTQUFTLENBQUMsZ0JBQWdCO2dCQUM5QixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLE1BQU07WUFDUCxLQUFLLFNBQVMsQ0FBQyxpQkFBaUI7Z0JBQy9CLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDakIsTUFBTTtZQUNQLEtBQUssU0FBUyxDQUFDLFdBQVc7Z0JBQ3pCLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDbkIsTUFBTTtZQUNQLEtBQUssU0FBUyxDQUFDLE9BQU87Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixNQUFNO1FBQ1IsQ0FBQztJQUNGLENBQUM7SUFFRCxpQkFBaUI7SUFDakIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3RCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjYW52YXMsIGMsIGNhbWVyYSwgZ2FtZVN0YXRlLCBHYW1lU3RhdGUgfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgUGxheWVyIGZyb20gJy4vUGxheWVyLmpzJztcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi9TcHJpdGUuanMnO1xuaW1wb3J0IE1lbnUgZnJvbSAnLi9NZW51LmpzJztcbmltcG9ydCBDb2xsaXNpb25Cb3ggZnJvbSAnLi9Db2xsaXNpb25Cb3guanMnO1xuaW1wb3J0IFRyYXAgZnJvbSAnLi9UcmFwLmpzJztcbmltcG9ydCB7IGxldmVsTWFwIH0gZnJvbSAnLi9sZXZlbE1hcC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVMZXZlbEZyb21NYXAgfSBmcm9tICcuL2xldmVsX21hcF91dGlscy5qcyc7XG5pbXBvcnQgTWFwTWVudV9jIGZyb20gJy4vTWFwX21lbnUuanMnO1xuaW1wb3J0ICBDb2luICBmcm9tICcuL0NvaW4uanMnO1xuaW1wb3J0IEdhbWVDYW52YXMgZnJvbSAnLi9HYW1lX2NhbnZhcy5qcyc7XG5pbXBvcnQgRW5kR2FtZUZpcnN0R2FtZSBmcm9tICcuL0VuZEdhbWVGaXJzdEdhbWUuanMnO1xuaW1wb3J0IEVuZEdhbWVTZWNvbmRlR2FtZSBmcm9tICcuL0VuZEdhbWVTZWNvbmRlR2FtZS5qcyc7XG5pbXBvcnQgR2FtZUhpc3RvcnkgZnJvbSAnLi9HYW1lSGlzdG9yeS5qcyc7XG5pbXBvcnQgSGlzdG9yeURhdGFiYXNlIGZyb20gJy4vSGlzdG9yeURhdGFiYXNlLmpzJztcbmltcG9ydCBPcHRpb24gZnJvbSAnLi9vcHRpb24uanMnO1xuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRHYW1lKClcbntcblxuXHRjb25zdCBrZXlzUGxheWVyMSA9IHtcblx0XHRsZWZ0OiAgeyBrZXk6ICdBcnJvd0xlZnQnLCBwcmVzc2VkOiBmYWxzZSB9LFxuXHRcdHJpZ2h0OiB7IGtleTogJ0Fycm93UmlnaHQnLCBwcmVzc2VkOiBmYWxzZSB9LFxuXHRcdGRvd246ICB7IGtleTogJ0Fycm93RG93bicsIHByZXNzZWQ6IGZhbHNlIH0sXG5cdFx0anVtcDogIHsga2V5OiAnQXJyb3dVcCcsIHByZXNzZWQ6IGZhbHNlIH0sXG5cdH07XG5cdFxuXHRjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyKHtcblx0XHRwb3NpdGlvbjogeyB4OiA5MzEsIHk6IDYyOS4xNiB9LFxuXHRcdEltYWdlX3NyY19wcmVmaXg6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9wbGF5ZXJfc3ByaXRlL0NoYXJfMS93aXRoX2hhbmRzLycsXG5cdFx0a2V5czoga2V5c1BsYXllcjFcblx0fSk7XG5cblxuXHRcblx0Ly8gQmFja2dyb3VuZCBlbGVtZW50c1xuXHRjb25zdCBiYWNrZ3JvdW5kcyA9IFtcblx0XHRuZXcgU3ByaXRlKHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfSxcblx0XHRcdHNjYWxlWDogMS41LFxuXHRcdFx0c2NhbGVZOiAxLFxuXHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9iZy5wbmcnLFxuXHRcdH0pLFxuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMTM5MCwgeTogMCB9LFxuXHRcdFx0c2NhbGVYOiAxLjUsXG5cdFx0XHRzY2FsZVk6IDEsXG5cdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L2JnLnBuZycsXG5cdFx0fSksXG5cdFx0bmV3IFNwcml0ZSh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiAwLCB5OiA3ODAgfSxcblx0XHRcdHNjYWxlWDogMS41LFxuXHRcdFx0c2NhbGVZOiAzLFxuXHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9iYWNrZ3JvdW5kMS5wbmcnLFxuXHRcdH0pLFxuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMTQyMCwgeTogNzgwIH0sXG5cdFx0XHRzY2FsZVg6IDEuNSxcblx0XHRcdHNjYWxlWTogMyxcblx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvYmFja2dyb3VuZDEucG5nJyxcblx0XHR9KSxcblx0XHRuZXcgU3ByaXRlKHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDI3MDAsIHk6IDAgfSxcblx0XHRcdHNjYWxlWDogMS41LFxuXHRcdFx0c2NhbGVZOiAxLFxuXHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9iZy5wbmcnLFxuXHRcdH0pLFxuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMjcwMCwgeTogNzgwIH0sXG5cdFx0XHRzY2FsZVg6IDEuNSxcblx0XHRcdHNjYWxlWTogMyxcblx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvYmFja2dyb3VuZDEucG5nJyxcblx0XHR9KSxcblx0XHRuZXcgU3ByaXRlKHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDI2NTAsIHk6IDE3NTAgfSxcblx0XHRcdHNjYWxlWDogMC43LFxuXHRcdFx0c2NhbGVZOiAwLjcsXG5cdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L2ZpbmlzaGxpbmUucG5nJyxcblx0XHR9KSxcblx0XTtcblxuXHQvLyBQbGF0Zm9ybXMgZnJvbSBtYXBcblx0Y29uc3QgcGxhdGZvcm1zID0gY3JlYXRlTGV2ZWxGcm9tTWFwKGxldmVsTWFwKTtcblxuXHQvLyBDb2xsaXNpb24gYm94ZXNcblx0Y29uc3QgY29sbGlzaW9uQm94ZXMgPSBbXG5cdFx0bmV3IENvbGxpc2lvbkJveCh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiA2NjUsIHk6IDQyMCB9LFxuXHRcdFx0d2lkdGg6IDEyMCxcblx0XHRcdGhlaWdodDogMTEwLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2xsaXNpb25Cb3goe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMTQ1MCwgeTogODMwIH0sXG5cdFx0XHR3aWR0aDogMTIwLFxuXHRcdFx0aGVpZ2h0OiAxMDAsXG5cdFx0fSksXG5cdFx0bmV3IENvbGxpc2lvbkJveCh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiA1MCwgeTogMTAwMCB9LFxuXHRcdFx0d2lkdGg6IDUwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgQ29sbGlzaW9uQm94KHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDE2NTAsIHk6IDYyMCB9LFxuXHRcdFx0d2lkdGg6IDE1MCxcblx0XHRcdGhlaWdodDogMTAwLFxuXHRcdH0pLFxuXHRdO1xuXHQvLyBUcmFwc1xuXHRjb25zdCB0cmFwcyA9IFtcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAxNTAsXG5cdFx0XHRcdHk6IDExNTAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDk3MCxcblx0XHRcdGhlaWdodDogNTAsXG5cdFx0fSksXG5cdFx0bmV3IFRyYXAoe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogNDgwLFxuXHRcdFx0XHR5OiAxODcwLFxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiAxNjAwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAzNSxcblx0XHRcdFx0eTogMTg3MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogODAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDgzNCxcblx0XHRcdFx0eTogMTY4MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogMzAsXG5cdFx0XHRoZWlnaHQ6IDQwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDE3NjAsXG5cdFx0XHRcdHk6IDE2NTAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDYzLFxuXHRcdFx0aGVpZ2h0OiA0MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAxNzk1LFxuXHRcdFx0XHR5OiAxMTAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDIyMCxcblx0XHRcdGhlaWdodDogNTAsXG5cdFx0fSksXG5cdFx0bmV3IFRyYXAoe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogMjE0NSxcblx0XHRcdFx0eTogMTEwLFxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiAyMjAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDIyNDUsXG5cdFx0XHRcdHk6IDM1MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogMjYwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAyNDk4LFxuXHRcdFx0XHR5OiAxOTAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDMwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAyNzgwLFxuXHRcdFx0XHR5OiA3MzAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdGhlaWdodDogNTAsXG5cdFx0fSksXG5cdF07XG5cblx0Y29uc3QgQ29pbnMgPSBbXG5cdFx0bmV3IENvaW4oe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogMTAwLFxuXHRcdFx0XHR5OiA1MDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAxNTAwLFxuXHRcdFx0XHR5OiA0MDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAzMDAwLFxuXHRcdFx0XHR5OiAyMDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAyNzAwLFxuXHRcdFx0XHR5OiAzMDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAxOTUwLFxuXHRcdFx0XHR5OiAxMDUwLFxuXHRcdFx0fSxcblx0XHRcdEltYWdlX3NyY19wcmVmaXg6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5LycsXG5cdFx0fSksXG5cdFx0bmV3IENvaW4oe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogNjM1LFxuXHRcdFx0XHR5OiAxMDAwLFxuXHRcdFx0fSxcblx0XHRcdEltYWdlX3NyY19wcmVmaXg6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5LycsXG5cdFx0fSksXG5cdFx0bmV3IENvaW4oe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogNjM1LFxuXHRcdFx0XHR5OiAxMDAwLFxuXHRcdFx0fSxcblx0XHRcdEltYWdlX3NyY19wcmVmaXg6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5LycsXG5cdFx0fSksXG5cdF07XG5cblx0Y29uc3QgZ2FtZV9jYW52YXMgPSBuZXcgR2FtZUNhbnZhcyh7XG5cdFx0cG9zaXRpb246IHsgeDogOCwgeTogOCB9LFxuXHRcdEltYWdlX3NyY19wcmVmaXg6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5LycsXG5cdFx0cGxheWVyOiBwbGF5ZXIsXG5cdH0pO1xuXG5cdGNvbnN0IGVuZF9nYW1lID0gbmV3IEVuZEdhbWVGaXJzdEdhbWUoe1xuXHRcdHBvc2l0aW9uOiB7IHg6IDI2ODAsIHk6IDE4MDAgfSxcblx0XHR3aWR0aDogMjUwLFxuXHRcdGhlaWdodDogMTUwLFxuXHRcdGdhbWVDYW52YXM6IGdhbWVfY2FudmFzLFxuXHRcdHBsYXllcjogcGxheWVyLFxuXHRcdGNvaW5zOiBDb2lucyxcblx0fSk7XG5cblx0Y29uc3QgaGlzdG9yeURCSW5zdGFuY2UgPSBuZXcgSGlzdG9yeURhdGFiYXNlKClcblxuXHRjb25zdCBnYW1lSGlzdG9yeSA9IG5ldyBHYW1lSGlzdG9yeSh7XG5cdFx0aGlzdG9yeURCOiBoaXN0b3J5REJJbnN0YW5jZSxcblx0fSk7XG5cdFxuXHRjb25zdCBtYXBNZW51ID0gbmV3IE1hcE1lbnVfYygpO1xuXG5cdGNvbnN0IGVuZF9nYW1lMiA9IG5ldyBFbmRHYW1lU2Vjb25kZUdhbWUoe1xuXHRcdGdhbWVDYW52YXM6IGdhbWVfY2FudmFzLFxuXHRcdHBsYXllcjogcGxheWVyLFxuXHRcdGNvaW5zOiBDb2lucyxcblx0XHRFbmRHYW1lX0ZpcnN0R2FtZTogZW5kX2dhbWUsXG5cdFx0aGlzdG9yeUdhbWU6IGdhbWVIaXN0b3J5LFxuXHRcdE1hcE1lbnU6IG1hcE1lbnUsXG5cdH0pO1xuXHRcblx0XG5cblxuXHRjb25zdCBtZW51ID0gbmV3IE1lbnUoe1xuXHRcdEdhbWVfSGlzdG9yeSA6IGdhbWVIaXN0b3J5LFxuXHR9KTtcblx0XG5cblxuXHQvLyA9PT0gSGVscGVyIEZ1bmN0aW9ucyA9PT1cblx0ZnVuY3Rpb24gaGFuZGxlQ29sbGlzaW9uKHBsYXllciwgYm94KSB7XG5cdFx0Y29uc3QgaXNDb2xsaWRpbmcgPSBib3guY2hlY2tDb2xsaXNpb24ocGxheWVyKTtcblx0XG5cdFx0aWYgKGlzQ29sbGlkaW5nKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNvbGxpc2lvblwiKTtcblx0XHR9XG5cdH1cblxuXHRwbGF5ZXIuZm9yY2VDYW1lcmFUb0ZvbGxvdyh7IGNhbnZhcywgY2FtZXJhIH0pO1xuXG5cdGZ1bmN0aW9uIGhhbmRsZVBsYXllck1vdmVtZW50KHBsYXllciwga2V5TGVmdCwga2V5UmlnaHQpIHtcblx0XHRwbGF5ZXIudmVsb2NpdHkueCA9IDA7XG5cdFxuXHRcdGlmIChrZXlSaWdodC5wcmVzc2VkKSB7XG5cdFx0XHRwbGF5ZXIudmVsb2NpdHkueCA9IDM7XG5cdFx0XHRpZiAocGxheWVyLnN0YXRlICE9PSBcIndhbGtcIiAmJiBwbGF5ZXIuaXNHcm91bmRlZCAmJiAocGxheWVyLnZlbG9jaXR5LnkgPT09IDAgfHwgcGxheWVyLnZlbG9jaXR5LnkgPT09IDAuNSkpXG5cdFx0XHRcdHBsYXllci5jaGFuZ2VTdGF0ZShcIndhbGtcIik7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGtleUxlZnQucHJlc3NlZCkge1xuXHRcdFx0cGxheWVyLnZlbG9jaXR5LnggPSAtMztcblx0XHRcdGlmIChwbGF5ZXIuc3RhdGUgIT09IFwid2Fsa1wiICYmIHBsYXllci5pc0dyb3VuZGVkICYmIChwbGF5ZXIudmVsb2NpdHkueSA9PT0gMCB8fCBwbGF5ZXIudmVsb2NpdHkueSA9PT0gMC41KSlcblx0XHRcdFx0cGxheWVyLmNoYW5nZVN0YXRlKFwid2Fsa1wiKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpZiAocGxheWVyLnN0YXRlID09PSBcIndhbGtcIilcblx0XHRcdFx0cGxheWVyLmNoYW5nZVN0YXRlKFwiaWRsZVwiKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcCwgcmVzcGF3blBvaW50KSB7XG5cdFx0aWYgKHRyYXAuY2hlY2tDb2xsaXNpb24ocGxheWVyKSkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJjb2xsaXNpb24gYXZlYyBsZSBwacOoZ2VcIik7XG5cdFx0XHRwbGF5ZXIucG9zaXRpb24ueCA9IHJlc3Bhd25Qb2ludC54O1xuXHRcdFx0cGxheWVyLnBvc2l0aW9uLnkgPSByZXNwYXduUG9pbnQueTtcblx0XHRcdHBsYXllci52ZWxvY2l0eS54ID0gMDtcblx0XHRcdHBsYXllci52ZWxvY2l0eS55ID0gMDtcblx0XHRcdHBsYXllci5mb3JjZUNhbWVyYVRvRm9sbG93KHsgY2FudmFzLCBjYW1lcmEgfSk7XG5cdFx0fVxuXHR9XG5cblx0bGV0IHBhdXNlID0gZmFsc2U7XG5cblx0Ly8gU2V0IHVwIGV2ZW50IGxpc3RlbmVyc1xuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuXHRcdHN3aXRjaCAoZXZlbnQua2V5KSB7XG5cdFx0XHQvLyBQbGF5ZXIgMVxuXHRcdFx0Y2FzZSAnQXJyb3dSaWdodCc6XG5cdFx0XHRcdGtleXNQbGF5ZXIxLnJpZ2h0LnByZXNzZWQgPSB0cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93TGVmdCc6XG5cdFx0XHRcdGtleXNQbGF5ZXIxLmxlZnQucHJlc3NlZCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dVcCc6XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiVVAgcHJlc3NlZFwiKTtcblx0XHRcdFx0aWYgKCFnYW1lX2NhbnZhcy5HYW1lSXNQYXVzZWQpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAoIWtleXNQbGF5ZXIxLmp1bXAucHJlc3NlZCkge1xuXHRcdFx0XHRcdFx0a2V5c1BsYXllcjEuanVtcC5wcmVzc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGlmIChwbGF5ZXIuanVtcHMgPT09IDAgfHwgKHBsYXllci5qdW1wcyA9PT0gMSAmJiAhcGxheWVyLmRvdWJsZUp1bXApKSB7XG5cdFx0XHRcdFx0XHRcdHBsYXllci5oYW5kbGVKdW1wKCk7ICAvLyBBcHBlbGVyIGxhIG3DqXRob2RlIHF1aSBnw6hyZSBsZXMgc2F1dHNcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmIChjb2xsaXNpb25Cb3hlcy5zb21lKGJveCA9PiBib3guY2hlY2tDb2xsaXNpb24ocGxheWVyKSkpIHtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmNhbnRyYXZlcnNlID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0cGxheWVyLmNhbnRyYXZlcnNlID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRcdH0sIDUwMCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiY29sbGlzaW9uXCIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93RG93bic6XG5cdFx0XHRcdGlmIChjb2xsaXNpb25Cb3hlcy5zb21lKGJveCA9PiBib3guY2hlY2tDb2xsaXNpb24ocGxheWVyKSkpIHtcblx0XHRcdFx0XHRwbGF5ZXIuY2FudHJhdmVyc2VEb3duID0gdHJ1ZTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdHBsYXllci5jYW50cmF2ZXJzZURvd24gPSBmYWxzZTtcblx0XHRcdFx0XHR9LCA1MCk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJjb2xsaXNpb25cIik7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIFwiRXNjYXBlXCI6XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiRXNjYXBlIHByZXNzZWRcIik7XG5cdFx0XHRcdGlmIChnYW1lU3RhdGUuY3VycmVudCA9PT0gR2FtZVN0YXRlLlBsYXkgJiYgIXBhdXNlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJHYW1lIHBhdXNlZGRkZGRkZGRkZGRkZGRkZGRkZFwiKTtcblx0XHRcdFx0XHRwYXVzZSA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZ2FtZVN0YXRlLmN1cnJlbnQgPT09IEdhbWVTdGF0ZS5QbGF5ICYmIHBhdXNlKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJHYW1lIHJlc3VtZWRkZGRkZGRkZGRkZGRkZGRkZGRkXCIpO1xuXHRcdFx0XHRcdHBhdXNlID0gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcblx0XHR9XG5cdH0pO1xuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldmVudCkgPT4ge1xuXHRcdHN3aXRjaCAoZXZlbnQua2V5KSB7XG5cdFx0XHRjYXNlICdBcnJvd1JpZ2h0Jzpcblx0XHRcdFx0a2V5c1BsYXllcjEucmlnaHQucHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93TGVmdCc6XG5cdFx0XHRcdGtleXNQbGF5ZXIxLmxlZnQucHJlc3NlZCA9IGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93RG93bic6XG5cdFx0XHRcdHBsYXllci5jYW50cmF2ZXJzZURvd24gPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdBcnJvd1VwJzpcblx0XHRcdFx0a2V5c1BsYXllcjEuanVtcC5wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gaGFuZGxlX2dhbWVwbGF5KCkge1xuXHRcdGMuZmlsbFN0eWxlID0gJ3JnYmEocmdiKDEyLCAxNywgMzMpKSc7XG5cdFx0Yy5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXHRcdFxuXHRcdGMuc2F2ZSgpO1xuXHRcdGMuc2NhbGUoMSwgMSk7XG5cdFx0Yy50cmFuc2xhdGUoLWNhbWVyYS5wb3NpdGlvbi54LCAtY2FtZXJhLnBvc2l0aW9uLnkpO1xuXHRcdFxuXHRcdGJhY2tncm91bmRzLmZvckVhY2goYmcgPT4gYmcudXBkYXRlKCkpO1xuXHRcdFxuXHRcdHBsYXRmb3Jtcy5mb3JFYWNoKHBsYXRmb3JtID0+IHBsYXRmb3JtLmRyYXcoKSk7XG5cdFx0XG5cdFx0Ly8gY29sbGlzaW9uQm94ZXMuZm9yRWFjaChib3ggPT4gYm94LmRyYXcoKSk7XG5cblxuXHRcdC8vIERyYXcgY29pblxuXHRcdC8vIHRyYXBzLmZvckVhY2godHJhcCA9PiB0cmFwLmRyYXcoKSk7XG5cblxuXHRcdC8vIFVwZGF0ZSBwbGF5ZXJzXG5cdFx0cGxheWVyLnVwZGF0ZSgpO1xuXHRcdENvaW5zLmZvckVhY2goY29pbiA9PiBjb2luLnVwZGF0ZSgpKTtcblx0XHRcblx0XHQvLyBSZXN0b3JlIGNvbnRleHQgc3RhdGVcblx0XHRjLnJlc3RvcmUoKTtcblx0XHRcblx0XHQvLyA9PT0gTW92ZW1lbnQgTG9naWMgPT09XG5cdFx0aWYgKGtleXNQbGF5ZXIxLnJpZ2h0LnByZXNzZWQpIHtcblx0XHRcdHBsYXllci5zaG91bGRQYW5DYW1lcmFUb1JpZ2h0KHtjYW52YXMsIGNhbWVyYX0pO1xuXHRcdH1cblx0XHRlbHNlIGlmIChrZXlzUGxheWVyMS5sZWZ0LnByZXNzZWQpIHtcblx0XHRcdHBsYXllci5zaG91bGRQYW5DYW1lcmFUb0xlZnQoe2NhbnZhcywgY2FtZXJhfSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGtleXNQbGF5ZXIxLmp1bXAucHJlc3NlZCkge1xuXHRcdFx0cGxheWVyLnNob3VsZFBhbkNhbWVyYVRvRG93bih7Y2FudmFzLCBjYW1lcmF9KTtcblx0XHR9XG5cdFx0XG5cdFx0aGFuZGxlUGxheWVyTW92ZW1lbnQocGxheWVyLCBrZXlzUGxheWVyMS5sZWZ0LCBrZXlzUGxheWVyMS5yaWdodCk7XG5cdFx0XG5cdFx0Ly8gPT09IFBsYXRmb3JtIENvbGxpc2lvbiBDaGVjayA9PT1cblx0XHRwbGF5ZXIuY2hlY2tDb2xsaXNpb24ocGxhdGZvcm1zKTtcblx0XHRcblx0XHQvLyBDYW1lcmEgZm9sbG93IGxvZ2ljIGZvciBqdW1wcyBhbmQgZmFsbHNcblx0XHRpZiAocGxheWVyLnZlbG9jaXR5LnkgPCAwKSB7XG5cdFx0XHRwbGF5ZXIuc2hvdWxkUGFuQ2FtZXJhVG9Eb3duKHtjYW52YXMsIGNhbWVyYX0pO1xuXHRcdH0gZWxzZSBpZiAocGxheWVyLnZlbG9jaXR5LnkgPiAwKSB7XG5cdFx0XHRwbGF5ZXIuc2hvdWxkUGFuQ2FtZXJhVG9VUCh7Y2FudmFzLCBjYW1lcmF9KTtcblx0XHR9XG5cdFx0XG5cdFx0Ly8gVXBkYXRlIGdyb3VuZGVkIHN0YXR1c1xuXHRcdGlmIChwbGF5ZXIudmVsb2NpdHkueSA+IDEpIHtcblx0XHRcdHBsYXllci5pc0dyb3VuZGVkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gSGFuZGxlIGNvbGxpc2lvbnMgd2l0aCBwYXNzLXRocm91Z2ggcGxhdGZvcm1zXG5cdFx0Y29sbGlzaW9uQm94ZXMuZm9yRWFjaChib3ggPT4ge1xuXHRcdFx0aGFuZGxlQ29sbGlzaW9uKHBsYXllciwgYm94KTtcblx0XHR9KTtcblx0XHRcblx0XHQvLyBIYW5kbGUgdHJhcCBjb2xsaXNpb25zXG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzBdLCB7IHg6IDEwNTcsIHk6IDgyMS4xNiB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbMV0sIHsgeDogNDYzLCB5OiAxNjUzLjE2IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1syXSwgeyB4OiAxMDU3LCB5OiA4MjEuMTYgfSk7XG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzNdLCB7IHg6IDQ2MywgeTogMTY1My4xNiB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbNF0sIHsgeDogNDYzLCB5OiAxNjUzLjE2IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1s1XSwgeyB4OiA4ODMsIHk6IDMwOS4xNTk5OTk5OTk5OTk5NyB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbNl0sIHsgeDogODgzLCB5OiAzMDkuMTU5OTk5OTk5OTk5OTcgfSk7XG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzddLCB7IHg6IDg4MywgeTogMzA5LjE1OTk5OTk5OTk5OTk3IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1s4XSwgeyB4OiA4ODMsIHk6IDMwOS4xNTk5OTk5OTk5OTk5NyB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbOV0sIHsgeDogODgzLCB5OiAzMDkuMTU5OTk5OTk5OTk5OTcgfSk7XG5cblx0XHRDb2lucy5mb3JFYWNoKGNvaW4gPT4ge1xuXHRcdFx0aWYgKGNvaW4uY2hlY2tDb2xsaXNpb24ocGxheWVyKSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcImNvbGxpc2lvbiBhdmVjIGxhIHBpw6hjZVwiKTtcblx0XHRcdFx0Y29pbi5kZXN0cm95KCk7XG5cdFx0XHRcdGdhbWVfY2FudmFzLm5iX2NvaW4rKztcblx0XHRcdFx0Ly8gR8OpcmVyIGxhIGNvbGxlY3RlIGRlIGxhIHBpw6hjZSBpY2lcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChlbmRfZ2FtZS5jaGVja0NvbGxpc2lvbihwbGF5ZXIpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNvbGxpc2lvbiBhdmVjIGxhIGZpbiBkdSBqZXVcIik7XG5cdFx0XHRpZiAoZW5kX2dhbWUuZmlyc3RfZ2FtZV9maW5pc2hlZCA9PT0gZmFsc2UpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiZmlyc3QgZ2FtZSBmaW5pc2hlZFwiKTtcblx0XHRcdFx0Z2FtZVN0YXRlLmN1cnJlbnQgPSBHYW1lU3RhdGUuRW5kR2FtZUZpcnN0R2FtZTtcblx0XHRcdH1cblx0XHRcdGlmIChlbmRfZ2FtZS5maXJzdF9nYW1lX2ZpbmlzaGVkID09PSB0cnVlKVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcInNlY29uZCBnYW1lIGZpbmlzaGVkXCIpO1xuXHRcdFx0XHRnYW1lU3RhdGUuY3VycmVudCA9IEdhbWVTdGF0ZS5FbmRHYW1lU2Vjb25kR2FtZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRjb25zb2xlLmxvZyhwbGF5ZXIucG9zaXRpb24ueCwgcGxheWVyLnBvc2l0aW9uLnkpO1xuXHR9XG5cdFxuXHRjb25zdCBvcHRpb25zID0gbmV3IE9wdGlvbigpO1xuXG5cdC8vIEFuaW1hdGlvbiBsb29wXG5cdGZ1bmN0aW9uIGFuaW1hdGUoKSB7XG5cblx0XHR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUpO1xuXHRcblx0XHQvLyA9PT0gQ2xlYXIgQ2FudmFzID09PVxuXHRcdGMuZmlsbFN0eWxlID0gJ3JnYmEocmdiKDEyLCAxNywgMzMpKSc7XG5cdFx0Yy5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG5cdFx0Ly8gY29uc29sZS5sb2coXCJHYW1lIFN0YXRlOlwiLCBnYW1lU3RhdGUuY3VycmVudCk7XG5cdFx0aWYgKGdhbWVfY2FudmFzLkdhbWVJc1BhdXNlZCkge1xuXHRcdFx0cGxheWVyLnZlbG9jaXR5LnggPSAwO1xuXHRcdFx0cGxheWVyLnZlbG9jaXR5LnkgPSAwO1xuXHRcdH1cblxuXHRcdC8vID09PSBHYW1lIFN0YXRlIExvZ2ljID09PVxuXHRcdHN3aXRjaCAoZ2FtZVN0YXRlLmN1cnJlbnQpIHtcblx0XHRcdGNhc2UgR2FtZVN0YXRlLk1lbnU6XG5cdFx0XHRcdG1lbnUuZHJhdygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgR2FtZVN0YXRlLk1hcE1lbnU6XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKFwiTWFwIE1lbnVcIik7XG5cdFx0XHRcdG1hcE1lbnUuZHJhdygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgR2FtZVN0YXRlLlBsYXk6XG5cdFx0XHRcdGhhbmRsZV9nYW1lcGxheSgpO1xuXHRcdFx0XHRnYW1lX2NhbnZhcy51cGRhdGUoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEdhbWVTdGF0ZS5FbmRHYW1lRmlyc3RHYW1lOlxuXHRcdFx0XHRlbmRfZ2FtZS5kcmF3KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBHYW1lU3RhdGUuRW5kR2FtZVNlY29uZEdhbWU6XG5cdFx0XHRcdGVuZF9nYW1lMi5kcmF3KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBHYW1lU3RhdGUuR2FtZUhpc3Rvcnk6XG5cdFx0XHRcdGdhbWVIaXN0b3J5LmRyYXcoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEdhbWVTdGF0ZS5PcHRpb25zOlxuXHRcdFx0XHRvcHRpb25zLmRyYXcoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdFxuXHQvLyBTdGFydCB0aGUgZ2FtZVxuXHRhbmltYXRlKGtleXNQbGF5ZXIxKTtcbn1cbiJdfQ==