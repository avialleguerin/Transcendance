import { init_2v2_Players } from "./2v2_game/init_players2v2.js";
import { create_environment_view3, create_game, destroy_game} from "../init_game.js";
import { createBall, destroy_ball } from "../ball.js";
import { loadScoreModel, destroy_score } from "../score.js";
import { reset_player_pos_multi } from "./2v2_game/init_players2v2.js";
import { init_game } from "../init_game.js";
import { init_ball } from "../ball.js";

let gameStart = false;
let ball = null;
let is_init = false;
// Déclarer les variables de joueurs dans la portée du module
let player_1 = null;
let player_2 = null;
let player_3 = null;
let player_4 = null;

export async function init_game_multiplayer(scene) {

    if (!is_init) {
        console.log("init_game_multiplayer");
        create_game(scene);
        
        // Assignez les joueurs aux variables du module
        let players = init_2v2_Players(scene);
        player_1 = players[0];
        player_2 = players[1];
        player_3 = players[2];
        player_4 = players[3];
    
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
        return { player_1, player_2, player_3, player_4, ball };
    }
    else {
        console.log("init_game_multiplayer else");
        already_init();
        reset_player_pos_multi(player_1, player_2, player_3, player_4);
        return { player_1, player_2, player_3, player_4, ball };
    }
}

export function start_game_multiplayer(scene) {
	gameStart = true;
}

export function destroy_game_multiplayer(scene) {
	destroy_all_by_metadata(scene, "isPlayer_parent_2v2");
	destroy_all_by_metadata(scene, "isPlayer_paddle_2v2");
	destroy_all_by_metadata(scene, "isPlayerRepere_2v2");
	destroy_all_by_metadata(scene, "isPlayer_2v2");
	destroy_ball(ball);
	destroy_score();
	destroy_game(scene);
}

function already_init()
{
    console.log("already_init");
	enable_all_by_metadata(scene, "isPlayer_parent_2v2");
	enable_all_by_metadata(scene, "isPlayer_paddle_2v2");
	enable_all_by_metadata(scene, "isPlayerRepere_2v2");
	enable_all_by_metadata(scene, "isPlayer_2v2");
	init_game(scene);
	init_ball(ball);
}

function enable_all_by_metadata(scene, metadataKey) {
    scene.meshes
        .filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
        .forEach(mesh => mesh.setEnabled(true));
}


function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.setEnabled(false));
}