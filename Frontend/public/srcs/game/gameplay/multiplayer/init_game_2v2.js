import { init_2v2_Players } from "./2v2_game/init_players2v2.js";
import { create_environment_view3, create_game, destroy_environement_view3, destroy_game} from "../init_game.js";
import { createBall, destroy_ball } from "../ball.js";
import { loadScoreModel, destroy_score } from "../score.js";

let gameStart = false;
let ball = null;

export async function init_game_multiplayer(scene) {
	create_environment_view3(scene);
	create_game(scene);
	let [ player_1, player_2, player_3, player_4 ] = init_2v2_Players(scene);

	ball = await createBall(scene).catch(error => {
		console.error(error);
		return null;
	});

	if (ball) {
		console.log("Balle chargée avec position :", ball.position);
	}

	loadScoreModel(0, "left", true);
	loadScoreModel(0, "right", false);

	return { player_1, player_2, player_3, player_4, ball };
}

export function start_game_multiplayer(scene) {
	gameStart = true;
}

export function destroy_game_multiplayer(scene) {
	destroy_all_by_metadata(scene, "isPlayer_parent");
	destroy_all_by_metadata(scene, "isPlayer_paddle");
	destroy_all_by_metadata(scene, "isPlayerRepere");
	destroy_all_by_metadata(scene, "isPlayer");
	destroy_ball(ball);
	destroy_score();
	destroy_game(scene);
	destroy_environement_view3(scene);
}


function destroy_all_by_metadata(scene, metadataKey) {
	scene.meshes
		.filter(mesh => mesh.metadata && mesh.metadata[metadataKey])
		.forEach(mesh => mesh.dispose());
}