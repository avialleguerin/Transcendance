import { create_environment_view3, create_game , destroy_game} from "../../init_game.js";
import { init_players_and_ai } from "./init_player_and_ai.js";
import { loadScoreModel, destroy_score } from "../../score.js";
import { createBall, destroy_ball } from "../../ball.js";

let gameStart = false;
let ball = null;
let player_1, ai_player;

export async function init_game_ai(scene) {
    create_environment_view3(scene);
    create_game(scene);
    
    ({ player_1, ai_player } = init_players_and_ai(scene));

    ball = await createBall(scene).catch(error => {
        console.error(error);
        return null;
    });

    if (ball) {
        console.log("Balle chargée avec position :", ball.position);
    }

    loadScoreModel(0, "left", true);
    loadScoreModel(0, "right", false);
    
    return { player_1, ai_player, ball };
}

export function start_game_solo(scene)
{
    gameStart = true;
}

// export async function destroy_game_solo(scene)
// {
//     destroy_all_by_metadata(scene, "isPlayerRepere");
//     destroy_all_by_metadata(scene, "isPlayer_paddle");
//     destroy_all_by_metadata(scene, "isPlayer");
//     destroy_environement_view3(scene);
//     destroy_game(scene);
//     destroy_ball(ball);
//     destroy_score();
// }

// function destroy_all_by_metadata(scene, metadataKey) {
// 	scene.meshes
// 		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
// 		.forEach(mesh => mesh.dispose());
// }