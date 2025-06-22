import { create_environment_view3, create_game , destroy_game} from "../init_game.js";
import { loadScoreModel, destroy_score } from "../score.js";
import { createBall, destroy_ball } from "../ball.js";
import { init_players_tournament } from "./init_player_tournament.js";
import { reset_player_position } from "../player.js";
import { init_game } from "../init_game.js";
import { init_ball, resetBall } from "../ball.js";
import { StorageKeys } from "../../../../api/utils.js";

let ball = null;
let player_1_tournament, player_2_tournament;
let is_init = false;

export async function init_game_tournament(scene)
{
	if (!is_init)
	{
		create_game(scene);

		({ player_1_tournament, player_2_tournament } = init_players_tournament(scene));
	
		if (!player_1_tournament || !player_2_tournament)
			return null;
	
		ball = await createBall(scene).catch(error => {
			console.error(error);
			return null;
		});
	
		if (!ball)
			return null;
	
		loadScoreModel(0, true);
		loadScoreModel(0, false);
		is_init = true;
		
		return { player_1_tournament, player_2_tournament, ball };
	}
	else
	{
		already_init();
		loadScoreModel(0, true);
		loadScoreModel(0, false);
		reset_player_position(player_1_tournament, player_2_tournament);
		resetBall(ball);
		return { player_1_tournament, player_2_tournament, ball };
	}
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



export async function destroy_game_solo_tournament(scene)
{
	destroy_all_by_metadata(scene, "isPlayerRepere");
	destroy_all_by_metadata(scene, "isPlayer_paddle");
	destroy_all_by_metadata(scene, "isPlayer");
	// localStorage.setItem("canPlay", "false");
	StorageKeys.CAN_PLAY = false;
	console.log("localStorage canPlay set to false");
	// if (localStorage.getItem("tournamentStarted") !== "true")
	// 	localStorage.removeItem("Player2");
	destroy_game(scene);
	destroy_ball(ball);
	destroy_score();
}

function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.setEnabled(false));
}

