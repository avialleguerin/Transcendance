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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3B1YmxpYy9zdGF0aWMvanMvdmlld3MvcGxhdGZvcm1lci9nYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBQ2pDLE9BQU8sTUFBTSxNQUFNLGFBQWEsQ0FBQztBQUNqQyxPQUFPLElBQUksTUFBTSxXQUFXLENBQUM7QUFDN0IsT0FBTyxZQUFZLE1BQU0sbUJBQW1CLENBQUM7QUFDN0MsT0FBTyxJQUFJLE1BQU0sV0FBVyxDQUFDO0FBQzdCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxTQUFTLE1BQU0sZUFBZSxDQUFDO0FBQ3RDLE9BQVEsSUFBSSxNQUFPLFdBQVcsQ0FBQztBQUMvQixPQUFPLFVBQVUsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQyxPQUFPLGdCQUFnQixNQUFNLHVCQUF1QixDQUFDO0FBQ3JELE9BQU8sa0JBQWtCLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxXQUFXLE1BQU0sa0JBQWtCLENBQUM7QUFDM0MsT0FBTyxlQUFlLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxNQUFNLE1BQU0sYUFBYSxDQUFDO0FBSWpDLE1BQU0sVUFBVSxRQUFRO0lBR3ZCLE1BQU0sV0FBVyxHQUFHO1FBQ25CLElBQUksRUFBRyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtRQUMzQyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUU7UUFDNUMsSUFB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VCxNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEVBQUU7WUFDVCxNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsS0FBSyxFQUFFLEdBQUc7WUFDVixNQUFNLEVBQUUsRUFBRTtTQUNWLENBQUM7S0FDRixDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUc7UUFDYixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsR0FBRzthQUNOO1lBQ0QsZ0JBQWdCLEVBQUUseUJBQXlCO1NBQzNDLENBQUM7UUFDRixJQUFJLElBQUksQ0FBQztZQUNSLFFBQVEsRUFBRTtnQkFDVCxDQUFDLEVBQUUsSUFBSTtnQkFDUCxDQUFD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LEtBQUssU0FBUyxDQUFDLElBQUk7Z0JBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDWixNQUFNO1lBQ1AsS0FBSyxTQUFTLENBQUMsT0FBTztnQkFDckIsMkJBQTJCO2dCQUMzQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2YsTUFBTTtZQUNQLEtBQUssU0FBUyxDQUFDLElBQUk7Z0JBQ2xCLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3JCLE1BQU07WUFDUCxLQUFLLFNBQVMsQ0FBQyxnQkFBZ0I7Z0JBQzlCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDaEIsTUFBTTtZQUNQLEtBQUssU0FBUyxDQUFDLGlCQUFpQjtnQkFDL0IsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNqQixNQUFNO1lBQ1AsS0FBSyxTQUFTLENBQUMsV0FBVztnQkFDekIsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNuQixNQUFNO1lBQ1AsS0FBSyxTQUFTLENBQUMsT0FBTztnQkFDckIsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNmLE1BQU07UUFDUixDQUFDO0lBQ0YsQ0FBQztJQUVELGlCQUFpQjtJQUNqQixPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNhbnZhcywgYywgY2FtZXJhLCBnYW1lU3RhdGUsIEdhbWVTdGF0ZSB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCBQbGF5ZXIgZnJvbSAnLi9QbGF5ZXIuanMnO1xuaW1wb3J0IFNwcml0ZSBmcm9tICcuL1Nwcml0ZS5qcyc7XG5pbXBvcnQgTWVudSBmcm9tICcuL01lbnUuanMnO1xuaW1wb3J0IENvbGxpc2lvbkJveCBmcm9tICcuL0NvbGxpc2lvbkJveC5qcyc7XG5pbXBvcnQgVHJhcCBmcm9tICcuL1RyYXAuanMnO1xuaW1wb3J0IHsgbGV2ZWxNYXAgfSBmcm9tICcuL2xldmVsTWFwLmpzJztcbmltcG9ydCB7IGNyZWF0ZUxldmVsRnJvbU1hcCB9IGZyb20gJy4vbGV2ZWxfbWFwX3V0aWxzLmpzJztcbmltcG9ydCBNYXBNZW51X2MgZnJvbSAnLi9NYXBfbWVudS5qcyc7XG5pbXBvcnQgIENvaW4gIGZyb20gJy4vQ29pbi5qcyc7XG5pbXBvcnQgR2FtZUNhbnZhcyBmcm9tICcuL0dhbWVfY2FudmFzLmpzJztcbmltcG9ydCBFbmRHYW1lRmlyc3RHYW1lIGZyb20gJy4vRW5kR2FtZUZpcnN0R2FtZS5qcyc7XG5pbXBvcnQgRW5kR2FtZVNlY29uZGVHYW1lIGZyb20gJy4vRW5kR2FtZVNlY29uZGVHYW1lLmpzJztcbmltcG9ydCBHYW1lSGlzdG9yeSBmcm9tICcuL0dhbWVIaXN0b3J5LmpzJztcbmltcG9ydCBIaXN0b3J5RGF0YWJhc2UgZnJvbSAnLi9IaXN0b3J5RGF0YWJhc2UuanMnO1xuaW1wb3J0IE9wdGlvbiBmcm9tICcuL29wdGlvbi5qcyc7XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdEdhbWUoKVxue1xuXG5cdGNvbnN0IGtleXNQbGF5ZXIxID0ge1xuXHRcdGxlZnQ6ICB7IGtleTogJ0Fycm93TGVmdCcsIHByZXNzZWQ6IGZhbHNlIH0sXG5cdFx0cmlnaHQ6IHsga2V5OiAnQXJyb3dSaWdodCcsIHByZXNzZWQ6IGZhbHNlIH0sXG5cdFx0ZG93bjogIHsga2V5OiAnQXJyb3dEb3duJywgcHJlc3NlZDogZmFsc2UgfSxcblx0XHRqdW1wOiAgeyBrZXk6ICdBcnJvd1VwJywgcHJlc3NlZDogZmFsc2UgfSxcblx0fTtcblx0XG5cdGNvbnN0IHBsYXllciA9IG5ldyBQbGF5ZXIoe1xuXHRcdHBvc2l0aW9uOiB7IHg6IDkzMSwgeTogNjI5LjE2IH0sXG5cdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL3BsYXllcl9zcHJpdGUvQ2hhcl8xL3dpdGhfaGFuZHMvJyxcblx0XHRrZXlzOiBrZXlzUGxheWVyMVxuXHR9KTtcblxuXG5cdFxuXHQvLyBCYWNrZ3JvdW5kIGVsZW1lbnRzXG5cdGNvbnN0IGJhY2tncm91bmRzID0gW1xuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMCwgeTogMCB9LFxuXHRcdFx0c2NhbGVYOiAxLjUsXG5cdFx0XHRzY2FsZVk6IDEsXG5cdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L2JnLnBuZycsXG5cdFx0fSksXG5cdFx0bmV3IFNwcml0ZSh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiAxMzkwLCB5OiAwIH0sXG5cdFx0XHRzY2FsZVg6IDEuNSxcblx0XHRcdHNjYWxlWTogMSxcblx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvYmcucG5nJyxcblx0XHR9KSxcblx0XHRuZXcgU3ByaXRlKHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDAsIHk6IDc4MCB9LFxuXHRcdFx0c2NhbGVYOiAxLjUsXG5cdFx0XHRzY2FsZVk6IDMsXG5cdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L2JhY2tncm91bmQxLnBuZycsXG5cdFx0fSksXG5cdFx0bmV3IFNwcml0ZSh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiAxNDIwLCB5OiA3ODAgfSxcblx0XHRcdHNjYWxlWDogMS41LFxuXHRcdFx0c2NhbGVZOiAzLFxuXHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9iYWNrZ3JvdW5kMS5wbmcnLFxuXHRcdH0pLFxuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMjcwMCwgeTogMCB9LFxuXHRcdFx0c2NhbGVYOiAxLjUsXG5cdFx0XHRzY2FsZVk6IDEsXG5cdFx0XHRJbWFnZV9zcmM6ICcvc3Jjcy9nYW1lL2Fzc2V0cy9DaXR5L2JnLnBuZycsXG5cdFx0fSksXG5cdFx0bmV3IFNwcml0ZSh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiAyNzAwLCB5OiA3ODAgfSxcblx0XHRcdHNjYWxlWDogMS41LFxuXHRcdFx0c2NhbGVZOiAzLFxuXHRcdFx0SW1hZ2Vfc3JjOiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS9iYWNrZ3JvdW5kMS5wbmcnLFxuXHRcdH0pLFxuXHRcdG5ldyBTcHJpdGUoe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMjY1MCwgeTogMTc1MCB9LFxuXHRcdFx0c2NhbGVYOiAwLjcsXG5cdFx0XHRzY2FsZVk6IDAuNyxcblx0XHRcdEltYWdlX3NyYzogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvZmluaXNobGluZS5wbmcnLFxuXHRcdH0pLFxuXHRdO1xuXG5cdC8vIFBsYXRmb3JtcyBmcm9tIG1hcFxuXHRjb25zdCBwbGF0Zm9ybXMgPSBjcmVhdGVMZXZlbEZyb21NYXAobGV2ZWxNYXApO1xuXG5cdC8vIENvbGxpc2lvbiBib3hlc1xuXHRjb25zdCBjb2xsaXNpb25Cb3hlcyA9IFtcblx0XHRuZXcgQ29sbGlzaW9uQm94KHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDY2NSwgeTogNDIwIH0sXG5cdFx0XHR3aWR0aDogMTIwLFxuXHRcdFx0aGVpZ2h0OiAxMTAsXG5cdFx0fSksXG5cdFx0bmV3IENvbGxpc2lvbkJveCh7XG5cdFx0XHRwb3NpdGlvbjogeyB4OiAxNDUwLCB5OiA4MzAgfSxcblx0XHRcdHdpZHRoOiAxMjAsXG5cdFx0XHRoZWlnaHQ6IDEwMCxcblx0XHR9KSxcblx0XHRuZXcgQ29sbGlzaW9uQm94KHtcblx0XHRcdHBvc2l0aW9uOiB7IHg6IDUwLCB5OiAxMDAwIH0sXG5cdFx0XHR3aWR0aDogNTAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2xsaXNpb25Cb3goe1xuXHRcdFx0cG9zaXRpb246IHsgeDogMTY1MCwgeTogNjIwIH0sXG5cdFx0XHR3aWR0aDogMTUwLFxuXHRcdFx0aGVpZ2h0OiAxMDAsXG5cdFx0fSksXG5cdF07XG5cdC8vIFRyYXBzXG5cdGNvbnN0IHRyYXBzID0gW1xuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDE1MCxcblx0XHRcdFx0eTogMTE1MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogOTcwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiA0ODAsXG5cdFx0XHRcdHk6IDE4NzAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDE2MDAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDM1LFxuXHRcdFx0XHR5OiAxODcwLFxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiA4MCxcblx0XHRcdGhlaWdodDogNTAsXG5cdFx0fSksXG5cdFx0bmV3IFRyYXAoe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogODM0LFxuXHRcdFx0XHR5OiAxNjgwLFxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiAzMCxcblx0XHRcdGhlaWdodDogNDAsXG5cdFx0fSksXG5cdFx0bmV3IFRyYXAoe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogMTc2MCxcblx0XHRcdFx0eTogMTY1MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogNjMsXG5cdFx0XHRoZWlnaHQ6IDQwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDE3OTUsXG5cdFx0XHRcdHk6IDExMCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogMjIwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XHRuZXcgVHJhcCh7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAyMTQ1LFxuXHRcdFx0XHR5OiAxMTAsXG5cdFx0XHR9LFxuXHRcdFx0d2lkdGg6IDIyMCxcblx0XHRcdGhlaWdodDogNTAsXG5cdFx0fSksXG5cdFx0bmV3IFRyYXAoe1xuXHRcdFx0cG9zaXRpb246IHtcblx0XHRcdFx0eDogMjI0NSxcblx0XHRcdFx0eTogMzUwLFxuXHRcdFx0fSxcblx0XHRcdHdpZHRoOiAyNjAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDI0OTgsXG5cdFx0XHRcdHk6IDE5MCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogMzAsXG5cdFx0XHRoZWlnaHQ6IDUwLFxuXHRcdH0pLFxuXHRcdG5ldyBUcmFwKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDI3ODAsXG5cdFx0XHRcdHk6IDczMCxcblx0XHRcdH0sXG5cdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0aGVpZ2h0OiA1MCxcblx0XHR9KSxcblx0XTtcblxuXHRjb25zdCBDb2lucyA9IFtcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiAxMDAsXG5cdFx0XHRcdHk6IDUwMCxcblx0XHRcdH0sXG5cdFx0XHRJbWFnZV9zcmNfcHJlZml4OiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS8nLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2luKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDE1MDAsXG5cdFx0XHRcdHk6IDQwMCxcblx0XHRcdH0sXG5cdFx0XHRJbWFnZV9zcmNfcHJlZml4OiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS8nLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2luKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDMwMDAsXG5cdFx0XHRcdHk6IDIwMCxcblx0XHRcdH0sXG5cdFx0XHRJbWFnZV9zcmNfcHJlZml4OiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS8nLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2luKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDI3MDAsXG5cdFx0XHRcdHk6IDMwMCxcblx0XHRcdH0sXG5cdFx0XHRJbWFnZV9zcmNfcHJlZml4OiAnL3NyY3MvZ2FtZS9hc3NldHMvQ2l0eS8nLFxuXHRcdH0pLFxuXHRcdG5ldyBDb2luKHtcblx0XHRcdHBvc2l0aW9uOiB7XG5cdFx0XHRcdHg6IDE5NTAsXG5cdFx0XHRcdHk6IDEwNTAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiA2MzUsXG5cdFx0XHRcdHk6IDEwMDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XHRuZXcgQ29pbih7XG5cdFx0XHRwb3NpdGlvbjoge1xuXHRcdFx0XHR4OiA2MzUsXG5cdFx0XHRcdHk6IDEwMDAsXG5cdFx0XHR9LFxuXHRcdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHR9KSxcblx0XTtcblxuXHRjb25zdCBnYW1lX2NhbnZhcyA9IG5ldyBHYW1lQ2FudmFzKHtcblx0XHRwb3NpdGlvbjogeyB4OiA4LCB5OiA4IH0sXG5cdFx0SW1hZ2Vfc3JjX3ByZWZpeDogJy9zcmNzL2dhbWUvYXNzZXRzL0NpdHkvJyxcblx0XHRwbGF5ZXI6IHBsYXllcixcblx0fSk7XG5cblx0Y29uc3QgZW5kX2dhbWUgPSBuZXcgRW5kR2FtZUZpcnN0R2FtZSh7XG5cdFx0cG9zaXRpb246IHsgeDogMjY4MCwgeTogMTgwMCB9LFxuXHRcdHdpZHRoOiAyNTAsXG5cdFx0aGVpZ2h0OiAxNTAsXG5cdFx0Z2FtZUNhbnZhczogZ2FtZV9jYW52YXMsXG5cdFx0cGxheWVyOiBwbGF5ZXIsXG5cdFx0Y29pbnM6IENvaW5zLFxuXHR9KTtcblxuXHRjb25zdCBoaXN0b3J5REJJbnN0YW5jZSA9IG5ldyBIaXN0b3J5RGF0YWJhc2UoKTtcblx0aGlzdG9yeURCSW5zdGFuY2UubG9hZEZyb21Mb2NhbFN0b3JhZ2UoKTsgLy8gQ2hhcmdlciBsJ2hpc3RvcmlxdWUgZGVwdWlzIGxlIGxvY2FsU3RvcmFnZVxuXG5cdGNvbnN0IGdhbWVIaXN0b3J5ID0gbmV3IEdhbWVIaXN0b3J5KHtcblx0XHRoaXN0b3J5REI6IGhpc3RvcnlEQkluc3RhbmNlLFxuXHR9KTtcblx0XG5cdGNvbnN0IG1hcE1lbnUgPSBuZXcgTWFwTWVudV9jKCk7XG5cblx0Y29uc3QgZW5kX2dhbWUyID0gbmV3IEVuZEdhbWVTZWNvbmRlR2FtZSh7XG5cdFx0Z2FtZUNhbnZhczogZ2FtZV9jYW52YXMsXG5cdFx0cGxheWVyOiBwbGF5ZXIsXG5cdFx0Y29pbnM6IENvaW5zLFxuXHRcdEVuZEdhbWVfRmlyc3RHYW1lOiBlbmRfZ2FtZSxcblx0XHRoaXN0b3J5R2FtZTogZ2FtZUhpc3RvcnksXG5cdFx0TWFwTWVudTogbWFwTWVudSxcblx0fSk7XG5cdFxuXHRcblxuXG5cdGNvbnN0IG1lbnUgPSBuZXcgTWVudSh7XG5cdFx0R2FtZV9IaXN0b3J5IDogZ2FtZUhpc3RvcnksXG5cdH0pO1xuXHRcblxuXG5cdC8vID09PSBIZWxwZXIgRnVuY3Rpb25zID09PVxuXHRmdW5jdGlvbiBoYW5kbGVDb2xsaXNpb24ocGxheWVyLCBib3gpIHtcblx0XHRjb25zdCBpc0NvbGxpZGluZyA9IGJveC5jaGVja0NvbGxpc2lvbihwbGF5ZXIpO1xuXHRcblx0XHRpZiAoaXNDb2xsaWRpbmcpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiY29sbGlzaW9uXCIpO1xuXHRcdH1cblx0fVxuXG5cdHBsYXllci5mb3JjZUNhbWVyYVRvRm9sbG93KHsgY2FudmFzLCBjYW1lcmEgfSk7XG5cblx0ZnVuY3Rpb24gaGFuZGxlUGxheWVyTW92ZW1lbnQocGxheWVyLCBrZXlMZWZ0LCBrZXlSaWdodCkge1xuXHRcdHBsYXllci52ZWxvY2l0eS54ID0gMDtcblx0XG5cdFx0aWYgKGtleVJpZ2h0LnByZXNzZWQpIHtcblx0XHRcdHBsYXllci52ZWxvY2l0eS54ID0gMztcblx0XHRcdGlmIChwbGF5ZXIuc3RhdGUgIT09IFwid2Fsa1wiICYmIHBsYXllci5pc0dyb3VuZGVkICYmIChwbGF5ZXIudmVsb2NpdHkueSA9PT0gMCB8fCBwbGF5ZXIudmVsb2NpdHkueSA9PT0gMC41KSlcblx0XHRcdFx0cGxheWVyLmNoYW5nZVN0YXRlKFwid2Fsa1wiKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoa2V5TGVmdC5wcmVzc2VkKSB7XG5cdFx0XHRwbGF5ZXIudmVsb2NpdHkueCA9IC0zO1xuXHRcdFx0aWYgKHBsYXllci5zdGF0ZSAhPT0gXCJ3YWxrXCIgJiYgcGxheWVyLmlzR3JvdW5kZWQgJiYgKHBsYXllci52ZWxvY2l0eS55ID09PSAwIHx8IHBsYXllci52ZWxvY2l0eS55ID09PSAwLjUpKVxuXHRcdFx0XHRwbGF5ZXIuY2hhbmdlU3RhdGUoXCJ3YWxrXCIpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChwbGF5ZXIuc3RhdGUgPT09IFwid2Fsa1wiKVxuXHRcdFx0XHRwbGF5ZXIuY2hhbmdlU3RhdGUoXCJpZGxlXCIpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwLCByZXNwYXduUG9pbnQpIHtcblx0XHRpZiAodHJhcC5jaGVja0NvbGxpc2lvbihwbGF5ZXIpKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImNvbGxpc2lvbiBhdmVjIGxlIHBpw6hnZVwiKTtcblx0XHRcdHBsYXllci5wb3NpdGlvbi54ID0gcmVzcGF3blBvaW50Lng7XG5cdFx0XHRwbGF5ZXIucG9zaXRpb24ueSA9IHJlc3Bhd25Qb2ludC55O1xuXHRcdFx0cGxheWVyLnZlbG9jaXR5LnggPSAwO1xuXHRcdFx0cGxheWVyLnZlbG9jaXR5LnkgPSAwO1xuXHRcdFx0cGxheWVyLmZvcmNlQ2FtZXJhVG9Gb2xsb3coeyBjYW52YXMsIGNhbWVyYSB9KTtcblx0XHR9XG5cdH1cblxuXHRsZXQgcGF1c2UgPSBmYWxzZTtcblxuXHQvLyBTZXQgdXAgZXZlbnQgbGlzdGVuZXJzXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG5cdFx0c3dpdGNoIChldmVudC5rZXkpIHtcblx0XHRcdC8vIFBsYXllciAxXG5cdFx0XHRjYXNlICdBcnJvd1JpZ2h0Jzpcblx0XHRcdFx0a2V5c1BsYXllcjEucmlnaHQucHJlc3NlZCA9IHRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dMZWZ0Jzpcblx0XHRcdFx0a2V5c1BsYXllcjEubGVmdC5wcmVzc2VkID0gdHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlICdBcnJvd1VwJzpcblx0XHRcdFx0Y29uc29sZS5sb2coXCJVUCBwcmVzc2VkXCIpO1xuXHRcdFx0XHRpZiAoIWdhbWVfY2FudmFzLkdhbWVJc1BhdXNlZClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGlmICgha2V5c1BsYXllcjEuanVtcC5wcmVzc2VkKSB7XG5cdFx0XHRcdFx0XHRrZXlzUGxheWVyMS5qdW1wLnByZXNzZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYgKHBsYXllci5qdW1wcyA9PT0gMCB8fCAocGxheWVyLmp1bXBzID09PSAxICYmICFwbGF5ZXIuZG91YmxlSnVtcCkpIHtcblx0XHRcdFx0XHRcdFx0cGxheWVyLmhhbmRsZUp1bXAoKTsgIC8vIEFwcGVsZXIgbGEgbcOpdGhvZGUgcXVpIGfDqHJlIGxlcyBzYXV0c1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKGNvbGxpc2lvbkJveGVzLnNvbWUoYm94ID0+IGJveC5jaGVja0NvbGxpc2lvbihwbGF5ZXIpKSkge1xuXHRcdFx0XHRcdFx0XHRwbGF5ZXIuY2FudHJhdmVyc2UgPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRwbGF5ZXIuY2FudHJhdmVyc2UgPSBmYWxzZTtcblx0XHRcdFx0XHRcdFx0fSwgNTAwKTtcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJjb2xsaXNpb25cIik7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dEb3duJzpcblx0XHRcdFx0aWYgKGNvbGxpc2lvbkJveGVzLnNvbWUoYm94ID0+IGJveC5jaGVja0NvbGxpc2lvbihwbGF5ZXIpKSkge1xuXHRcdFx0XHRcdHBsYXllci5jYW50cmF2ZXJzZURvd24gPSB0cnVlO1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0XHRcdFx0cGxheWVyLmNhbnRyYXZlcnNlRG93biA9IGZhbHNlO1xuXHRcdFx0XHRcdH0sIDUwKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImNvbGxpc2lvblwiKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgXCJFc2NhcGVcIjpcblx0XHRcdFx0Y29uc29sZS5sb2coXCJFc2NhcGUgcHJlc3NlZFwiKTtcblx0XHRcdFx0aWYgKGdhbWVTdGF0ZS5jdXJyZW50ID09PSBHYW1lU3RhdGUuUGxheSAmJiAhcGF1c2UpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkdhbWUgcGF1c2VkZGRkZGRkZGRkZGRkZGRkZGRkXCIpO1xuXHRcdFx0XHRcdHBhdXNlID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChnYW1lU3RhdGUuY3VycmVudCA9PT0gR2FtZVN0YXRlLlBsYXkgJiYgcGF1c2UpIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIkdhbWUgcmVzdW1lZGRkZGRkZGRkZGRkZGRkZGRkZGRcIik7XG5cdFx0XHRcdFx0cGF1c2UgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdFxuXHRcdH1cblx0fSk7XG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGV2ZW50KSA9PiB7XG5cdFx0c3dpdGNoIChldmVudC5rZXkpIHtcblx0XHRcdGNhc2UgJ0Fycm93UmlnaHQnOlxuXHRcdFx0XHRrZXlzUGxheWVyMS5yaWdodC5wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dMZWZ0Jzpcblx0XHRcdFx0a2V5c1BsYXllcjEubGVmdC5wcmVzc2VkID0gZmFsc2U7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSAnQXJyb3dEb3duJzpcblx0XHRcdFx0cGxheWVyLmNhbnRyYXZlcnNlRG93biA9IGZhbHNlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgJ0Fycm93VXAnOlxuXHRcdFx0XHRrZXlzUGxheWVyMS5qdW1wLnByZXNzZWQgPSBmYWxzZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBoYW5kbGVfZ2FtZXBsYXkoKSB7XG5cdFx0Yy5maWxsU3R5bGUgPSAncmdiYShyZ2IoMTIsIDE3LCAzMykpJztcblx0XHRjLmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cdFx0XG5cdFx0Yy5zYXZlKCk7XG5cdFx0Yy5zY2FsZSgxLCAxKTtcblx0XHRjLnRyYW5zbGF0ZSgtY2FtZXJhLnBvc2l0aW9uLngsIC1jYW1lcmEucG9zaXRpb24ueSk7XG5cdFx0XG5cdFx0YmFja2dyb3VuZHMuZm9yRWFjaChiZyA9PiBiZy51cGRhdGUoKSk7XG5cdFx0XG5cdFx0cGxhdGZvcm1zLmZvckVhY2gocGxhdGZvcm0gPT4gcGxhdGZvcm0uZHJhdygpKTtcblx0XHRcblx0XHQvLyBjb2xsaXNpb25Cb3hlcy5mb3JFYWNoKGJveCA9PiBib3guZHJhdygpKTtcblxuXG5cdFx0Ly8gRHJhdyBjb2luXG5cdFx0Ly8gdHJhcHMuZm9yRWFjaCh0cmFwID0+IHRyYXAuZHJhdygpKTtcblxuXG5cdFx0Ly8gVXBkYXRlIHBsYXllcnNcblx0XHRwbGF5ZXIudXBkYXRlKCk7XG5cdFx0Q29pbnMuZm9yRWFjaChjb2luID0+IGNvaW4udXBkYXRlKCkpO1xuXHRcdFxuXHRcdC8vIFJlc3RvcmUgY29udGV4dCBzdGF0ZVxuXHRcdGMucmVzdG9yZSgpO1xuXHRcdFxuXHRcdC8vID09PSBNb3ZlbWVudCBMb2dpYyA9PT1cblx0XHRpZiAoa2V5c1BsYXllcjEucmlnaHQucHJlc3NlZCkge1xuXHRcdFx0cGxheWVyLnNob3VsZFBhbkNhbWVyYVRvUmlnaHQoe2NhbnZhcywgY2FtZXJhfSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGtleXNQbGF5ZXIxLmxlZnQucHJlc3NlZCkge1xuXHRcdFx0cGxheWVyLnNob3VsZFBhbkNhbWVyYVRvTGVmdCh7Y2FudmFzLCBjYW1lcmF9KTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoa2V5c1BsYXllcjEuanVtcC5wcmVzc2VkKSB7XG5cdFx0XHRwbGF5ZXIuc2hvdWxkUGFuQ2FtZXJhVG9Eb3duKHtjYW52YXMsIGNhbWVyYX0pO1xuXHRcdH1cblx0XHRcblx0XHRoYW5kbGVQbGF5ZXJNb3ZlbWVudChwbGF5ZXIsIGtleXNQbGF5ZXIxLmxlZnQsIGtleXNQbGF5ZXIxLnJpZ2h0KTtcblx0XHRcblx0XHQvLyA9PT0gUGxhdGZvcm0gQ29sbGlzaW9uIENoZWNrID09PVxuXHRcdHBsYXllci5jaGVja0NvbGxpc2lvbihwbGF0Zm9ybXMpO1xuXHRcdFxuXHRcdC8vIENhbWVyYSBmb2xsb3cgbG9naWMgZm9yIGp1bXBzIGFuZCBmYWxsc1xuXHRcdGlmIChwbGF5ZXIudmVsb2NpdHkueSA8IDApIHtcblx0XHRcdHBsYXllci5zaG91bGRQYW5DYW1lcmFUb0Rvd24oe2NhbnZhcywgY2FtZXJhfSk7XG5cdFx0fSBlbHNlIGlmIChwbGF5ZXIudmVsb2NpdHkueSA+IDApIHtcblx0XHRcdHBsYXllci5zaG91bGRQYW5DYW1lcmFUb1VQKHtjYW52YXMsIGNhbWVyYX0pO1xuXHRcdH1cblx0XHRcblx0XHQvLyBVcGRhdGUgZ3JvdW5kZWQgc3RhdHVzXG5cdFx0aWYgKHBsYXllci52ZWxvY2l0eS55ID4gMSkge1xuXHRcdFx0cGxheWVyLmlzR3JvdW5kZWQgPSBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBIYW5kbGUgY29sbGlzaW9ucyB3aXRoIHBhc3MtdGhyb3VnaCBwbGF0Zm9ybXNcblx0XHRjb2xsaXNpb25Cb3hlcy5mb3JFYWNoKGJveCA9PiB7XG5cdFx0XHRoYW5kbGVDb2xsaXNpb24ocGxheWVyLCBib3gpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdC8vIEhhbmRsZSB0cmFwIGNvbGxpc2lvbnNcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbMF0sIHsgeDogMTA1NywgeTogODIxLjE2IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1sxXSwgeyB4OiA0NjMsIHk6IDE2NTMuMTYgfSk7XG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzJdLCB7IHg6IDEwNTcsIHk6IDgyMS4xNiB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbM10sIHsgeDogNDYzLCB5OiAxNjUzLjE2IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1s0XSwgeyB4OiA0NjMsIHk6IDE2NTMuMTYgfSk7XG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzVdLCB7IHg6IDg4MywgeTogMzA5LjE1OTk5OTk5OTk5OTk3IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1s2XSwgeyB4OiA4ODMsIHk6IDMwOS4xNTk5OTk5OTk5OTk5NyB9KTtcblx0XHRoYW5kbGVUcmFwQ29sbGlzaW9uKHBsYXllciwgdHJhcHNbN10sIHsgeDogODgzLCB5OiAzMDkuMTU5OTk5OTk5OTk5OTcgfSk7XG5cdFx0aGFuZGxlVHJhcENvbGxpc2lvbihwbGF5ZXIsIHRyYXBzWzhdLCB7IHg6IDg4MywgeTogMzA5LjE1OTk5OTk5OTk5OTk3IH0pO1xuXHRcdGhhbmRsZVRyYXBDb2xsaXNpb24ocGxheWVyLCB0cmFwc1s5XSwgeyB4OiA4ODMsIHk6IDMwOS4xNTk5OTk5OTk5OTk5NyB9KTtcblxuXHRcdENvaW5zLmZvckVhY2goY29pbiA9PiB7XG5cdFx0XHRpZiAoY29pbi5jaGVja0NvbGxpc2lvbihwbGF5ZXIpKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiY29sbGlzaW9uIGF2ZWMgbGEgcGnDqGNlXCIpO1xuXHRcdFx0XHRjb2luLmRlc3Ryb3koKTtcblx0XHRcdFx0Z2FtZV9jYW52YXMubmJfY29pbisrO1xuXHRcdFx0XHQvLyBHw6lyZXIgbGEgY29sbGVjdGUgZGUgbGEgcGnDqGNlIGljaVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKGVuZF9nYW1lLmNoZWNrQ29sbGlzaW9uKHBsYXllcikpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiY29sbGlzaW9uIGF2ZWMgbGEgZmluIGR1IGpldVwiKTtcblx0XHRcdGlmIChlbmRfZ2FtZS5maXJzdF9nYW1lX2ZpbmlzaGVkID09PSBmYWxzZSlcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJmaXJzdCBnYW1lIGZpbmlzaGVkXCIpO1xuXHRcdFx0XHRnYW1lU3RhdGUuY3VycmVudCA9IEdhbWVTdGF0ZS5FbmRHYW1lRmlyc3RHYW1lO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGVuZF9nYW1lLmZpcnN0X2dhbWVfZmluaXNoZWQgPT09IHRydWUpXG5cdFx0XHR7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwic2Vjb25kIGdhbWUgZmluaXNoZWRcIik7XG5cdFx0XHRcdGdhbWVTdGF0ZS5jdXJyZW50ID0gR2FtZVN0YXRlLkVuZEdhbWVTZWNvbmRHYW1lO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGNvbnNvbGUubG9nKHBsYXllci5wb3NpdGlvbi54LCBwbGF5ZXIucG9zaXRpb24ueSk7XG5cdH1cblx0XG5cdGNvbnN0IG9wdGlvbnMgPSBuZXcgT3B0aW9uKCk7XG5cblx0Ly8gQW5pbWF0aW9uIGxvb3Bcblx0ZnVuY3Rpb24gYW5pbWF0ZSgpIHtcblxuXHRcdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZSk7XG5cdFxuXHRcdC8vID09PSBDbGVhciBDYW52YXMgPT09XG5cdFx0Yy5maWxsU3R5bGUgPSAncmdiYShyZ2IoMTIsIDE3LCAzMykpJztcblx0XHRjLmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG5cblx0XHQvLyBjb25zb2xlLmxvZyhcIkdhbWUgU3RhdGU6XCIsIGdhbWVTdGF0ZS5jdXJyZW50KTtcblx0XHRpZiAoZ2FtZV9jYW52YXMuR2FtZUlzUGF1c2VkKSB7XG5cdFx0XHRwbGF5ZXIudmVsb2NpdHkueCA9IDA7XG5cdFx0XHRwbGF5ZXIudmVsb2NpdHkueSA9IDA7XG5cdFx0fVxuXG5cdFx0Ly8gPT09IEdhbWUgU3RhdGUgTG9naWMgPT09XG5cdFx0c3dpdGNoIChnYW1lU3RhdGUuY3VycmVudCkge1xuXHRcdFx0Y2FzZSBHYW1lU3RhdGUuTWVudTpcblx0XHRcdFx0bWVudS5kcmF3KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBHYW1lU3RhdGUuTWFwTWVudTpcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coXCJNYXAgTWVudVwiKTtcblx0XHRcdFx0bWFwTWVudS5kcmF3KCk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSBHYW1lU3RhdGUuUGxheTpcblx0XHRcdFx0aGFuZGxlX2dhbWVwbGF5KCk7XG5cdFx0XHRcdGdhbWVfY2FudmFzLnVwZGF0ZSgpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgR2FtZVN0YXRlLkVuZEdhbWVGaXJzdEdhbWU6XG5cdFx0XHRcdGVuZF9nYW1lLmRyYXcoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEdhbWVTdGF0ZS5FbmRHYW1lU2Vjb25kR2FtZTpcblx0XHRcdFx0ZW5kX2dhbWUyLmRyYXcoKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIEdhbWVTdGF0ZS5HYW1lSGlzdG9yeTpcblx0XHRcdFx0Z2FtZUhpc3RvcnkuZHJhdygpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgR2FtZVN0YXRlLk9wdGlvbnM6XG5cdFx0XHRcdG9wdGlvbnMuZHJhdygpO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0XG5cdC8vIFN0YXJ0IHRoZSBnYW1lXG5cdGFuaW1hdGUoa2V5c1BsYXllcjEpO1xufVxuIl19