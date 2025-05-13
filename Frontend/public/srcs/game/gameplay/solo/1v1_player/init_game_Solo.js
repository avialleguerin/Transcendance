import { create_environment_view3, create_game , destroy_game} from "../../init_game.js";
import { init_players } from "../../player.js";
import { loadScoreModel, destroy_score } from "../../score.js";
import { createBall, destroy_ball, init_ball } from "../../ball.js";
// import { destroy_environement_view3 } from "../../init_game.js";
import { init_game } from "../../init_game.js";
import { reset_player_position } from "../../player.js";

let gameStart = false;
let ball = null;
let player_1, player_2;
let is_init = false;

export async function init_game_solo(scene) {
    if (!is_init)
    {
        create_game(scene);
        
        ({ player_1, player_2 } = init_players(scene));
    
        ball = await createBall(scene).catch(error => {
            console.error(error);
            return null;
        });
    
        if (ball) {
            console.log("Balle chargée avec position :", ball.position);
        }
    
        loadScoreModel(0, true);
        loadScoreModel(0, false);
        is_init = true;
        
        return { player_1, player_2, ball };
    }
    else
    {
        already_init();
        reset_player_position(player_1, player_2);
        return { player_1, player_2, ball };
    }

}

export function start_game_solo(scene)
{
    gameStart = true;
}

function already_init()
{
    enable_all_by_metadata(scene, "isPlayerRepere");
    enable_all_by_metadata(scene, "isPlayer_paddle");
    enable_all_by_metadata(scene, "isPlayer");
    init_game(scene);
    init_ball(ball);
}


function enable_all_by_metadata(scene, metadataKey) {
    scene.meshes
        .filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
        .forEach(mesh => mesh.setEnabled(true));
}

export async function destroy_game_solo(scene)
{
    destroy_all_by_metadata(scene, "isPlayerRepere");
    destroy_all_by_metadata(scene, "isPlayer_paddle");
    destroy_all_by_metadata(scene, "isPlayer");
    destroy_game(scene);
    destroy_ball(ball);
    destroy_score();
}

function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.setEnabled(false));
}