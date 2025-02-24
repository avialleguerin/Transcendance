import { init_2v2_Players } from "./2v2_game/init_players2v2.js";
import { create_environment_view3, create_game} from "../init_game.js";
import { createBall } from "../ball.js";
import { loadScoreModel } from "../score.js";

let gameStart = false;

export async function init_game_multiplayer(scene) {
	create_environment_view3(scene);
	create_game(scene);
	let [ player_1, player_2, player_3, player_4 ] = init_2v2_Players(scene);

	let ball = await createBall(scene).catch(error => {
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