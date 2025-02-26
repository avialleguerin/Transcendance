import { create_environment_view3, create_game , destroy_environement_view3, destroy_game} from "../../init_game.js";
import { init_players, destroy_players, destroy_players_repere, destroy_player_paddle } from "../../player.js";
import { loadScoreModel, destroy_score } from "../../score.js";
import { createBall, destroy_ball } from "../../ball.js";

let gameStart = false;
let ball = null;
let player_1, player_2;

export async function init_game_solo(scene) {
    create_environment_view3(scene);
    create_game(scene);
    
    ({ player_1, player_2 } = init_players(scene));

    ball = await createBall(scene).catch(error => {
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

export async function destroy_game_solo(scene)
{
    destroy_players_repere(scene);
    destroy_player_paddle(scene);
    destroy_player_paddle(scene);
    destroy_players(scene);
    destroy_environement_view3(scene);
    destroy_game(scene);
    destroy_ball(ball);
    destroy_score();
}