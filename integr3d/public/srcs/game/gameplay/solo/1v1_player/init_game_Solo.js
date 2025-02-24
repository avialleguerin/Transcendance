import { create_environment_view3, create_game } from "../../init_game.js";
import { init_players } from "../../player.js";
import { loadScoreModel } from "../../score.js";
import { createBall } from "../../ball.js";

let gameStart = false;

export async function init_game_solo(scene) {
    create_environment_view3(scene);
    create_game(scene);
    let { player_1, player_2 } = init_players(scene);
    
    let ball = await createBall(scene).catch(error => {
        console.error(error);
        return null;
    });

    if (ball) {
        console.log("Balle chargée avec position :", ball.position);
    }

    loadScoreModel(0, "left", true);
    loadScoreModel(0, "right", false);
    
    return { player_1, player_2, ball };
}

export function start_game_solo(scene)
{
	gameStart = true;
}